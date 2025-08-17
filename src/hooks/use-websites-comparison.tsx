'use client';

import { FullDynamicZodType } from '@/lib/zod.utils';
import { ComparisonColumn } from '@/models/website-comparison.model';
import { useState } from 'react';
import { PartialWebsiteSuggestion } from '@/models/website-suggestion.model';
import { useAction, useQuery } from 'convex/react';
import { api } from '@convex/api';

interface UseWebsitesComparisonProps {
    websitesSuggestions: PartialWebsiteSuggestion[];
    comparisonData?: { columns: ComparisonColumn[]; rows: FullDynamicZodType[] } | null;
    threadId?: string | null;
}

export const useWebsitesComparison = ({ websitesSuggestions, threadId }: UseWebsitesComparisonProps) => {
    const generateWebsiteComparison = useAction(api.websites.generateWebsiteComparison);
    const [step, setStep] = useState<'idle' | 'columns' | 'rows'>('idle');
    const [isLoading, setIsLoading] = useState(false);
    const comparisonData = useQuery(
        api.websiteSuggestions.getWebsiteComparisonByThread,
        threadId ? { threadId } : 'skip',
    );

    // Always use columns/rows from Convex if available
    const columns = comparisonData?.columns || [];
    const rows = comparisonData?.rows || [];

    const startComparison = async () => {
        if (!threadId || websitesSuggestions.length === 0) return;
        setIsLoading(true);
        setStep('columns');
        try {
            // Use Convex agent to generate columns and rows
            await generateWebsiteComparison({
                threadId,
                websites: websitesSuggestions,
            });
        } finally {
            setIsLoading(false);
            setStep('idle');
        }
    };

    const clearComparison = () => {
        // No-op: comparison is now managed by Convex and context
    };

    return {
        step,
        isLoading,
        startComparison,
        clearComparison,
        columns,
        rows,
        isLoadingColumns: isLoading && step === 'columns',
        isLoadingRows: isLoading && step === 'rows',
        columnList: columns,
        rowList: rows,
    };
};
