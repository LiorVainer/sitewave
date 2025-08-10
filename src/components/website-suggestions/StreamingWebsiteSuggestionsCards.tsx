import { WebsiteSuggestionCard } from '@/components/website-suggestions/WebsiteSuggestionCard';
import { WebsiteSuggestionCardSkeleton } from '@/components/website-suggestions/WebsiteSuggestionCardSkeleton';
import { useStreamableValue } from 'ai/rsc';
import { useEffect, useRef } from 'react';
import { useWebsiteSuggestions } from '@/context/WebsiteSuggestionsContext';
import { WebsiteSuggestionWithMandatoryFields } from '@/models/website-suggestion.model';
import { TextShimmer } from '../ui/text-shimmer';
import { motion } from 'framer-motion';

export interface StreamingWebsiteSuggestionsCardsProps {
    onStreamEnd?: () => void;
}

const MAX_AMOUNT_OF_LOADING_WEBSITES_SKELETONS = 3;

export const StreamingWebsiteSuggestionsCards = ({ onStreamEnd }: StreamingWebsiteSuggestionsCardsProps) => {
    const { websiteSuggestionsStream, localSuggestions, addSuggestion, startComparison } = useWebsiteSuggestions();
    const [lastSuggestion, _error, isLoading] = useStreamableValue(websiteSuggestionsStream!);
    const skeletonCount = Math.max(MAX_AMOUNT_OF_LOADING_WEBSITES_SKELETONS - (localSuggestions?.length ?? 0), 1);

    const suggestionsEndRef = useRef<HTMLDivElement | null>(null); // To track the bottom of the suggestions list

    // Scroll to the bottom whenever the localSuggestions change
    useEffect(() => {
        if (suggestionsEndRef.current) {
            suggestionsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [localSuggestions]);

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
            {/* Animate the localSuggestions div with framer-motion */}
            <motion.div
                className='flex flex-col-reverse gap-6'
                layout // This triggers the layout animation when the children (localSuggestions) change
            >
                {localSuggestions?.map((website, index) => (
                    <WebsiteSuggestionCard key={index} websiteSuggestion={website} />
                ))}
            </motion.div>

            {/* Display skeletons if loading */}
            {isLoading && <WebsiteSuggestionCardSkeleton count={skeletonCount} />}
            {isLoading && (
                <div className='text-sm text-gray-500 flex items-center justify-between'>
                    <TextShimmer>Generating suggestions...</TextShimmer>
                    <button className='text-sm underline text-red-500' type='button' onClick={() => stop()}>
                        Stop
                    </button>
                </div>
            )}

            {/* Scroll to the bottom */}
            <div ref={suggestionsEndRef} />
        </div>
    );
};
