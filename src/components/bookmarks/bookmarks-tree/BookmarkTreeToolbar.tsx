'use client';
import { Button } from '@/components/ui/button';
import { ListCollapseIcon, ListTreeIcon } from 'lucide-react';

export function BookmarkTreeToolbar({ onExpand, onCollapse }: { onExpand: () => void; onCollapse: () => void }) {
    return (
        <div className='flex gap-2 w-full'>
            <Button size='sm' variant='outline' onClick={onExpand} className='flex-1'>
                <ListTreeIcon size={16} className='-ms-1 opacity-60' />
                Expand all
            </Button>
            <Button size='sm' variant='outline' onClick={onCollapse} className='flex-1'>
                <ListCollapseIcon size={16} className='-ms-1 opacity-60' />
                Collapse all
            </Button>
        </div>
    );
}
