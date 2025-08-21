import { FolderTreeNode, TreeNode } from '@/types/tree.types';
import { ItemInstance } from '@headless-tree/core';
import { PopulatedBookmarkDocument } from '@/data/data.types';
import { Doc } from '@convex/dataModel';

export function buildTreeMap(
    folders: Doc<'folders'>[],
    bookmarks: PopulatedBookmarkDocument[],
): Record<string, TreeNode> {
    const map: Record<string, TreeNode> = {};
    const childrenMap: Record<string, string[]> = {};

    // Add folders
    for (const folder of folders) {
        map[folder._id] = {
            ...folder,
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
            _id: bookmarkId,
            name: bookmark.website!.name,
            type: 'bookmark',
            url: bookmark.website!.url,
        };

        const parentId = bookmark.folderId ?? 'root';
        if (!childrenMap[parentId]) childrenMap[parentId] = [];
        childrenMap[parentId].push(bookmarkId);
    }

    // Inject synthetic root node
    map['root'] = {
        _id: 'root',
        name: 'All Folders',
        type: 'folder',
        children: childrenMap['root'] ?? [],
        color: '',
    };

    // Attach children
    for (const [parentId, children] of Object.entries(childrenMap)) {
        if (map[parentId] && map[parentId].type === 'folder') {
            (map[parentId] as FolderTreeNode).children = children;
        }
    }

    return map;
}

export const getSelectedFolderPath = (selected: ItemInstance<TreeNode>) => {
    const path: string[] = [];

    let current: ItemInstance<TreeNode> | undefined = selected;
    while (current) {
        path.unshift(current.getItemName());
        current = current.getParent();
    }

    console.log({ path });

    return path;
};
