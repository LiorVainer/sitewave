'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '../animate-ui/radix/sidebar';
import { FolderTreeItem } from '@/components/navigation/FolderTreeItem';

export const BookmarksFoldersSidebarGroup = () => {
    const foldersWithBookmarks = useQuery(api.bookmarks.getUserFoldersWithBookmarks);

    console.log('Folders with bookmarks:', foldersWithBookmarks);

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Bookmarks</SidebarGroupLabel>
            <SidebarMenu>
                {foldersWithBookmarks?.map((folder: any) => (
                    <FolderTreeItem key={folder._id} folder={folder} />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
};
