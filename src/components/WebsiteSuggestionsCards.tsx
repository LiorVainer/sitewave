import { WebsiteSuggestionCard } from '@/components/website-suggestions/WebsiteSuggestionCard';
import { WebsiteSuggestionCardSkeleton } from '@/components/website-suggestions/WebsiteSuggestionCardSkeleton';
import { StreamableValue, useStreamableValue } from 'ai/rsc';
import { PartialWebsiteSuggestion } from '@/models/website-suggestion.model';
import { useEffect, useState } from 'react';

export interface WebsiteSuggestionsProps {
    websiteSuggestionsStream: StreamableValue<PartialWebsiteSuggestion[]>;
    resetSignal: number;
}

const MAX_AMOUNT_OF_LOADING_WEBSITES_SKELETONS = 3;

export const WebsiteSuggestionsCards = ({ websiteSuggestionsStream, resetSignal }: WebsiteSuggestionsProps) => {
    const [streamedSuggestions, _error, isLoading] = useStreamableValue(websiteSuggestionsStream);
    const [localSuggestions, setLocalSuggestions] = useState<PartialWebsiteSuggestion[]>([]);
    const skeletonCount = Math.max(MAX_AMOUNT_OF_LOADING_WEBSITES_SKELETONS - (localSuggestions?.length ?? 0), 0);

    console.log(streamedSuggestions, isLoading);

    useEffect(() => {
        // Reset suggestions when input is submitted
        setLocalSuggestions([]);
    }, [resetSignal]);

    useEffect(() => {
        if (!streamedSuggestions) return;

        // Append new items that are not already in localSuggestions
        setLocalSuggestions((prev) => {
            const existingTitles = new Set(prev.map((w) => w.title));
            const toAdd = streamedSuggestions.filter((w) => !existingTitles.has(w.title));
            if (toAdd.length === 0) return prev;
            return [...prev, ...toAdd];
        });
    }, [streamedSuggestions]);

    return (
        <div className='flex flex-col gap-6'>
            {isLoading && (
                <div className='text-sm text-gray-500 flex items-center justify-between'>
                    <p>Generating suggestions...</p>
                    <button className='text-sm underline text-red-500' type='button' onClick={() => stop()}>
                        Stop
                    </button>
                </div>
            )}
            <div className='grid gap-6'>
                {localSuggestions?.map((website, index) => (
                    <WebsiteSuggestionCard key={index} website={website} />
                ))}
            </div>

            {isLoading && <WebsiteSuggestionCardSkeleton count={skeletonCount} />}
        </div>
    );
};
