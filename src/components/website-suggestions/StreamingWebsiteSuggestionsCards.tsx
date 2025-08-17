import { WebsiteSuggestionCard } from '@/components/website-suggestions/WebsiteSuggestionCard';
import { WebsiteSuggestionCardSkeleton } from '@/components/website-suggestions/WebsiteSuggestionCardSkeleton';
import { useEffect, useMemo, useRef } from 'react';
import { useWebsiteSuggestions } from '@/context/WebsiteSuggestionsContext';
import { TextShimmer } from '../ui/text-shimmer';
import { motion } from 'framer-motion';

export interface StreamingWebsiteSuggestionsCardsProps {
    onStreamEnd?: () => void;
}

const MAX_AMOUNT_OF_LOADING_WEBSITES_SKELETONS = 3;

export const StreamingWebsiteSuggestionsCards = ({ onStreamEnd }: StreamingWebsiteSuggestionsCardsProps) => {
    const { threadSuggestions, startComparison, threadMessages, isStreaming, currentThreadId } =
        useWebsiteSuggestions();

    const skeletonCount = Math.max(MAX_AMOUNT_OF_LOADING_WEBSITES_SKELETONS - (threadSuggestions?.length ?? 0), 1);
    const suggestionsEndRef = useRef<HTMLDivElement | null>(null);

    // Get the latest generation messages for progress display
    const generationMessages = useMemo(() => {
        return threadMessages.filter(
            (msg) =>
                msg.role === 'assistant' &&
                (msg.content.includes('Generated suggestion') || msg.content.includes('Failed to generate')),
        );
    }, [threadMessages]);

    // Scroll to the bottom whenever suggestions change
    useEffect(() => {
        if (suggestionsEndRef.current) {
            suggestionsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [threadSuggestions, threadSuggestions]);

    // Handle stream end
    useEffect(() => {
        if (!isStreaming && currentThreadId && threadSuggestions.length > 0) {
            startComparison();
            onStreamEnd?.();
        }
    }, [isStreaming, currentThreadId, threadSuggestions.length, startComparison, onStreamEnd]);

    // Show progress based on thread suggestions vs expected amount
    const expectedCount = 5; // Default amount from generateSuggestions
    const progressCount = Math.min(threadSuggestions.length, expectedCount);

    return (
        <div className='flex flex-col gap-6'>
            {/* Animate the suggestions */}
            <motion.div
                className='flex flex-col-reverse gap-6'
                layout // This triggers the layout animation when the children change
            >
                {threadSuggestions?.map((website, index) => (
                    <WebsiteSuggestionCard key={website.url || index} websiteSuggestion={website} />
                ))}
            </motion.div>

            {/* Display skeletons if streaming and we haven't reached the expected count */}
            {isStreaming && progressCount < expectedCount && (
                <WebsiteSuggestionCardSkeleton count={Math.min(skeletonCount, expectedCount - progressCount)} />
            )}

            {/* Show streaming status with progress */}
            {isStreaming && (
                <div className='text-sm text-gray-500 flex items-center justify-between'>
                    <TextShimmer>
                        {`Generating suggestions... (${progressCount.toString()}/${expectedCount.toString()})`}
                    </TextShimmer>
                    <span className='text-sm text-gray-400'>AI is working on your request</span>
                </div>
            )}

            {/* Show generation progress in development */}
            {process.env.NODE_ENV === 'development' && isStreaming && generationMessages.length > 0 && (
                <div className='text-xs text-gray-400 border rounded p-2 max-h-32 overflow-y-auto'>
                    <div className='font-semibold mb-1'>Debug - Generation Progress:</div>
                    {generationMessages.slice(-3).map((msg, i) => (
                        <div key={i} className='mb-1 text-xs'>
                            {msg.content}
                        </div>
                    ))}
                </div>
            )}

            {/* Scroll anchor */}
            <div ref={suggestionsEndRef} />
        </div>
    );
};
