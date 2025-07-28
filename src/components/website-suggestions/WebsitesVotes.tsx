import { Triangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Doc } from '@convex/dataModel';
import { useConvexAuth, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { AuthSensitiveWrapper } from '@/components/wrappers/AuthSensitiveWrapper';

export type WebsiteVotesProps = {
    website: Doc<'websites'>;
};

export const WebsitesVotes = ({ website }: WebsiteVotesProps) => {
    const { user } = useUser();
    const { isAuthenticated } = useConvexAuth();
    const userId = user?.id;

    const vote = useMutation(api.websites.voteOnWebsite);

    const hasUpvoted = website?.upvotes.includes(userId ?? '');
    const hasDownvoted = website?.downvotes.includes(userId ?? '');

    const totalVotes = website?.upvotes.length - website?.downvotes.length;

    const handleUpvote = async () => {
        if (!userId) return;
        await vote({ websiteId: website._id, vote: 'up' });
    };

    const handleDownvote = async () => {
        if (!userId) return;
        await vote({ websiteId: website._id, vote: 'down' });
    };

    return (
        <AuthSensitiveWrapper className='inline-flex -space-x-px rounded-xl shadow-sm shadow-black/5 rtl:space-x-reverse'>
            <Button
                onClick={handleUpvote}
                className={cn(
                    'rounded-none first:rounded-s-lg last:rounded-e-lg shadow-none focus-visible:z-10',
                    hasUpvoted && 'bg-blue-100 border-blue-200',
                    !isAuthenticated && 'cursor-not-allowed',
                    isAuthenticated && 'hover:bg-blue-50 hover:text-blue-500',
                )}
                variant='outline'
                size='sm'
                aria-label='Upvote'
                disabled={!isAuthenticated}
            >
                <Triangle className={cn('w-4 h-4', hasUpvoted && 'text-blue-700')} strokeWidth={2} aria-hidden='true' />
            </Button>

            <span className='flex items-center border border-input px-3 text-sm font-medium min-w-[40px] justify-center'>
                {totalVotes}
            </span>

            <Button
                onClick={handleDownvote}
                className={cn(
                    'rounded-none last:rounded-e-lg first:rounded-s-lg shadow-none focus-visible:z-10',
                    hasDownvoted && 'bg-red-100 border-red-200',
                    !isAuthenticated && 'cursor-not-allowed',
                    isAuthenticated && 'hover:bg-red-50 hover:text-red-500',
                )}
                variant='outline'
                size='sm'
                aria-label='Downvote'
                disabled={!isAuthenticated}
            >
                <Triangle
                    className={cn('w-4 h-4 rotate-180', hasDownvoted && 'text-red-700')}
                    strokeWidth={2}
                    aria-hidden='true'
                />
            </Button>
        </AuthSensitiveWrapper>
    );
};
