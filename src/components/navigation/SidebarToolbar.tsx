'use client';

import { Button } from '@/components/ui/button';
import { useWebsiteSuggestions } from '@/context/WebsiteSuggestionsContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Bookmark, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SidebarGroup, SidebarMenu, useSidebar } from '@/components/animate-ui/radix/sidebar';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CreateBookmarkModal } from '@/components/bookmarks/CreateBookmarkModal';

export const SidebarToolbar = () => {
    const { setCurrentPrompt } = useWebsiteSuggestions();
    const router = useRouter();

    const { toggleSidebar, state } = useSidebar();
    const isMobile = useIsMobile();

    const hideComponent = state === 'collapsed';

    const handleNewChat = () => {
        if (isMobile) {
            toggleSidebar();
        }
        setCurrentPrompt('');
        router.push('/');
    };

    if (hideComponent) return null;

    return (
        <SidebarGroup className='w-full'>
            <SidebarMenu className='flex lg:flex-row w-full gap-2'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size='sm' variant='default' className='flex-1 py-2 lg:py-5'>
                            <Bookmark size={16} className='-ms-1' />
                            New Bookmark
                        </Button>
                    </DialogTrigger>
                    <CreateBookmarkModal />
                </Dialog>
                <Button variant='gradient' className='lg:py-5 flex-1 gap-2' onClick={handleNewChat}>
                    <MessageSquare size={18} />
                    New Chat
                </Button>
            </SidebarMenu>
        </SidebarGroup>
    );
};
