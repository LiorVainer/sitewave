'use client';

import { FunctionReturnType } from 'convex/server';
import { api } from '@convex/api';
import { BookmarkTreeToolbar } from './BookmarkTreeToolbar';
import { BookmarkTreeSearch } from './BookmarkTreeSearch';
import { BookmarkTreeFolders } from './BookmarkTreeFolders';
import { useBookmarkTree } from './hooks/useBookmarkTree';

export type BookmarkTreeProps = {
    data: FunctionReturnType<typeof api.bookmarks.getUserFoldersAndBookmarksFlat>;
    navigableItems?: boolean;
};

export function BookmarkTree({ data, navigableItems }: BookmarkTreeProps) {
    const { tree, searchValue, setSearchValue, setState } = useBookmarkTree(data);

    if (!data) return null;

    return (
        <div className='flex flex-col gap-2'>
            <BookmarkTreeToolbar onExpand={tree.expandAll} onCollapse={tree.collapseAll} />
            <BookmarkTreeSearch
                value={searchValue}
                onChange={setSearchValue}
                onClear={() => {
                    setSearchValue('');
                    setState((prev) => ({ ...prev, expandedItems: [] }));
                }}
                treeSearchProps={tree.getSearchInputElementProps()}
            />
            <BookmarkTreeFolders tree={tree} navigableItems={navigableItems} />
        </div>
    );
}
