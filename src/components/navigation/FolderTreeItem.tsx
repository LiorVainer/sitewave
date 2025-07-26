import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '../animate-ui/radix/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/animate-ui/radix/collapsible';
import { ChevronRight, Folder as FolderIcon } from 'lucide-react';
import { FolderNode } from '@/types/folder.types';

interface Props {
    folder: FolderNode;
}

export const FolderTreeItem = ({ folder }: Props) => {
    const hasChildren = folder.children.length > 0 || folder.bookmarks.length > 0;

    if (!hasChildren) return null;

    return (
        <Collapsible asChild>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={folder.name}>
                        <FolderIcon className='text-muted-foreground' />
                        <span>{folder.name}</span>
                        <ChevronRight className='ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {folder.bookmarks.map((bookmark) => (
                            <SidebarMenuSubItem key={bookmark._id}>
                                <SidebarMenuSubButton asChild>
                                    <a href={bookmark.url} target='_blank' rel='noopener noreferrer'>
                                        <span>{bookmark.title}</span>
                                    </a>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}

                        {folder.children.map((child) => (
                            <FolderTreeItem key={child._id} folder={child} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};
