'use client';

import { Button } from '@/components/ui/button';
import { useWebsiteSuggestions } from '@/context/WebsiteSuggestionsContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SidebarGroup, SidebarMenu, useSidebar } from '@/components/animate-ui/radix/sidebar';

export const SidebarNewChatButton = () => {
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
        <SidebarGroup>
            <SidebarMenu>
                <Button variant='gradient' className='py-5 w-full gap-2' onClick={handleNewChat}>
                    <MessageSquare size={18} />
                    New Chat
                </Button>
            </SidebarMenu>
        </SidebarGroup>
    );
};
