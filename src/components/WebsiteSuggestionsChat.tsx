import { useState } from 'react';
import { suggestWebsites } from '@/app/actions';
import { WebsiteSuggestionInput } from '@/components/website-suggestions/WebsiteSuggestionInput';
import { WebsiteSuggestionsCards } from '@/components/WebsiteSuggestionsCards';
import { useWebsiteSuggestions } from './website-suggestions/WebsiteSuggestionsContext';
import { LoadMoreButton } from '@/components/LoadMoreButton';

export const WebsiteSuggestionsChat = () => {
    const { setWebsiteSuggestionsStream, websiteSuggestionsStream, clearSuggestions, localSuggestions, suggestedUrls } =
        useWebsiteSuggestions();
    const [currentPrompt, setCurrentPrompt] = useState('');

    const handleSubmit = async (amount: number) => {
        if (!currentPrompt) return;

        clearSuggestions();
        const stream = await suggestWebsites(currentPrompt, amount);
        setWebsiteSuggestionsStream(stream);
    };

    const handleLoadMore = async (amount: number) => {
        if (!currentPrompt) return;

        const stream = await suggestWebsites(currentPrompt, amount, suggestedUrls);
        setWebsiteSuggestionsStream(stream);
    };

    return (
        <div className='space-y-6 py-6 px-6 w-full @4xl/main:px-[5cqw] @5xl/main:px-[15cqw] @7xl/main:px-[25cqw] lg:py-16'>
            <h1 className='text-2xl font-semibold'>Discover Websites</h1>

            <WebsiteSuggestionInput
                value={currentPrompt}
                setValue={setCurrentPrompt}
                onSubmit={handleSubmit}
                placeholder='e.g. Best tools for productivity'
                className='w-full'
            />

            {websiteSuggestionsStream && <WebsiteSuggestionsCards />}

            {localSuggestions.length > 0 && <LoadMoreButton handleLoadMore={handleLoadMore} />}
        </div>
    );
};
