'use client';

import { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import { PartialWebsiteSuggestion } from '@/models/website-suggestion.model';
import { StreamableValue } from 'ai/rsc';
import { ComparisonColumn } from '@/models/website-comparison.model';
import { DynamicZodType } from '@/lib/zod.utils';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useWebsitesComparison } from '@/hooks/use-websites-comparison';

interface WebsiteSuggestionsContextType {
    localSuggestions: PartialWebsiteSuggestion[];
    setLocalSuggestions: Dispatch<SetStateAction<PartialWebsiteSuggestion[]>>;
    websiteSuggestionsStream: StreamableValue<PartialWebsiteSuggestion> | null;
    setWebsiteSuggestionsStream: Dispatch<SetStateAction<StreamableValue<PartialWebsiteSuggestion> | null>>;
    clearSuggestions: () => void;
    addSuggestion: (suggestion: PartialWebsiteSuggestion) => void;
    suggestedUrls: string[];
    comparisonColumns: ComparisonColumn[];
    comparisonRows: DynamicZodType[];
    isLoadingComparison: boolean;
    currentPrompt: string;
    setCurrentPrompt: Dispatch<SetStateAction<string>>;
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

    const addSuggestion = (suggestion: PartialWebsiteSuggestion) => {
        startComparison();
        setLocalSuggestions((prev) => {
            return [...prev, suggestion];
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
                clearSuggestions,
                suggestedUrls,
                comparisonColumns,
                comparisonRows,
                isLoadingComparison,
                currentPrompt,
                setCurrentPrompt,
            }}
        >
            {children}
        </WebsiteSuggestionsContext.Provider>
    );
};
