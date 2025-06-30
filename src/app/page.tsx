'use client';

import { PartialWebsiteSuggestion } from '@/models/website-suggestion.model';
import { WebsiteSuggestionInput } from '@/components/website-suggestions/WebsiteSuggestionInput';
import { StreamableValue } from 'ai/rsc';
import { useState } from 'react';
import { suggestWebsites } from '@/app/actions';
import { WebsiteSuggestionsCards } from '@/components/WebsiteSuggestionsCards';

export default function SiteSuggestions() {
    const [websiteSuggestionsStream, setWebsiteSuggestionsStream] = useState<StreamableValue<
        PartialWebsiteSuggestion[]
    > | null>(null);

    const [resetSignal, setResetSignal] = useState(0);

    const handleSubmit = async (prompt: string, amount: number[]) => {
        setResetSignal((n) => n + 1);
        const stream = await suggestWebsites(prompt, amount[0]);
        setWebsiteSuggestionsStream(stream);
    };

    return (
        <div className='space-y-6 py-6 px-6 w-full @4xl/main:px-[5cqw] @5xl/main:px-[15cqw] @7xl/main:px-[25cqw] lg:py-16'>
            <h1 className='text-2xl font-semibold'>Discover Websites</h1>

            <WebsiteSuggestionInput
                // onSubmit={(prompt, amount) => submit({ prompt, amount: amount[0] })}
                onSubmit={handleSubmit}
                placeholder='e.g. Best tools for productivity'
                className='w-full'
            />

            {websiteSuggestionsStream && (
                <WebsiteSuggestionsCards
                    resetSignal={resetSignal}
                    websiteSuggestionsStream={websiteSuggestionsStream}
                />
            )}
        </div>
    );
}
