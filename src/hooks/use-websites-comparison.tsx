'use client';

import { FullDynamicZodType, generateZodSchemaFromColumns } from '@/lib/zod.utils';
import { ComparisonColumn, WebsiteComparisonColumnsSchema } from '@/models/website-comparison.model';
import { useEffect, useState } from 'react';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { PartialWebsiteSuggestion } from '@/models/website-suggestion.model';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface UseWebsitesComparisonProps {
    websitesSuggestions: PartialWebsiteSuggestion[];
}

export const useWebsitesComparison = ({ websitesSuggestions }: UseWebsitesComparisonProps) => {
    const [columns, setColumns] = useLocalStorage<ComparisonColumn[]>('comparison-columns', []);
    const [rows, setRows] = useLocalStorage<FullDynamicZodType[]>('comparison-rows', []);
    const {
        object: columnList,
        submit: submitColumns,
        isLoading: isLoadingColumns,
    } = useObject({
        api: '/api/ai/website-comparison/columns',
        schema: WebsiteComparisonColumnsSchema,
    });
    const rowsSchema = generateZodSchemaFromColumns(columns);

    const {
        object: rowList,
        submit: submitRows,
        isLoading: isLoadingRows,
    } = useObject({
        api: '/api/ai/website-comparison/rows',
        schema: rowsSchema,
    });

    const [step, setStep] = useState<'idle' | 'columns' | 'rows'>('idle');

    const startComparison = () => {
        clearComparison();
        setStep('columns');
        void submitColumns({ websites: websitesSuggestions });
    };

    console.log({ step, isLoadingColumns, isLoadingRows, columnList, rowList });

    useEffect(() => {
        if (!isLoadingColumns && columnList && columnList?.length > 0 && step === 'columns') {
            setColumns(columnList as ComparisonColumn[]);
            setStep('rows');
            submitRows({ websites: websitesSuggestions, columns: columnList });
        }
    }, [columnList, isLoadingColumns, step, submitRows, websitesSuggestions, setColumns]);

    useEffect(() => {
        if (!isLoadingRows && rowList?.length) {
            setRows(rowList as FullDynamicZodType[]);
        }
    }, [rowList, isLoadingRows, setRows]);

    const clearComparison = () => {
        setRows([]);
        setColumns([]);
    };

    const isLoading = isLoadingColumns || isLoadingRows;

    return {
        step,
        isLoading,
        startComparison,
        clearComparison,
        columns: columns as ComparisonColumn[],
        rows: rows as FullDynamicZodType[],
        isLoadingColumns,
        isLoadingRows,
        columnList,
        rowList,
    };
};
