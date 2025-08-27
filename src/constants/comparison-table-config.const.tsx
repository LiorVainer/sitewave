import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { FullDynamicZodType } from '@/lib/zod.utils';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const columnHelper = createColumnHelper<FullDynamicZodType>();

export const staticDesktopComparisonColumns: ColumnDef<FullDynamicZodType>[] = [
    columnHelper.accessor('title', {
        id: 'title',
        header: ({ column }) => (
            <Button
                variant='ghost'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className='p-0 text-left hover:bg-transparent'
            >
                <div className='flex items-center gap-2'>
                    Title
                    <ArrowUpDown className='w-4 h-4' />
                </div>
            </Button>
        ),
        cell: ({ row }) => {
            const url = row.original.url;
            const title = row.original.title;
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=32`;

            return (
                <div className='flex items-center gap-2'>
                    <img
                        src={faviconUrl}
                        alt='favicon'
                        className='w-4 h-4 rounded-sm shrink-0'
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                    <p className='font-semibold truncate'>{title}</p>
                </div>
            );
        },
        enableSorting: true,
        enablePinning: true,
        meta: {
            className: 'w-auto',
        },
    }),
];

export const staticMobileComparisonColumns: ColumnDef<FullDynamicZodType>[] = [
    columnHelper.display({
        id: 'favicon',
        header: () => null,
        cell: ({ row }) => {
            const url = row.original.url;
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=32`;

            return (
                <div className='w-6 h-6 flex items-center bg-background justify-center'>
                    <img
                        src={faviconUrl}
                        alt='favicon'
                        className='w-4 h-4 rounded-sm shrink-0'
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            );
        },
        enableSorting: true,
        enablePinning: true,
        meta: {
            className: 'w-auto',
        },
    }),
    columnHelper.accessor('title', {
        id: 'title',
        header: ({ column }) => (
            <Button
                variant='ghost'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className='p-0 text-left hover:bg-transparent'
            >
                <div className='flex items-center gap-2'>
                    Title
                    <ArrowUpDown className='w-4 h-4' />
                </div>
            </Button>
        ),
        cell: ({ row }) => {
            const title = row.original.title;

            return (
                <div>
                    <div className='flex items-center gap-2 min-w-0'>
                        <p className='font-semibold truncate whitespace-nowrap'>{title}</p>
                    </div>
                </div>
            );
        },
        enableSorting: true,
        enablePinning: true,
        meta: {
            className: 'w-auto',
        },
    }),
];

export const staticSharedComparisonColumns: ColumnDef<FullDynamicZodType>[] = [
    columnHelper.accessor('url', {
        id: 'url',
        header: 'URL',
        cell: ({ getValue }) => {
            const value = getValue() as string;
            return (
                <a
                    href={value}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 underline text-sm whitespace-nowrap'
                >
                    {value}
                </a>
            );
        },
        enableSorting: false,
        meta: {
            className: 'w-auto whitespace-nowrap',
        },
    }),
    // columnHelper.accessor('description', {
    //     id: 'description',
    //     header: 'Description',
    //     cell: ({ getValue }) => {
    //         const value = getValue() as string;
    //         return <p className='text-sm text-gray-700'>{value}</p>;
    //     },
    //     enableSorting: false,
    //     meta: {
    //         className: '',
    //     },
    // }),
];
