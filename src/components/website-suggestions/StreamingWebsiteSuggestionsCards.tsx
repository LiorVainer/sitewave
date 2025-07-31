import { WebsiteSuggestionCard } from '@/components/website-suggestions/WebsiteSuggestionCard';
import { WebsiteSuggestionCardSkeleton } from '@/components/website-suggestions/WebsiteSuggestionCardSkeleton';
import { useStreamableValue } from 'ai/rsc';
import { useEffect } from 'react';
import { useWebsiteSuggestions } from '@/context/WebsiteSuggestionsContext';
import { WebsiteSuggestionWithMandatoryFields } from '@/models/website-suggestion.model';

export interface StreamingWebsiteSuggestionsCardsProps {
    onStreamEnd?: () => void;
}

const MAX_AMOUNT_OF_LOADING_WEBSITES_SKELETONS = 3;

export const StreamingWebsiteSuggestionsCards = ({ onStreamEnd }: StreamingWebsiteSuggestionsCardsProps) => {
    const { websiteSuggestionsStream, localSuggestions, addSuggestion, startComparison } = useWebsiteSuggestions();
    const [lastSuggestion, _error, isLoading] = useStreamableValue(websiteSuggestionsStream!);
    const skeletonCount = Math.max(MAX_AMOUNT_OF_LOADING_WEBSITES_SKELETONS - (localSuggestions?.length ?? 0), 1);

    useEffect(() => {
        if (!isLoading) {
            startComparison();
            onStreamEnd?.();
        }
        if (!lastSuggestion || !isLoading) return;

        if (lastSuggestion.title && lastSuggestion.url && lastSuggestion.description) {
            addSuggestion(lastSuggestion as WebsiteSuggestionWithMandatoryFields);
        }
    }, [isLoading, lastSuggestion]);

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
                    <WebsiteSuggestionCard isStreaming key={index} websiteSuggestion={website} />
                ))}
            </div>

            {isLoading && <WebsiteSuggestionCardSkeleton count={skeletonCount} />}
        </div>
    );
};
