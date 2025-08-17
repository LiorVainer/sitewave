import { WebsiteSuggestionCard } from '@/components/website-suggestions/WebsiteSuggestionCard';
import { useWebsiteSuggestions } from '@/context/WebsiteSuggestionsContext';
import { WebsiteSuggestionCardSkeleton } from '@/components/website-suggestions/WebsiteSuggestionCardSkeleton';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { useEffect, useRef } from 'react';
import { AMOUNT_OF_SUGGESTIONS_PER_GENERATION } from '@/constants/prompts.const';

export interface ChatMessagesProps {}

const MAX_AMOUNT_OF_LOADING_WEBSITES_SKELETONS = 3;

export const ChatMessages = ({}: ChatMessagesProps) => {
    const { threadMessages, isGenerating, threadSuggestions, currentThreadId, startComparison } =
        useWebsiteSuggestions();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const skeletonCount = Math.max(MAX_AMOUNT_OF_LOADING_WEBSITES_SKELETONS - (threadSuggestions?.length ?? 0), 1);

    // Calculate expected count as the next multiple of 5
    const expectedCount =
        Math.ceil((threadSuggestions.length + 1) / AMOUNT_OF_SUGGESTIONS_PER_GENERATION) *
        AMOUNT_OF_SUGGESTIONS_PER_GENERATION;
    const progressCount = Math.min(threadSuggestions.length, expectedCount);

    // Scroll to bottom when thread messages change, thread ID changes, or on mount
    useEffect(() => {
        const scrollToBottom = () => {
            // Find the scrollable parent container (TabsContent with overflow-auto)
            const scrollableParent = scrollContainerRef.current?.closest('.overflow-auto') as HTMLElement;
            if (scrollableParent) {
                scrollableParent.scrollTo({
                    top: scrollableParent.scrollHeight,
                    behavior: 'smooth',
                });
            }
        };

        // Use requestAnimationFrame to ensure DOM has fully rendered
        const rafId = requestAnimationFrame(() => {
            scrollToBottom();
        });

        return () => cancelAnimationFrame(rafId);
    }, [threadMessages?.length, currentThreadId]); // This will trigger on mount since threadMessages starts as undefined/empty

    // Also scroll to bottom immediately when component mounts with existing messages
    useEffect(() => {
        const scrollToBottom = () => {
            if (threadMessages && threadMessages.length > 0) {
                const scrollableParent = scrollContainerRef.current?.closest('.overflow-auto') as HTMLElement;
                if (scrollableParent) {
                    scrollableParent.scrollTo({
                        top: scrollableParent.scrollHeight,
                        behavior: 'instant',
                    });
                }
            }
        };

        // Use double RAF to ensure all layout calculations are complete
        const rafId = requestAnimationFrame(() => {
            requestAnimationFrame(scrollToBottom);
        });

        return () => cancelAnimationFrame(rafId);
    }, []); // Empty dependency array ensures this runs only on mount

    useEffect(() => {
        if (!isGenerating && currentThreadId && threadSuggestions.length > 0) {
            console.log('Stream ended, starting comparison');
            startComparison();
        }
    }, [currentThreadId, threadSuggestions.length]);

    return (
        <div ref={scrollContainerRef} className='flex flex-col gap-6 h-full'>
            <div className='grid gap-6'>
                {threadMessages?.map((message, index) => {
                    if (message.role === 'assistant') {
                        // Try to parse suggestion JSON for assistant messages
                        let suggestion = null;
                        try {
                            suggestion = JSON.parse(message.content);
                        } catch {
                            suggestion = null;
                        }
                        if (suggestion && suggestion.title && suggestion.url && suggestion.description) {
                            return <WebsiteSuggestionCard key={index} websiteSuggestion={suggestion} />;
                        }
                        // If not a valid suggestion, skip rendering
                        return null;
                    }
                    // For user messages, show as plain text bubble
                    return (
                        <div
                            key={index}
                            className='rounded-lg bg-muted px-4 py-2 text-sm text-gray-800 w-fit max-w-2xl'
                        >
                            {message.content}
                        </div>
                    );
                })}
                {isGenerating && progressCount < expectedCount && (
                    <WebsiteSuggestionCardSkeleton count={Math.min(skeletonCount, expectedCount - progressCount)} />
                )}
                {/* Show streaming status with progress */}
                {isGenerating && (
                    <div className='text-sm text-gray-500 flex items-center justify-between'>
                        <TextShimmer>
                            {`Generating suggestions... (${progressCount.toString()}/${expectedCount.toString()})`}
                        </TextShimmer>
                    </div>
                )}
            </div>
        </div>
    );
};
