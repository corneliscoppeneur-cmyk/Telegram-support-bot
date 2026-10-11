# Gruppennetzwerk Support Bot

[Deutsch](#deutsch) · [English](#english) · [AI assistant instructions](#ai-assistant-instructions)

## Deutsch

Ein Telegram-Support-Bot, der direkt auf **Telegram Serverless** läuft. Nutzer schreiben dem Bot privat. Für jeden Kontakt erstellt er ein eigenes Thema in einer privaten Support-Gruppe. Mitarbeiter antworten dort und der Bot übermittelt die Antwort zurück in den privaten Chat.

### Funktionen

- Rechenaufgabe zur Verifizierung neuer Kontakte.
- Eigenes Support-Thema pro Kontakt.
- Übertragung von Text, Fotos, Dateien und Sprachnachrichten.
- Antworten aus der Support-Gruppe an den jeweiligen Kontakt.
- Thema schließen: weitere Nachrichten sperren. Thema öffnen: Sperre aufheben.
- Speicherung der Zuordnungen in der integrierten Telegram-Datenbank.
- Keine separate VPS- oder Cloudflare-Installation erforderlich.

Nach der Verifizierung erscheint:

> Bitte stelle einfach deine Anfrage. Hier antworten echte Menschen, sobald wir Zeit haben.

### Voraussetzungen

- Node.js 18 oder neuer und npm.
- Ein eigener Telegram-Bot, erstellt über [@BotFather](https://t.me/BotFather).
- Für diesen Bot aktiviertes Telegram Serverless.
- Eine private Supergruppe mit aktivierten Themen.
- Bot als Administrator mit der Berechtigung **Themen verwalten**.

### Installation

1. Repository herunterladen und entpacken oder klonen.
2. In `tgcloud/lib/config.js` die ID deiner Support-Gruppe eintragen:

```js
export const SUPPORT_GROUP_ID = -1001234567890;
```

3. Bei BotFather: **Bot → Serverless → CLI Access** öffnen und den Access Token abrufen. Dieser beginnt mit `app…:…` und unterscheidet sich vom normalen Bot-API-Token.
4. Im Projektordner ausführen:

```sh
npm ci
npx tgcloud login
npx tgcloud push
npx tgcloud migrate
npx tgcloud webhook sync
npx tgcloud status
```

Bei `login` den CLI Access Token lokal eingeben. Die angezeigte Datenbankmigration vor dem Bestätigen prüfen.

**Bestehende Projekte:** Vor einem Upload `npx tgcloud fetch`, `npx tgcloud status` und `npx tgcloud diff` verwenden. `push` synchronisiert den gesamten Modulbestand. Bereits online vorhandene Module, die lokal fehlen, können entfernt werden. Dieses Paket ist für eine neue Installation vorgesehen.

### Funktionstest

1. Bot privat öffnen und **Start** drücken.
2. Rechenaufgabe beantworten und anschließend eine Anfrage senden.
3. Prüfen, ob ein eigenes Thema in der Support-Gruppe entsteht.
4. Mit deinem persönlichen Profil im Thema antworten und die private Zustellung prüfen.
5. Foto, Datei und Sprachnachricht sowie Schließen und Öffnen des Themas testen.

Lokale Tests:

```sh
node test.mjs
```

Die Tests simulieren SDK und Datenbank. Die persönliche Installation des Projektinitiators wurde zusätzlich live getestet.

### Grenzen und Betrieb

- Menschen beantworten die Anfragen; KI-Antworten sind nicht enthalten.
- Jedes persönliche Mitglied der Support-Gruppe kann antworten. Die Gruppe nur für vertrauenswürdige Mitarbeiter freigeben.
- Anonyme Administratoren und andere Bots werden ignoriert.
- Alben werden als einzelne Nachrichten übertragen.
- Themen schließen statt löschen. Gelöschte Themen benötigen eine Reparatur der gespeicherten Zuordnung.
- Gleichzeitige Erstnachrichten und Wiederholungen nach Teilfehlern können doppelte Themen oder Nachrichten erzeugen. Eine Exactly-once-Verarbeitung ist nicht garantiert.
- Kosten und Kontingente richten sich nach den aktuellen Telegram-Serverless-Bedingungen.
- Ein Zahlungsmodul ist nicht enthalten.
- Tokens gehören weder in das Repository noch in Logs. Lokale Zugangsdaten und `node_modules` sind über `.gitignore` ausgeschlossen.

### Weitere Bots bauen

Eine Anleitung für ein gemeinsames ChatGPT-Work-Projekt, getrennte Bot-Projekte und wiederverwendbare KI-Anweisungen steht in [docs/WEITERE-BOTS-DE.md](docs/WEITERE-BOTS-DE.md).

### Herkunft und Nutzungsrechte

Die Portierung basiert auf [moeacgx/Telegram-SuperGM](https://github.com/moeacgx/Telegram-SuperGM). Im geprüften Stand des Ausgangsrepositorys war keine Lizenzdatei vorhanden. Dieses Paket vergibt deshalb keine zusätzliche Lizenz für den abgeleiteten Code. Die Rechte zur öffentlichen oder kostenpflichtigen Weitergabe müssen mit dem ursprünglichen Rechteinhaber geklärt sein.

## English

A Telegram support bot running directly on **Telegram Serverless**. Users message the bot privately. The bot creates a separate topic for each contact in a private support group. Staff reply in that topic, and the bot delivers the reply to the contact's private chat.

### Features

- Arithmetic verification for new contacts.
- A dedicated support topic for each contact.
- Routing for text, photos, documents, and voice messages.
- Private delivery of staff replies from the support group.
- Closing a topic blocks further incoming messages; reopening it restores routing.
- Contact-to-topic mappings stored in Telegram's built-in database.
- No separate VPS or Cloudflare installation required.

The deployed user interface is in German. After verification, users see a message meaning:

> Please send your request. Real people will reply as soon as they have time.

### Requirements

- Node.js 18 or later and npm.
- Your own Telegram bot created through [@BotFather](https://t.me/BotFather).
- Telegram Serverless enabled for that bot.
- A private supergroup with topics enabled.
- The bot added as an administrator with **Manage Topics** permission.

### Installation

1. Download and extract this repository, or clone it.
2. Set your support group's ID in `tgcloud/lib/config.js`:

```js
export const SUPPORT_GROUP_ID = -1001234567890;
```

3. Open **BotFather → your bot → Serverless → CLI Access** and obtain the access token. It starts with `app…:…` and is different from the normal Bot API token.
4. Run these commands in the project folder:

```sh
npm ci
npx tgcloud login
npx tgcloud push
npx tgcloud migrate
npx tgcloud webhook sync
npx tgcloud status
```

Enter the CLI access token locally when prompted by `login`. Review the proposed database migration before approving it.

**Existing projects:** Run `npx tgcloud fetch`, `npx tgcloud status`, and `npx tgcloud diff` before deploying. `push` synchronizes the complete module set. Cloud modules absent from your local project may be removed. This package is intended for a fresh installation.

### Testing

1. Open the bot privately and press **Start**.
2. Answer the arithmetic question, then send a support request.
3. Confirm that a dedicated topic appears in the support group.
4. Reply in that topic using your personal profile and confirm private delivery.
5. Test a photo, document, voice message, and topic closing/reopening.

Run local tests:

```sh
node test.mjs
```

These tests simulate the SDK and database. The project initiator's personal deployment has also been tested live.

### Limitations and operation

- Staff answer requests; AI-generated replies are not included.
- Any personal member of the support group can reply. Restrict membership to trusted staff.
- Anonymous administrators and other bots are ignored.
- Albums are delivered as individual messages.
- Close topics rather than deleting them. Deleted topics require repairing the stored mapping.
- Concurrent first messages and retries after partial failures may create duplicate topics or messages. Exactly-once processing is not guaranteed.
- Costs and quotas depend on the current Telegram Serverless terms.
- No payment module is included.
- Never commit tokens or include them in logs. Local credentials and `node_modules` are excluded by `.gitignore`.

### Building more bots

See [docs/WEITERE-BOTS-DE.md](docs/WEITERE-BOTS-DE.md) for the German guide to organizing multiple bots in ChatGPT Work, keeping deployments separate, and reusing AI instructions.

### Attribution and usage rights

This port is based on [moeacgx/Telegram-SuperGM](https://github.com/moeacgx/Telegram-SuperGM). No license file was present in the reviewed upstream version. This package therefore grants no additional license for the derived code. Rights to public or commercial redistribution must be clarified with the original rights holder.

## AI assistant instructions

This section provides implementation context for AI coding assistants. It does not add an AI feature to the bot.

### Runtime and project map

| File | Responsibility |
| --- | --- |
| `tgcloud/handlers/message.js` | Receives the Message payload; verification and bidirectional routing |
| `tgcloud/schema.js` | Defines the `support_state` SQLite-backed table |
| `tgcloud/lib/config.js` | Defines the destination support group ID |
| `test.mjs` | Local tests using simulated SDK and database |
| `package.json` | CLI dependency and deployment scripts |

- Runtime: Telegram Serverless JavaScript modules, not Node.js on the server.
- Import platform APIs from `sdk` and database builders/operators from `sdk/db`.
- The message handler receives `update.message` directly, not the full Update envelope.
- `api.<method>(params)` returns the unwrapped Bot API result and throws on failures.
- Database operations are asynchronous. Await all terminal calls.
- Do not introduce Cloudflare bindings, a polling daemon, an external webhook server, or a VPS requirement.

### Stored state

| Key | Value |
| --- | --- |
| `user:<userId>` | JSON object containing `thread_id`, `title`, and `closed` |
| `thread:<threadId>` | Contact's Telegram user ID as a string |
| `verified:<userId>` | Verification flag |
| `challenge:<userId>` | JSON object containing `question` and `answer`; logical expiry after 15 minutes |

The database stores routing and verification metadata. This implementation does not store message bodies in that table. Challenge expiration is checked on reads; it is not a scheduled database cleanup.

### Modification and deployment workflow

1. Read the current source and preserve existing behavior unless a change is requested.
2. Keep credentials out of code, documentation, tests, archives, and logs.
3. Run `node test.mjs` after modifying routing behavior. Mock tests do not prove platform compatibility or live delivery.
4. Before deploying an existing bot, inspect `fetch`, `status`, and `diff`. Preserve all unrelated deployed modules.
5. Deploy with `push`; review and apply schema changes with `migrate` when required.
6. Run `webhook sync` if the handler set changes, and inspect `status`.
7. Verify live delivery using a consenting test user and the intended support group.
8. Do not describe payment handling, album grouping, exactly-once delivery, or AI replies as implemented: they are absent.

### Official references

- [Telegram Serverless](https://core.telegram.org/bots/serverless)
- [Telegram Bot API](https://core.telegram.org/bots/api)
