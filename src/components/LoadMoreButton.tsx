import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react'; // Import ChevronDown icon to indicate more content

interface LoadMoreButtonProps {
    handleLoadMore: (amount: number) => void;
    label?: string;
    className?: string;
}

export const LoadMoreButton = ({ handleLoadMore, label = 'Load More Suggestions', className }: LoadMoreButtonProps) => {
    const isMobile = useIsMobile();

    return isMobile ? (
        <Button variant={'gradient'} className={'w-full'} onClick={() => handleLoadMore(5)}>
            {label} <ChevronDown size={16} />
        </Button>
    ) : (
        <Button className={cn('font-medium w-full py-5', className)} type='button' onClick={() => handleLoadMore(5)}>
            {label} <ChevronDown size={20} />
        </Button>
    );
};
