'use client';

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from '@/components/animate-ui/radix/sidebar';

export const EmptyThreadsState = () => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className='px-2 py-2 text-sm text-muted-foreground'>No Chats available</div>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
};
