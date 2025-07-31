'use client';
import { Button } from '@/components/ui/button';
import { ListCollapseIcon, ListTreeIcon } from 'lucide-react';

export function BookmarkTreeToolbar({ onExpand, onCollapse }: { onExpand: () => void; onCollapse: () => void }) {
    return (
        <div className='flex gap-2'>
            <Button size='sm' variant='outline' onClick={onExpand}>
                <ListTreeIcon size={16} className='-ms-1 opacity-60' />
                Expand all
            </Button>
            <Button size='sm' variant='outline' onClick={onCollapse}>
                <ListCollapseIcon size={16} className='-ms-1 opacity-60' />
                Collapse all
            </Button>
        </div>
    );
}
