import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    websites: defineTable({
        url: v.string(),
        name: v.string(),
        description: v.string(),

        upvotes: v.array(v.string()), // userIds
        downvotes: v.array(v.string()),

        ratings: v.array(
            v.object({
                userId: v.string(),
                rating: v.number(), // 1–5 scale (your choice)
                comment: v.optional(v.string()),
            }),
        ),
        videosOfWebsite: v.optional(
            v.array(
                v.object({
                    title: v.string(),
                    url: v.string(),
                }),
            ),
        ),
        tags: v.optional(v.array(v.string())),
    }).index('by_url', ['url']),

    folders: defineTable({
        userId: v.string(),
        name: v.string(),
        parentFolderId: v.optional(v.id('folders')),
    })
        .index('by_userId', ['userId'])
        .index('by_userId_name_parentFolderId', ['userId', 'name', 'parentFolderId'])
        .index('by_parentFolder', ['parentFolderId']),

    bookmarks: defineTable({
        userId: v.string(),
        websiteId: v.optional(v.id('websites')), // ✅ Reference to websites table
        folderId: v.optional(v.id('folders')),
    })
        .index('by_userId', ['userId'])
        .index('by_folderId', ['folderId'])
        .index('by_websiteId', ['websiteId']),
});
