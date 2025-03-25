import { pgTable, serial, text, timestamp, boolean, date, jsonb } from 'drizzle-orm/pg-core';

export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  notificationTime: text('notification_time'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const onboardingResponses = pgTable('onboarding_responses', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  responses: jsonb('responses').notNull(),
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const journalEntries = pgTable('journal_entries', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  date: date('date').notNull(),
  reflections: text('reflections'),
  intentions: text('intentions'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});