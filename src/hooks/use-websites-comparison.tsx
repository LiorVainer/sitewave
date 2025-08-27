'use client';

import { FullDynamicZodType } from '@/lib/zod.utils';
import { ComparisonColumn } from '@/models/website-comparison.model';
import { useState } from 'react';
import { WebsiteSuggestion } from '@/models/website-suggestion.model';
import { useAction, useQuery } from 'convex/react';
import { api } from '@convex/api';

interface UseWebsitesComparisonProps {
    websitesSuggestions: WebsiteSuggestion[];
    comparisonData?: { columns: ComparisonColumn[]; rows: FullDynamicZodType[] } | null;
    threadId?: string | null;
}

export const useWebsitesComparison = ({ websitesSuggestions, threadId }: UseWebsitesComparisonProps) => {
    const generateWebsiteComparison = useAction(api.websites.generateWebsiteComparison);
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
        try {
            // Use Convex agent to generate columns and rows
            await generateWebsiteComparison({
                threadId,
                websites: websitesSuggestions,
            });
        } finally {
            setIsLoading(false);
        }
    };

    console.log('Comparison Data:', { columns, rows, isLoading });

    return {
        isLoading,
        startComparison,
        columns,
        rows,
        columnList: columns,
        rowList: rows,
    };
};
