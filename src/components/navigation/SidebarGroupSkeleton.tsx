import { Skeleton } from '@/components/ui/skeleton';

export const SidebarGroupSkeleton = ({ itemsAmount }: { itemsAmount: number }) => (
    <div className='flex flex-col gap-2 w-full'>
        {Array.from({ length: itemsAmount }).map((_, index) => (
            <Skeleton key={index} className='w-full h-8 bg-muted-foreground/50' />
        ))}
    </div>
);
