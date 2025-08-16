'use client';

import { createContext, Dispatch, SetStateAction, useContext, useMemo } from 'react';
import { WebsiteSuggestionWithMandatoryFields } from '@/models/website-suggestion.model';
import { ComparisonColumn } from '@/models/website-comparison.model';
import { FullDynamicZodType } from '@/lib/zod.utils';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useWebsitesComparison } from '@/hooks/use-websites-comparison';
import { useMutation } from 'convex/react';
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
    // New Convex-specific properties using URL params
    currentThreadId: string | null;
    setCurrentThreadId: (threadId: string | null) => void;
    threadMessages: UIMessage[];
    isStreaming: boolean;
    // Extracted suggestions from thread messages
    threadSuggestions: WebsiteSuggestionWithMandatoryFields[];
}

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

    const addSuggestionIfNotExists = useMutation(api.websites.addWebsiteIfNotExists);

    const threadMessages = useThreadMessages(
        api.threads.listThreadMessages,
        currentThreadId ? { threadId: currentThreadId } : 'skip',
        { initialNumItems: 10 },
    );

    // Extract website suggestions from thread messages
    const threadSuggestions = useMemo(() => {
        if (!threadMessages.results) return [];
        const messages = toUIMessages(threadMessages.results);
        const suggestions: WebsiteSuggestionWithMandatoryFields[] = messages
            .filter((message) => message.role === 'assistant' && message.content)
            .map((message) => {
                try {
                    const parsed = JSON.parse(message.content);
                    return parsed as WebsiteSuggestionWithMandatoryFields;
                } catch {
                    return {} as WebsiteSuggestionWithMandatoryFields;
                }
            })
            .filter((suggestion) => suggestion?.title && suggestion?.url && suggestion?.description);

        return suggestions;
    }, [threadMessages.results]);

    // Check if streaming is active - now also check for website generation
    const isStreaming = useMemo(() => {
        if (!threadMessages.results) return false;
        const messages = toUIMessages(threadMessages.results);
        return (
            messages.some((msg) => msg.status === 'streaming') || (!!currentThreadId && threadSuggestions.length < 5) // Assume generating until we have expected amount
        );
    }, [threadMessages.results, currentThreadId, threadSuggestions.length]);

    const {
        clearComparison,
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
        clearComparison();
        setCurrentThreadId(null);
    };

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
                threadMessages: toUIMessages(threadMessages.results) || [],
                isStreaming,
                threadSuggestions,
            }}
        >
            {children}
        </WebsiteSuggestionsContext.Provider>
    );
};
