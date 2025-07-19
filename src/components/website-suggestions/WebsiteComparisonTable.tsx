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
import { FullDynamicZodType } from '../../lib/zod.utils';
import { Skeleton } from '@/components/ui/skeleton';
import { staticComparisonColumns } from '@/constants/comparison-table-config.const';
import { StaticZodFields } from '@/models/website-comparison.model';

export function WebsiteComparisonTable() {
    const { comparisonColumns: columns, comparisonRows: rows, isLoadingComparison } = useWebsiteSuggestions();

    const [sorting, setSorting] = useState<SortingState>([]);

    console.log({ rows });

    const dynamicColumns = useMemo<ColumnDef<FullDynamicZodType>[]>(
        () =>
            columns
                .filter((col) => !Object.keys(StaticZodFields).includes(col.zodKey))
                .map(
                    (col): ColumnDef<FullDynamicZodType> => ({
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
        columns: [...staticComparisonColumns, ...dynamicColumns],
        initialState: {
            columnPinning: {
                left: ['title'],
            },
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableColumnPinning: true,
        state: { sorting },
        onSortingChange: setSorting,
    });

    console.log('Table rows:', table.getRowModel().rows.length, 'columns:', table.getAllColumns().length);

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
                                        className={
                                            cell.column.getIsPinned() === 'left' ? 'sticky left-0 z-10 bg-white' : ''
                                        }
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
