import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const player = pgTable('players', {
  id: text().primaryKey(),
  name: text(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow()
});

export type Player = typeof player.$inferSelect;
export type InsertPlayer = typeof player.$inferInsert;
export type SelectPlayer = typeof player.$inferSelect;
