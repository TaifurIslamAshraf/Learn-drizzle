import type { InferSelectModel } from 'drizzle-orm';
import { boolean, integer, jsonb, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
    id: serial('id').notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).unique('email').notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    age: integer('age').notNull(),
    isActive: boolean('isActive').notNull().default(false),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const profileInfo = pgTable('userInfo', {
    id: serial('id').notNull().primaryKey(),
    meta: jsonb('meta'),
    userId: integer('userId').references(() => user.id),
});

export type SelectProfileModel = InferSelectModel<typeof user>;
export type SelectUserModel = InferSelectModel<typeof user>;
