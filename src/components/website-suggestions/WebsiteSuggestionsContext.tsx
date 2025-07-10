import { createContext, useContext, useMemo, useState } from 'react';
import { PartialWebsiteSuggestion } from '@/models/website-suggestion.model';
import { StreamableValue } from 'ai/rsc';
import { ComparisonColumn } from '@/models/website-comparison.model';
import { DynamicZodType } from '@/lib/zod.utils';

interface WebsiteSuggestionsContextType {
    localSuggestions: PartialWebsiteSuggestion[];
    setLocalSuggestions: React.Dispatch<React.SetStateAction<PartialWebsiteSuggestion[]>>;
    websiteSuggestionsStream: StreamableValue<PartialWebsiteSuggestion> | null;
    setWebsiteSuggestionsStream: React.Dispatch<React.SetStateAction<StreamableValue<PartialWebsiteSuggestion> | null>>;
    clearSuggestions: () => void;
    addSuggestion: (suggestion: PartialWebsiteSuggestion) => void;
    suggestedUrls: string[];
    comparisonColumns: ComparisonColumn[];
    setComparisonColumns: React.Dispatch<React.SetStateAction<ComparisonColumn[]>>;
    comparisonRows: DynamicZodType[];
    setComparisonRows: React.Dispatch<React.SetStateAction<DynamicZodType[]>>;
}

export const WebsiteSuggestionsContext = createContext<WebsiteSuggestionsContextType | undefined>(undefined);

export const useWebsiteSuggestions = () => {
    const ctx = useContext(WebsiteSuggestionsContext);
    if (!ctx) throw new Error('useWebsiteSuggestions must be used within WebsiteSuggestionsProvider');
    return ctx;
};

export const WebsiteSuggestionsProvider = ({ children }: { children: React.ReactNode }) => {
    const [localSuggestions, setLocalSuggestions] = useState<PartialWebsiteSuggestion[]>([]);
    const [websiteSuggestionsStream, setWebsiteSuggestionsStream] =
        useState<StreamableValue<PartialWebsiteSuggestion> | null>(null);
    const [comparisonColumns, setComparisonColumns] = useState<ComparisonColumn[]>([]);
    const [comparisonRows, setComparisonRows] = useState<DynamicZodType[]>([]);

    const suggestedUrls = useMemo(() => {
        return localSuggestions.map((s) => s.url).filter(Boolean) as string[];
    }, [localSuggestions]);

    const clearComparison = () => {
        setComparisonRows([]);
        setComparisonColumns([]);
    };

    const clearSuggestions = () => {
        clearComparison();
        setLocalSuggestions([]);
    };

    const addSuggestion = (suggestion: PartialWebsiteSuggestion) => {
        clearComparison();
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
                setComparisonColumns,
                comparisonRows,
                setComparisonRows,
            }}
        >
            {children}
        </WebsiteSuggestionsContext.Provider>
    );
};
