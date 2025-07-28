'use client';

import { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import { PartialWebsiteSuggestion, WebsiteSuggestionWithMandatoryFields } from '@/models/website-suggestion.model';
import { StreamableValue } from 'ai/rsc';
import { ComparisonColumn } from '@/models/website-comparison.model';
import { FullDynamicZodType } from '@/lib/zod.utils';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useWebsitesComparison } from '@/hooks/use-websites-comparison';
import { useMutation } from 'convex/react';
import { api } from '@convex/api';
import { mergeWebsiteAndWebsiteSuggestion } from '@/lib/websites/converters.utils';
import { Doc } from '@convex/dataModel';

interface WebsiteSuggestionsContextType {
    localSuggestions: PartialWebsiteSuggestion[];
    setLocalSuggestions: Dispatch<SetStateAction<PartialWebsiteSuggestion[]>>;
    websiteSuggestionsStream: StreamableValue<PartialWebsiteSuggestion> | null;
    setWebsiteSuggestionsStream: Dispatch<SetStateAction<StreamableValue<PartialWebsiteSuggestion> | null>>;
    clearSuggestions: () => void;
    addSuggestion: (suggestion: WebsiteSuggestionWithMandatoryFields) => void;
    startComparison: () => void;
    suggestedUrls: string[];
    comparisonColumns: ComparisonColumn[];
    comparisonRows: FullDynamicZodType[];
    isLoadingComparison: boolean;
    currentPrompt: string;
    setCurrentPrompt: Dispatch<SetStateAction<string>>;
    showStreamingCards: boolean;
    setShowStreamingCards: Dispatch<SetStateAction<boolean>>;
}

export const WebsiteSuggestionsContext = createContext<WebsiteSuggestionsContextType | undefined>(undefined);

export const useWebsiteSuggestions = () => {
    const ctx = useContext(WebsiteSuggestionsContext);
    if (!ctx) throw new Error('useWebsiteSuggestions must be used within WebsiteSuggestionsProvider');
    return ctx;
};

export const WebsiteSuggestionsProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentPrompt, setCurrentPrompt] = useLocalStorage('suggest-websites-prompt', '');
    const [localSuggestions, setLocalSuggestions] = useLocalStorage<PartialWebsiteSuggestion[]>(
        'websites-suggestions',
        [],
    );
    const [websiteSuggestionsStream, setWebsiteSuggestionsStream] =
        useState<StreamableValue<PartialWebsiteSuggestion> | null>(null);

    const addSuggestionIfNotExists = useMutation(api.websites.addWebsiteIfNotExists);

    const [showStreamingCards, setShowStreamingCards] = useLocalStorage('show-streaming-cards', true);

    const {
        clearComparison,
        startComparison,
        columns: comparisonColumns,
        rows: comparisonRows,
        isLoading: isLoadingComparison,
    } = useWebsitesComparison({ websitesSuggestions: localSuggestions });

    const suggestedUrls = useMemo(() => {
        return localSuggestions.map((s) => s.url).filter(Boolean) as string[];
    }, [localSuggestions]);

    const clearSuggestions = () => {
        clearComparison();
        setLocalSuggestions([]);
    };

    const addSuggestion = async (suggestion: WebsiteSuggestionWithMandatoryFields) => {
        const creartedWebsite = await addSuggestionIfNotExists({
            url: suggestion.url,
            name: suggestion.title,
            description: suggestion.description,
        });

        setLocalSuggestions((prev) => {
            const alreadyExists = prev.some((s) => s.url === creartedWebsite?.url);
            if (alreadyExists) return prev;
            return [
                ...prev,
                creartedWebsite
                    ? mergeWebsiteAndWebsiteSuggestion({ suggestion, website: creartedWebsite as Doc<'websites'> })
                    : suggestion,
            ];
        });
    };

    return (
        <WebsiteSuggestionsContext.Provider
            value={{
                localSuggestions,
                setLocalSuggestions,
                websiteSuggestionsStream,
                setWebsiteSuggestionsStream,
                addSuggestion,
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
            }}
        >
            {children}
        </WebsiteSuggestionsContext.Provider>
    );
};
