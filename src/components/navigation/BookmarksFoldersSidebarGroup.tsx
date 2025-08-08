'use client';

import { useQuery } from 'convex/react';
import { SidebarGroup, SidebarGroupLabel } from '../animate-ui/radix/sidebar';
import { BookmarkTree } from '@/components/bookmarks/bookmarks-tree/BookmarkTree';
import { api } from '@convex/api';

export const BookmarksFoldersSidebarGroup = () => {
    const foldersAndBookmarks = useQuery(api.bookmarks.getUserFoldersAndBookmarksFlat, {});

    if (!foldersAndBookmarks) return null;

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Bookmarks</SidebarGroupLabel>
            <BookmarkTree data={foldersAndBookmarks} navigableItems />
        </SidebarGroup>
    );
};
