import { Triangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Doc } from '@convex/dataModel';

export type WebsiteVotesProps = {
    website: Doc<'websites'>;
};

export const WebsitesVotes = ({ website }: WebsiteVotesProps) => {
    const totalVotes = website?.upvotes.length - website?.downvotes.length;

    return (
        <div className='inline-flex -space-x-px rounded-xl shadow-sm shadow-black/5 rtl:space-x-reverse'>
            <Button
                className='rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 cursor-pointer'
                variant='outline'
                size='sm'
                aria-label='Upvote'
            >
                <Triangle className='text-blue-900 w-4 h-160' strokeWidth={2} aria-hidden='true' />
            </Button>
            <span className='flex items-center border border-input px-3 text-sm font-medium'>{totalVotes}</span>
            <Button
                className='rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 cursor-pointer'
                variant='outline'
                size='sm'
                aria-label='Downvote'
            >
                <Triangle className='text-red-900 rotate-180' size={16} strokeWidth={2} aria-hidden='true' />
            </Button>
        </div>
    );
};
