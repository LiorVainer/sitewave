'use client';

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo } from 'react';
import { WebsiteSuggestion, WebsiteSuggestionWithMandatoryFields } from '@/models/website-suggestion.model';
import { ComparisonColumn } from '@/models/website-comparison.model';
import { FullDynamicZodType } from '@/lib/zod.utils';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useWebsitesComparison } from '@/hooks/use-websites-comparison';
import { api } from '@convex/api';
import { toUIMessages, UIMessage, useThreadMessages } from '@convex-dev/agent/react';
import { parseAsString, useQueryState } from 'nuqs';

interface WebsiteSuggestionsContextType {
    clearSuggestions: () => void;
    startComparison: () => void;
    suggestedUrls: string[];
    comparisonColumns: ComparisonColumn[];
    comparisonRows: FullDynamicZodType[];
    isLoadingComparison: boolean;
    currentPrompt: string;
    setCurrentPrompt: Dispatch<SetStateAction<string>>;
    showStreamingCards: boolean;
    setShowStreamingCards: Dispatch<SetStateAction<boolean>>;
    // Thread-related properties using URL params
    currentThreadId: string | null;
    setCurrentThreadId: (threadId: string | null) => void;
    threadMessages: UIMessage[];
    isLoadingThreadMessages: boolean;
    isGenerating: boolean;
    setIsGenerating: Dispatch<SetStateAction<boolean>>;
    // Extracted suggestions from thread messages
    threadSuggestions: WebsiteSuggestionWithMandatoryFields[];
    // Add loadMore function
    loadMoreThreadMessages: (numOfItems: number) => void;
}

export const THREADS_MESSAGES_PAGE_SIZE = 10;

export const WebsiteSuggestionsContext = createContext<WebsiteSuggestionsContextType | undefined>(undefined);

export const useWebsiteSuggestions = () => {
    const ctx = useContext(WebsiteSuggestionsContext);
    if (!ctx) throw new Error('useWebsiteSuggestions must be used within WebsiteSuggestionsProvider');
    return ctx;
};

export const WebsiteSuggestionsProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentPrompt, setCurrentPrompt] = useLocalStorage('suggest-websites-prompt', '');
    const [currentThreadId, setCurrentThreadId] = useQueryState('threadId', parseAsString);
    const [showStreamingCards, setShowStreamingCards] = useLocalStorage('show-streaming-cards', true);
    const [isGenerating, setIsGenerating] = useLocalStorage('is-generating-websites', false);

    const {
        isLoading: isLoadingThreadMessages,
        results: threadMessages,
        loadMore,
    } = useThreadMessages(api.threads.listThreadMessages, currentThreadId ? { threadId: currentThreadId } : 'skip', {
        initialNumItems: THREADS_MESSAGES_PAGE_SIZE,
    });

    // Extract website suggestions from thread messages
    const threadSuggestions = useMemo(() => {
        if (!threadMessages) return [];
        const messages = toUIMessages(threadMessages);
        const suggestions: WebsiteSuggestion[] = messages
            .filter((message) => message.role === 'assistant' && message.content)
            .map((message) => {
                try {
                    const parsed = JSON.parse(message.content);
                    return parsed as WebsiteSuggestion;
                } catch {
                    return {} as WebsiteSuggestion;
                }
            })
            .filter((suggestion) => suggestion?.title && suggestion?.url && suggestion?.description);

        return suggestions;
    }, [threadMessages]);

    const {
        startComparison,
        columns: comparisonColumns,
        rows: comparisonRows,
        isLoading: isLoadingComparison,
    } = useWebsitesComparison({
        websitesSuggestions: threadSuggestions,
        threadId: currentThreadId,
    });

    const suggestedUrls = useMemo(() => {
        return threadSuggestions.map((s) => s.url).filter(Boolean) as string[];
    }, [threadSuggestions]);

    const clearSuggestions = () => {
        setCurrentThreadId(null);
    };

    useEffect(() => {
        if (!isGenerating && currentThreadId && threadSuggestions.length > 0) {
            console.log('Stream ended, starting comparison');
            startComparison();
        }
    }, [currentThreadId, threadSuggestions.length]);

    return (
        <WebsiteSuggestionsContext.Provider
            value={{
                startComparison,
                clearSuggestions,
                suggestedUrls,
                comparisonColumns,
                comparisonRows,
                isLoadingComparison,
                currentPrompt,
                setCurrentPrompt,
                showStreamingCards,
                setShowStreamingCards,
                currentThreadId,
                setCurrentThreadId,
                threadMessages: toUIMessages(threadMessages) || [],
                isLoadingThreadMessages,
                isGenerating,
                setIsGenerating,
                threadSuggestions,
                loadMoreThreadMessages: loadMore,
            }}
        >
            {children}
        </WebsiteSuggestionsContext.Provider>
    );
};
