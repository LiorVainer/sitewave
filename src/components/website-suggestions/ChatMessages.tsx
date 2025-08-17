import { WebsiteSuggestionCard } from '@/components/website-suggestions/WebsiteSuggestionCard';
import { useWebsiteSuggestions } from '@/context/WebsiteSuggestionsContext';
import { WebsiteSuggestionCardSkeleton } from '@/components/website-suggestions/WebsiteSuggestionCardSkeleton';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { useEffect } from 'react';

export interface ChatMessagesProps {}

const MAX_AMOUNT_OF_LOADING_WEBSITES_SKELETONS = 3;

export const ChatMessages = ({}: ChatMessagesProps) => {
    const { threadMessages, isStreaming, threadSuggestions, currentThreadId, startComparison } =
        useWebsiteSuggestions();
    const skeletonCount = Math.max(MAX_AMOUNT_OF_LOADING_WEBSITES_SKELETONS - (threadSuggestions?.length ?? 0), 1);

    const expectedCount = 5; // Default amount from generateSuggestions
    const progressCount = Math.min(threadSuggestions.length, expectedCount);

    useEffect(() => {
        if (!isStreaming && currentThreadId && threadSuggestions.length > 0) {
            console.log('Stream ended, starting comparison');
            startComparison();
        }
    }, [currentThreadId, isStreaming, startComparison, threadSuggestions.length]);

    return (
        <div className='flex flex-col gap-6 overflow-auto'>
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
            </div>
        </div>
    );
};
