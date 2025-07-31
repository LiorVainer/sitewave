'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTree } from '@headless-tree/react';
import {
    checkboxesFeature,
    expandAllFeature,
    hotkeysCoreFeature,
    searchFeature,
    selectionFeature,
    syncDataLoaderFeature,
    TreeState,
} from '@headless-tree/core';
import { buildTreeMap, getSelectedFolderPath } from '@/lib/tree/tree.utils';
import { FolderTreeNode, TreeNode } from '@/types/tree.types';
import { FunctionReturnType } from 'convex/server';
import { api } from '@convex/api';

export type UseBookmarkTreeProps = {
    data: FunctionReturnType<typeof api.bookmarks.getUserFoldersAndBookmarksFlat>;
    onFolderSelect?: (folderPath: string[]) => void;
};

export function useBookmarkTree({ data, onFolderSelect }: UseBookmarkTreeProps) {
    const [state, setState] = useState<Partial<TreeState<TreeNode>>>({});
    const [searchValue, setSearchValue] = useState('');
    const [filteredItems, setFilteredItems] = useState<string[]>([]);
    const [selectedItems, _setSelectedItems] = useState<string[]>([]);

    const setSelectedItems: Dispatch<SetStateAction<string[]>> = (value) => {
        let newSelected: string[];

        if (typeof value === 'function') {
            const newSelected = value(selectedItems);
            _setSelectedItems(newSelected);
        } else {
            newSelected = value;
            _setSelectedItems(newSelected);
        }

        const lastSelectedItem = tree.getItems().find((item) => item.getId() === newSelected.at(-1));

        if (!lastSelectedItem) return;

        const lastSelectedItemPath = getSelectedFolderPath(lastSelectedItem);

        console.log('Selected folder path:', lastSelectedItemPath);

        if (onFolderSelect) {
            onFolderSelect(lastSelectedItemPath?.slice(1) ?? []);
        }
    };

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
            selectedItems,
        },
        setSelectedItems,
        indent: 20,
        getItemName: (item) => item.getItemData().name,
        isItemFolder: (item) => item.getItemData().type === 'folder',
        dataLoader: {
            getItem: (id) => treeItems[id],
            getChildren: (id) => (treeItems[id]?.type === 'folder' ? (treeItems[id] as FolderTreeNode).children : []),
        },
        canCheckFolders: true,
        features: [
            syncDataLoaderFeature,
            selectionFeature,
            hotkeysCoreFeature,
            expandAllFeature,
            searchFeature,
            checkboxesFeature,
        ],
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
    }, [searchValue, tree, treeItems]);

    const selectedFolderPath = useMemo(() => {
        const selected = tree.getSelectedItems();
        console.log(
            'Selected items:',
            selected.map((item) => item.getItemName()),
        );
        if (selected.length === 0) return null;

        const lastSelected = selected.at(-1);

        const path: string[] = [];

        let current = lastSelected;
        while (current) {
            path.unshift(current.getId());
            current = current.getParent();
        }

        return path; // e.g., ['Company', 'Engineering', 'Frontend']
    }, [tree.getSelectedItems()]);

    return {
        tree,
        searchValue,
        setSearchValue,
        filteredItems,
        selectedFolderPath,
        state,
        setState,
    };
}

export type UseBookmarkTree = ReturnType<typeof useBookmarkTree>;
