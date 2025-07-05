import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

interface LoadMoreButtonProps {
    handleLoadMore: (amount: number) => void;
    label?: string;
}

export const LoadMoreButton = ({ handleLoadMore, label }: LoadMoreButtonProps) => {
    const isMobile = useIsMobile();

    return isMobile ? (
        <Button variant={'gradient'} className={'w-full'}>
            Load More Suggestions
        </Button>
    ) : (
        <button
            className={
                'text-sm text-gray-500 underline hover:text-gray-700 hover:cursor-pointer transition-all duration-200'
            }
            type='button'
            onClick={() => handleLoadMore(5)}
        >
            Load More Suggestions
        </button>
    );
};
