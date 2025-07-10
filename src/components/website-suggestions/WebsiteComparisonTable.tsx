'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { useEffect, useState } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ComparisonColumn, WebsiteComparisonColumnsSchema } from '@/models/website-comparison.model';
import { useWebsiteSuggestions } from '@/components/website-suggestions/WebsiteSuggestionsContext';
import { DynamicZodSchemaObject, generateZodSchemaFromColumns } from '@/lib/zod.utils';

export function WebsiteComparisonTable() {
    const {
        comparisonColumns: columns,
        comparisonRows: rows,
        setComparisonRows: setRows,
        setComparisonColumns: setColumns,
    } = useWebsiteSuggestions();
    const [step, setStep] = useState<'idle' | 'columns' | 'rows'>('idle');
    const { localSuggestions } = useWebsiteSuggestions();

    const {
        object: columnList,
        submit: submitColumns,
        isLoading: isLoadingColumns,
    } = useObject({
        api: '/api/ai/website-comparison/columns',
        schema: WebsiteComparisonColumnsSchema,
    });

    const {
        object: rowMatrix,
        submit: submitRows,
        isLoading: isLoadingRows,
    } = useObject({
        api: '/api/ai/website-comparison/rows',
        schema: generateZodSchemaFromColumns(columns),
    });

    useEffect(() => {
        if (localSuggestions.length === 0) {
            console.warn('No websites provided for comparison.');
            return;
        }

        if (rows.length > 0 || columns.length > 0) {
            console.warn('Rows already exist, skipping initial comparison.');
            return;
        }

        void startComparsion();
    }, []);

    const startComparsion = async () => {
        setStep('columns');
        void submitColumns({ websites: localSuggestions });
    };

    useEffect(() => {
        if (!isLoadingColumns && columnList && columnList?.length > 0 && step === 'columns') {
            setColumns(columnList as ComparisonColumn[]);
            setStep('rows');

            submitRows({ websites: localSuggestions, columns: columnList });
        }
    }, [columnList, isLoadingColumns, step, submitRows, localSuggestions, setColumns]);

    useEffect(() => {
        if (!isLoadingRows && rowMatrix && rowMatrix?.length) {
            setRows(rowMatrix as DynamicZodSchemaObject[]);
            setStep('idle');
        }
    }, [rowMatrix, isLoadingRows, setRows]);

    const isStreaming = isLoadingColumns || isLoadingRows;

    return (
        <div className='space-y-4'>
            {isStreaming && <p className='text-muted text-sm'>Streaming AI output...</p>}

            {columns.length > 0 && rows.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col.id}>{col.header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row, rowIndex) => (
                            <TableRow key={`row-${rowIndex}`}>
                                {columns.map((col) => (
                                    <TableCell key={col.id}>
                                        {row[col.zodKey] === undefined ? '' : String(row[col.zodKey])}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
