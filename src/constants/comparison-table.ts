import { ComparisonColumn } from '@/models/website-comparison.model';

export const MustColumns: ComparisonColumn[] = [
    {
        id: 'title',
        header: 'Title',
        accessorKey: 'title',
        zodKey: 'title',
        zodDesc: 'Website title (always included)',
        zodType: 'string',
    },
    {
        id: 'url',
        header: 'URL',
        accessorKey: 'url',
        zodKey: 'url',
        zodDesc: 'Website URL (always included)',
        zodType: 'string',
    },
];
