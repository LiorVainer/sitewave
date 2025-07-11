'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useWebsiteSuggestions } from '@/components/website-suggestions/WebsiteSuggestionsContext';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DynamicZodType } from '../../lib/zod.utils';
import { Skeleton } from '@/components/ui/skeleton';

export function WebsiteComparisonTable() {
    const { comparisonColumns: columns, comparisonRows: rows, isLoadingComparison } = useWebsiteSuggestions();

    const [sorting, setSorting] = useState<SortingState>([]);

    const tableColumns = useMemo<ColumnDef<DynamicZodType>[]>(
        () =>
            columns.map(
                (col): ColumnDef<DynamicZodType> => ({
                    id: col.id,
                    accessorFn: (row) => row[col.zodKey],
                    header: () => (
                        <Button
                            variant='ghost'
                            onClick={() =>
                                setSorting((prev) =>
                                    prev[0]?.id === col.id
                                        ? [{ id: col.id, desc: !prev[0].desc }]
                                        : [{ id: col.id, desc: false }],
                                )
                            }
                            className='p-0 text-left hover:bg-transparent'
                        >
                            <div className='flex items-center gap-2'>
                                {col.header}
                                <ArrowUpDown className='w-4 h-4' />
                            </div>
                        </Button>
                    ),
                    cell: (info) => info.getValue(),
                    enablePinning: true,
                }),
            ),
        [columns],
    );

    const table = useReactTable({
        data: rows,
        columns: tableColumns,
        initialState: {
            columnPinning: {
                left: ['title'],
            },
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enablePinning: true,
        state: { sorting },
        onSortingChange: setSorting,
    });

    return (
        <div className='space-y-4'>
            {isLoadingComparison && columns.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col.id}>
                                    <Skeleton className='h-4 w-24' />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                {columns.map((col) => (
                                    <TableCell key={col.id}>
                                        <Skeleton className='h-4 w-full' />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {!isLoadingComparison && columns.length > 0 && rows.length > 0 && (
                <Table className='bg-white rounded-lg'>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className={cell.column.getIsPinned() === 'left' ? 'sticky left-0 z-10' : ''}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
