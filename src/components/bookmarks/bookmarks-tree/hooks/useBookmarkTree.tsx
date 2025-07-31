'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTree } from '@headless-tree/react';
import {
    expandAllFeature,
    hotkeysCoreFeature,
    searchFeature,
    selectionFeature,
    syncDataLoaderFeature,
    TreeState,
} from '@headless-tree/core';
import { buildTreeMap } from '@/lib/tree/tree.utils';
import { FolderTreeNode, TreeNode } from '@/types/tree.types';
import { FunctionReturnType } from 'convex/server';
import { api } from '@convex/api';

export function useBookmarkTree(data: FunctionReturnType<typeof api.bookmarks.getUserFoldersAndBookmarksFlat>) {
    const [state, setState] = useState<Partial<TreeState<TreeNode>>>({});
    const [searchValue, setSearchValue] = useState('');
    const [filteredItems, setFilteredItems] = useState<string[]>([]);

    const treeItems = useMemo(() => {
        if (!data) return {};
        return buildTreeMap(data.folders, data.bookmarks);
    }, [data]);

    const tree = useTree<TreeNode>({
        rootItemId: 'root',
        state,
        setState,
        initialState: {
            expandedItems: ['root'],
            selectedItems: [],
        },
        indent: 20,
        getItemName: (item) => item.getItemData().name,
        isItemFolder: (item) => item.getItemData().type === 'folder',
        dataLoader: {
            getItem: (id) => treeItems[id],
            getChildren: (id) => (treeItems[id]?.type === 'folder' ? (treeItems[id] as FolderTreeNode).children : []),
        },
        features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature, expandAllFeature, searchFeature],
    });

    useEffect(() => {
        if (!searchValue) {
            setFilteredItems([]);
            return;
        }

        const allItems = tree.getItems();
        const lowerSearch = searchValue.toLowerCase();

        const directMatches = allItems
            .filter((item) => item.getItemName().toLowerCase().includes(lowerSearch))
            .map((item) => item.getId());

        const parentIds = new Set<string>();
        for (const id of directMatches) {
            let item = tree.getItems().find((i) => i.getId() === id);
            while (item?.getParent && item.getParent()) {
                const parent = item.getParent();
                if (!parent) break;
                parentIds.add(parent.getId());
                item = parent;
            }
        }

        const childrenIds = new Set<string>();
        for (const id of directMatches) {
            const item = tree.getItems().find((i) => i.getId() === id);
            if (item?.isFolder()) {
                const collect = (cid: string) => {
                    const children = (treeItems[cid] as FolderTreeNode)?.children || [];
                    for (const child of children) {
                        childrenIds.add(child);
                        if (treeItems[child]?.type === 'folder') collect(child);
                    }
                };
                collect(id);
            }
        }

        setFilteredItems([...directMatches, ...parentIds, ...childrenIds]);
        const folderIds = allItems.filter((i) => i.isFolder()).map((i) => i.getId());
        setState((prev) => ({
            ...prev,
            expandedItems: [...new Set([...(prev.expandedItems ?? []), ...folderIds])],
        }));
    }, [searchValue]);

    return {
        tree,
        searchValue,
        setSearchValue,
        filteredItems,
        state,
        setState,
    };
}
