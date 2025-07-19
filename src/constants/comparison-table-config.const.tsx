import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { FullDynamicZodType } from '@/lib/zod.utils';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const columnHelper = createColumnHelper<FullDynamicZodType>();

export const staticComparisonColumns: ColumnDef<FullDynamicZodType>[] = [
    columnHelper.display({
        id: 'titleWithFavicon',
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
            const url = row.original.url;
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=32`;

            return (
                <div className='flex items-center gap-2'>
                    <img
                        src={faviconUrl}
                        alt='favicon'
                        className='w-4 h-4 rounded-sm'
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                    <span className='font-semibold text-primary'>{title}</span>
                </div>
            );
        },
        enableSorting: true,
        enablePinning: true,
    }),

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
                    className='text-blue-600 underline text-sm break-all'
                >
                    {value}
                </a>
            );
        },
        enableSorting: false,
    }),
];
