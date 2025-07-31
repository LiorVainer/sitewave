'use client';

import { FunctionReturnType } from 'convex/server';
import { api } from '@convex/api';
import { BookmarkTreeToolbar } from './BookmarkTreeToolbar';
import { BookmarkTreeSearch } from './BookmarkTreeSearch';
import { BookmarkTreeFolders } from './BookmarkTreeFolders';
import { useBookmarkTree } from './hooks/useBookmarkTree';
import { useSidebar } from '@/components/animate-ui/radix/sidebar';

export type BookmarkTreeProps = {
    data: FunctionReturnType<typeof api.bookmarks.getUserFoldersAndBookmarksFlat>;
    navigableItems?: boolean;
    onFolderSelect?: (folderPath: string[]) => void;
};

export function BookmarkTree({ data, navigableItems, onFolderSelect }: BookmarkTreeProps) {
    const { tree, searchValue, setSearchValue, setState } = useBookmarkTree({
        data,
        onFolderSelect,
    });

    const sidebar = useSidebar();
    const hideComponent = sidebar && sidebar.state === 'collapsed';

    if (!data) return null;
    if (hideComponent) return null;

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
