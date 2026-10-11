import { table, text, integer } from 'sdk/db';
export const state = table('support_state', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at').notNull().default(0),
});
