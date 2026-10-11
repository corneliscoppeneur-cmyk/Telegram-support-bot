import { api, db } from 'sdk';
import { eq } from 'sdk/db';
import { state } from '../schema.js';
import { SUPPORT_GROUP_ID } from '../lib/config.js';

const TOPIC_MAP = {
  async get(key, options) {
    const row = await db.select().from(state).where(eq(state.key, key)).get();
    if (!row || (row.expiresAt && row.expiresAt <= Date.now())) return null;
    return options?.type === 'json' ? JSON.parse(row.value) : row.value;
  },
  async put(key, value, options) {
    const record = { key, value, expiresAt: options?.expirationTtl ? Date.now() + options.expirationTtl * 1000 : 0 };
    await db.insert(state).values(record).onConflictDoUpdate({ target: state.key, set: { value: record.value, expiresAt: record.expiresAt } }).run();
  },
  async delete(key) { await db.delete(state).where(eq(state.key, key)).run(); }
};
const env = { SUPERGROUP_ID: SUPPORT_GROUP_ID, TOPIC_MAP };

export default async function(message) {
  if (message.chat?.type === 'private') return handlePrivateMessage(message, env);
  if (message.chat?.id !== env.SUPERGROUP_ID) return;
  const thread = message.message_thread_id;
  if (!thread) return;
  if (message.forum_topic_closed) return markThreadClosed(thread, env);
  if (message.forum_topic_reopened) return markThreadReopened(thread, env);
  return handleTopicMessage(message, env);
}

async function handlePrivateMessage(msg, env, ctx) {
  const userId = msg.chat.id;
  const key = `user:${userId}`;

  if (!(await handleVerificationMessage(msg, env))) return;

  if (msg.text && /^\/start(?:@\w+)?(?:\s|$)/i.test(msg.text.trim())) {
    await api.sendMessage({ chat_id: userId, text: "Bitte stelle einfach deine Anfrage. Hier antworten echte Menschen, sobald wir Zeit haben." });
    return;
  }

  let rec = await env.TOPIC_MAP.get(key, { type: "json" });
  if (rec && rec.closed) {
    await tgCall(env, "sendMessage", {
      chat_id: userId,
      text: "Dein Support-Thema wurde geschlossen. Bitte warte, bis es wieder geöffnet wird.",
    });
    return;
  }
  if (!rec) rec = await createAndStoreTopic(msg.from, key, env);


  const res = await tgCall(env, "forwardMessage", {
    chat_id: env.SUPERGROUP_ID,
    from_chat_id: userId,
    message_id: msg.message_id,
    message_thread_id: rec.thread_id,
  });


}

async function handleTopicMessage(msg, env, ctx) {
  const threadId = msg.message_thread_id;
  const botId = Number(env.BOT_ID || 0);
  if (!msg.from || msg.from.is_bot || Number(msg.from.id) === botId || msg.from.id === 1087968824) return;

  const userId = await findUserByThread(threadId, env);
  if (!userId) return;


  const res = await tgCall(env, "copyMessage", {
    chat_id: userId,
    from_chat_id: env.SUPERGROUP_ID,
    message_id: msg.message_id,
  });

}

async function createAndStoreTopic(from, key, env) {
  const title = buildTopicTitle(from);
  const res = await tgCall(env, "createForumTopic", { chat_id: env.SUPERGROUP_ID, name: title });
  if (!res.ok) throw new Error("createForumTopic failed: " + res.description);
  const rec = { thread_id: res.result.message_thread_id, title, closed: false };
  await env.TOPIC_MAP.put(key, JSON.stringify(rec));
  await env.TOPIC_MAP.put(`thread:${rec.thread_id}`, String(from.id));
  return rec;
}

function buildTopicTitle(from) {
  const first = from.first_name || "";
  const last = from.last_name || "";
  const nick = `${first} ${last}`.trim();
  if (from.username) {
    const at = "@" + from.username;
    return (nick ? `${nick} ${at}` : at).slice(0, 128);
  }
  return (nick || "User").slice(0, 128);
}

async function tgCall(env, method, body) {
  return { ok: true, result: await api[method](body) };
}

async function setThreadClosed(threadId, closed, env) {
  const uid = await findUserByThread(threadId, env);
  if (!uid) return;
  const key = `user:${uid}`;
  const rec = await env.TOPIC_MAP.get(key, { type: "json" });
  if (rec) { rec.closed = closed; await env.TOPIC_MAP.put(key, JSON.stringify(rec)); }
}
async function markThreadClosed(id, env) { await setThreadClosed(id, true, env); }
async function markThreadReopened(id, env) { await setThreadClosed(id, false, env); }

async function isVerified(uid, env) {
  const flag = await env.TOPIC_MAP.get(`verified:${uid}`);
  return Boolean(flag);
}

const VERIFICATION_TTL_SECONDS = 900;

async function handleVerificationMessage(msg, env) {
  const userId = msg.chat.id;
  if (await isVerified(userId, env)) return true;

  const challengeKey = `challenge:${userId}`;
  let challenge = await env.TOPIC_MAP.get(challengeKey, { type: "json" });
  if (!challenge) {
    challenge = createChallenge();
    await env.TOPIC_MAP.put(challengeKey, JSON.stringify(challenge), {
      expirationTtl: VERIFICATION_TTL_SECONDS,
    });
    await sendChallenge(userId, challenge, env);
    return false;
  }

  if (isChallengeAnswer(msg.text, challenge.answer)) {
    await env.TOPIC_MAP.put(`verified:${userId}`, "1");
    await env.TOPIC_MAP.delete(challengeKey);
    await tgCall(env, "sendMessage", {
      chat_id: userId,
      text: "✅ Bestätigt. Bitte stelle einfach deine Anfrage. Hier antworten echte Menschen, sobald wir Zeit haben.",
    });
    console.log("verified-set", { uid: userId });
    return false;
  }

  await tgCall(env, "sendMessage", {
    chat_id: userId,
    text: `❌ Falsche Antwort. Versuche es erneut:\n\n${challenge.question}`,
  });
  return false;
}

function createChallenge() {
  const left = randomInt(10, 99);
  const right = randomInt(10, 99);
  const subtraction = randomInt(0, 1) === 1;
  const first = subtraction ? Math.max(left, right) : left;
  const second = subtraction ? Math.min(left, right) : right;
  const operator = subtraction ? "-" : "+";
  return {
    question: `${first} ${operator} ${second} = ?`,
    answer: subtraction ? first - second : first + second,
  };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isChallengeAnswer(value, expected) {
  if (typeof value !== "string") return false;
  const normalized = value
    .trim()
    .replace(/[０-９]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xff10 + 0x30));
  return /^-?\d+$/.test(normalized) && Number(normalized) === expected;
}

async function sendChallenge(userId, challenge, env) {
  await tgCall(env, "sendMessage", {
    chat_id: userId,
    text: [
      "Willkommen beim Support. Bitte löse zuerst diese Rechenaufgabe.",
      "Antworte mit der Zahl:",
      "",
      challenge.question,
      "",
      "Die Aufgabe ist 15 Minuten gültig. Danach kannst du deine Frage senden.",
    ].join("\n"),
  });
}

async function findUserByThread(threadId, env) {
  const uid = await env.TOPIC_MAP.get(`thread:${threadId}`);
  return uid ? Number(uid) : null;
}
