import { useAction, usePaginatedQuery } from 'convex/react';
import { api } from '@convex/api';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/animate-ui/radix/sidebar';
import { MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWebsiteSuggestions } from '@/context/WebsiteSuggestionsContext';
import { useRouter } from 'next/navigation';
import { formatCreationTime } from '@/lib/date';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ThreadDeleteModal } from './ThreadDeleteModal';
import { useIsMobile } from '@/hooks/use-mobile';

export function ThreadsSidebarGroup() {
    const {
        results: threads,
        status,
        loadMore,
    } = usePaginatedQuery(api.threads.listThreads, {}, { initialNumItems: 10 });

    const deleteThread = useAction(api.threads.deleteThread);

    const router = useRouter();

    const isMobile = useIsMobile();

    const { currentThreadId, setCurrentThreadId } = useWebsiteSuggestions();

    const handleThreadSelect = (selectedThreadId: string) => {
        setCurrentThreadId(selectedThreadId);
        router.push('/');
    };

    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [threadToDelete, setThreadToDelete] = useState<any>(null);

    const handleDelete = async (e: React.MouseEvent, threadId: string) => {
        e.stopPropagation();
        e.preventDefault();
        console.log(`Requesting delete for thread ${threadId}`);
        const threadData = threads?.find((t) => t._id === threadId);
        if (threadData) {
            setThreadToDelete(threadData);
        }
    };

    const confirmDelete = async () => {
        if (!threadToDelete) return;
        try {
            await deleteThread({ threadId: threadToDelete._id });
            if (currentThreadId === threadToDelete._id) {
                setCurrentThreadId(null);
            }
            setThreadToDelete(null);
        } catch (err) {
            console.error(err);
            throw new Error('Failed to delete thread');
        }
    };

    if (!threads || threads.length === 0) {
        return (
            <SidebarGroup>
                <SidebarGroupLabel>Threads</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className='px-2 py-2 text-sm text-muted-foreground'>No threads available</div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        );
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Threads</SidebarGroupLabel>
            <SidebarMenu>
                {threads.map((thread) => {
                    const isHover = hoveredId === thread._id;

                    return (
                        <SidebarMenuItem
                            key={thread._id}
                            onMouseEnter={() => setHoveredId(thread._id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <SidebarMenuButton
                                onClick={() => handleThreadSelect(thread._id)}
                                className={cn(
                                    'w-full justify-start gap-4 h-auto py-2 cursor-pointer',
                                    currentThreadId === thread._id && 'bg-accent text-accent-foreground',
                                )}
                                tooltip={thread.summary || thread.title}
                            >
                                <MessageSquare size={2} className='flex-shrink-0' />
                                <div className='flex flex-col items-start text-left min-w-0 flex-1'>
                                    <span className='text-sm font-normal truncate w-full'>{thread.title}</span>
                                    <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                                        <span>{formatCreationTime(thread.creationTime)}</span>
                                    </div>
                                </div>
                                <Dialog
                                    open={threadToDelete?._id === thread._id}
                                    onOpenChange={(open) => !open && setThreadToDelete(null)}
                                >
                                    <DialogTrigger asChild>
                                        <motion.button
                                            aria-label='Delete thread'
                                            title='Delete'
                                            onClick={(e) => handleDelete(e, thread._id)}
                                            className='md:absolute block right-2 top-1/2 md:-translate-y-1/2 rounded-md md:shadow p-2 bg-background z-50 cursor-pointer'
                                            initial={{ opacity: 0 }}
                                            animate={isHover || isMobile ? { opacity: 1 } : { opacity: 0 }}
                                            transition={{ duration: 0.2, ease: 'easeOut' }}
                                        >
                                            <Trash2 size={16} className='text-muted-foreground md:text-destructive' />
                                        </motion.button>
                                    </DialogTrigger>
                                    {threadToDelete?._id === thread._id && (
                                        <ThreadDeleteModal thread={threadToDelete} onConfirm={confirmDelete} />
                                    )}
                                </Dialog>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}

                {status === 'CanLoadMore' && (
                    <SidebarMenuButton className='text-center' onClick={() => loadMore(10)}>
                        Load more threads...
                    </SidebarMenuButton>
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
