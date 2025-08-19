'use client';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    useSidebar,
} from '@/components/animate-ui/radix/sidebar';
import { Dialog } from '@/components/ui/dialog';
import { ThreadItem } from './ThreadItem';
import { LoadMoreThreadsButton } from '../navigation/LoadMoreThreadsButton';
import { ThreadDeleteModal } from './ThreadDeleteModal';
import { THREADS_PAGE_SIZE, useThreadsData } from '@/hooks/use-threads-data';
import { EmptyThreadsState } from '@/components/threads/EmptyThreadsState';
import { SidebarGroupSkeleton } from '@/components/navigation/SidebarGroupSkeleton';

export function ThreadsSidebarGroup() {
    const {
        threads,
        status,
        currentThreadId,
        threadToDelete,
        handleThreadSelect,
        handleDelete,
        confirmDelete,
        cancelDelete,
        loadMoreThreads,
    } = useThreadsData();

    const sidebar = useSidebar();
    const hideComponent = sidebar && sidebar.state === 'collapsed';
    const noData = !threads || (threads && threads.length === 0);

    console.log({ status, threads, noData });

    if (status !== 'LoadingFirstPage' && noData) {
        return <EmptyThreadsState />;
    }

    if (hideComponent) return null;

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <SidebarMenu>
                {status === 'LoadingFirstPage' && noData && <SidebarGroupSkeleton itemsAmount={THREADS_PAGE_SIZE} />}
                {threads.map((thread) => (
                    <SidebarMenuItem key={thread._id}>
                        <ThreadItem
                            thread={thread}
                            isActive={currentThreadId === thread._id}
                            onSelect={handleThreadSelect}
                            onDelete={handleDelete}
                        />
                    </SidebarMenuItem>
                ))}

                <LoadMoreThreadsButton onLoadMore={loadMoreThreads} canLoadMore={status === 'CanLoadMore'} />
            </SidebarMenu>

            <Dialog open={!!threadToDelete} onOpenChange={(open) => !open && cancelDelete()}>
                {threadToDelete && <ThreadDeleteModal thread={threadToDelete} onConfirm={confirmDelete} />}
            </Dialog>
        </SidebarGroup>
    );
}
