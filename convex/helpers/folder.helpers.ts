import { Id } from '../_generated/dataModel';
import { DatabaseWriter } from '../_generated/server';

export async function getOrCreateFolderPath(
    ctx: { db: DatabaseWriter; auth: any },
    userId: string,
    folderPath: string[],
) {
    let parentFolderId: Id<'folders'> | undefined;

    for (const name of folderPath) {
        const existing = await ctx.db
            .query('folders')
            .withIndex('by_userId_name_parentFolderId', (q) =>
                q.eq('userId', userId).eq('name', name).eq('parentFolderId', parentFolderId),
            )
            .first();

        parentFolderId = existing
            ? existing._id
            : await ctx.db.insert('folders', {
                  userId,
                  name,
                  parentFolderId,
              });
    }

    return parentFolderId;
}
