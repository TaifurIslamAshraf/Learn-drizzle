import { index, integer, pgTable, primaryKey, serial, varchar } from 'drizzle-orm/pg-core';
import { user } from './user';

export const groups = pgTable('groups', {
    id: serial('id').notNull().primaryKey(),
    name: varchar('name').notNull(),
});

export const usersToGroups = pgTable(
    'usersToGroups',
    {
        userId: integer('userId')
            .notNull()
            .references(() => user.id),
        groupId: integer('groupId')
            .notNull()
            .references(() => groups.id),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.userId, table.groupId] }),
        userIdIndex: index('userIdIndex').on(table.userId),
    }),
);
