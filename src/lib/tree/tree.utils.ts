import { FolderTreeNode, TreeNode } from '@/types/tree.types';

export function buildTreeMap(
    folders: { _id: string; name: string; parentFolderId: string | null }[],
    bookmarks: { _id: string; title: string; url: string; folderId: string | null }[],
): Record<string, TreeNode> {
    const map: Record<string, TreeNode> = {};
    const childrenMap: Record<string, string[]> = {};

    // Add folders
    for (const folder of folders) {
        map[folder._id] = {
            id: folder._id,
            name: folder.name,
            type: 'folder',
            children: [],
        };

        const parentId = folder.parentFolderId ?? 'root';
        if (!childrenMap[parentId]) childrenMap[parentId] = [];
        childrenMap[parentId].push(folder._id);
    }

    // Add bookmarks
    for (const bookmark of bookmarks) {
        const bookmarkId = `bookmark-${bookmark._id}`;
        map[bookmarkId] = {
            id: bookmarkId,
            name: bookmark.title,
            type: 'bookmark',
            url: bookmark.url,
        };

        const parentId = bookmark.folderId ?? 'root';
        if (!childrenMap[parentId]) childrenMap[parentId] = [];
        childrenMap[parentId].push(bookmarkId);
    }

    // Inject synthetic root node
    map['root'] = {
        id: 'root',
        name: 'All Folders',
        type: 'folder',
        children: childrenMap['root'] ?? [],
    };

    // Attach children
    for (const [parentId, children] of Object.entries(childrenMap)) {
        if (map[parentId] && map[parentId].type === 'folder') {
            (map[parentId] as FolderTreeNode).children = children;
        }
    }

    return map;
}
