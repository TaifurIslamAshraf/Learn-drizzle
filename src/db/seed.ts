import { faker } from '@faker-js/faker';
import { db } from '.';
import { logger } from '../config/logger';
import * as schema from './schema';

async function main() {
    const userIds = await Promise.all(
        Array(50)
            .fill('')
            .map(async () => {
                const user = await db
                    .insert(schema.user)
                    .values({
                        name: faker.person.fullName(),
                        email: faker.internet.email(),
                        age: faker.number.int({ max: 100 }),
                        password: '123456',
                    })
                    .returning();

                return user[0].id;
            }),
    );

    const postIds = await Promise.all(
        Array(50)
            .fill('')
            .map(async () => {
                const posts = await db
                    .insert(schema.posts)
                    .values({
                        authorId: faker.helpers.arrayElement(userIds),
                        content: faker.lorem.paragraph(),
                        title: faker.lorem.sentence(),
                    })
                    .returning();

                return posts[0].id;
            }),
    );

    await Promise.all(
        Array(50)
            .fill('')
            .map(async () => {
                const comments = await db
                    .insert(schema.comments)
                    .values({
                        authorId: faker.helpers.arrayElement(userIds),
                        postId: faker.helpers.arrayElement(postIds),
                        text: faker.lorem.sentence(),
                    })
                    .returning();

                return comments[0].id;
            }),
    );

    const insertedGroups = await db
        .insert(schema.groups)
        .values([
            {
                name: 'JS',
            },
            {
                name: 'TS',
            },
        ])
        .returning();

    const groupIds = insertedGroups.map((group) => group.id);

    await Promise.all(
        userIds.map(async (userId) => {
            return await db
                .insert(schema.usersToGroups)
                .values({
                    userId,
                    groupId: faker.helpers.arrayElement(groupIds),
                })
                .returning();
        }),
    );
}

main()
    .then(() => {
        logger.info('Seeding is Start');
    })
    .catch((err) => logger.error(err))
    .finally(() => logger.info('Seeding is Complete'));
