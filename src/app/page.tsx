'use client';

import { WebsiteSuggestionsChat } from '@/components/website-suggestions/WebsiteSuggestionsChat';
import { AppSidebar } from '@/components/navigation/AppSidebar';

export default function Home() {
    return (
        <AppSidebar>
            <WebsiteSuggestionsChat />
        </AppSidebar>
    );
}
