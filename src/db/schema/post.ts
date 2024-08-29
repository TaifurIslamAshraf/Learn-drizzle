import type { InferSelectModel } from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { user } from './user';

export const posts = pgTable('posts', {
    id: serial('id').notNull().primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    authorId: integer('authorId')
        .references(() => user.id)
        .notNull(),
});

export const comments = pgTable('comments', {
    id: serial('id').notNull().primaryKey(),
    text: text('text').notNull(),
    authorId: integer('authorId')
        .notNull()
        .references(() => user.id),
    postId: integer('postId')
        .notNull()
        .references(() => posts.id),
});

export type SelectPostsModel = InferSelectModel<typeof posts>;
export type SelectCommentsModel = InferSelectModel<typeof comments>;
