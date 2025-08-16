'use client';
import { useQuery } from 'convex/react';
import { api } from '@convex/api';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/animate-ui/radix/sidebar';
import { Calendar, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWebsiteSuggestions } from '@/context/WebsiteSuggestionsContext';
import { useRouter } from 'next/navigation';

export function ThreadsSidebarGroup() {
    const threads = useQuery(api.threads.listThreads, {
        paginationOpts: { cursor: null, numItems: 20 },
    });

    const router = useRouter();

    const { currentThreadId, setCurrentThreadId } = useWebsiteSuggestions();

    const handleThreadSelect = (selectedThreadId: string) => {
        router.replace('/');
        setCurrentThreadId(selectedThreadId);
    };

    if (!threads || threads.page.length === 0) {
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
                {threads.page.map((thread) => (
                    <SidebarMenuItem key={thread._id}>
                        <SidebarMenuButton
                            onClick={() => handleThreadSelect(thread._id)}
                            className={cn(
                                'w-full justify-start gap-2 h-auto py-2 cursor-pointer',
                                currentThreadId === thread._id && 'bg-accent text-accent-foreground',
                            )}
                            tooltip={thread.summary || thread.title}
                        >
                            <MessageSquare className='h-4 w-4 flex-shrink-0' />
                            <div className='flex flex-col items-start text-left min-w-0 flex-1'>
                                <span className='text-sm font-medium truncate w-full'>{thread.title}</span>
                                <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                                    <Calendar className='h-3 w-3' />
                                    <span>{thread.creationDate}</span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}

                {threads.continueCursor && (
                    <SidebarMenuItem>
                        <div className='px-2 py-2 text-xs text-muted-foreground text-center'>
                            + {threads.continueCursor ? 'Load more threads...' : ''}
                        </div>
                    </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
