'use client';

import { Button } from '@/components/ui/button';
import { useWebsiteSuggestions } from '@/context/WebsiteSuggestionsContext';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const SidebarNewChatButton = () => {
    const { setCurrentPrompt } = useWebsiteSuggestions();
    const router = useRouter();

    const handleNewChat = () => {
        setCurrentPrompt('');
        router.push('/');
    };

    return (
        <Button variant='gradient' className='py-5 w-full gap-2' onClick={handleNewChat}>
            <MessageSquare size={18} />
            New Chat
        </Button>
    );
};
