'use client';

import { SidebarGroup, SidebarGroupLabel } from '../animate-ui/radix/sidebar';
import { BookmarkTree } from '@/components/bookmarks/bookmarks-tree/BookmarkTree';
import { api } from '@convex/api';
import { useQueryWithStatus } from '@/lib/convex';
import { SidebarGroupSkeleton } from '@/components/navigation/SidebarGroupSkeleton';

export const BOOKMARKS_FOLDERS_SKELETON_ITEMS_AMOUNT = 3;

export const BookmarksFoldersSidebarGroup = () => {
    const { data: foldersAndBookmarks, isPending } = useQueryWithStatus(
        api.bookmarks.getUserFoldersAndBookmarksFlat,
        {},
    );

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Bookmarks</SidebarGroupLabel>
            {isPending && !foldersAndBookmarks ? (
                <SidebarGroupSkeleton itemsAmount={BOOKMARKS_FOLDERS_SKELETON_ITEMS_AMOUNT} />
            ) : (
                <BookmarkTree data={foldersAndBookmarks} navigableItems />
            )}
        </SidebarGroup>
    );
};
