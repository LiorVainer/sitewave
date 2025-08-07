import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LoadMoreButtonProps {
    handleLoadMore: (amount: number) => void;
    label?: string;
    className?: string;
}

export const LoadMoreButton = ({ handleLoadMore, label = 'Load More Suggestions', className }: LoadMoreButtonProps) => {
    const isMobile = useIsMobile();

    return isMobile ? (
        <Button variant={'gradient'} className={'w-full'} onClick={() => handleLoadMore(5)}>
            {label}
        </Button>
    ) : (
        <button
            className={cn(
                'text-sm text-gray-500 underline hover:text-gray-700 hover:cursor-pointer transition-all duration-200',
                className,
            )}
            type='button'
            onClick={() => handleLoadMore(5)}
        >
            Load More Suggestions
        </button>
    );
};
