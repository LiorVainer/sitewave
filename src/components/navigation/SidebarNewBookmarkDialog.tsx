import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateBookmarkModal } from '@/components/bookmarks/CreateBookmarkModal';
import { SidebarGroup, SidebarMenu } from '../animate-ui/radix/sidebar';

export const SidebarNewBookmarkDialog = () => {
    return (
        <SidebarGroup className='py-0'>
            <SidebarMenu>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size='sm' variant='default' className='py-5'>
                            <Plus size={16} className='-ms-1' />
                            Create Bookmark
                        </Button>
                    </DialogTrigger>
                    <CreateBookmarkModal />
                </Dialog>
            </SidebarMenu>
        </SidebarGroup>
    );
};
