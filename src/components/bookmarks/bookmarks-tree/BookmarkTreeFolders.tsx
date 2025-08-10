import { Tree, TreeItem } from '@/components/tree';
import { SidebarMenu, SidebarMenuButton, useSidebar } from '@/components/animate-ui/radix/sidebar';
import { ChevronRight, Edit, FolderIcon, FolderOpenIcon, LinkIcon, MoreHorizontal, Trash } from 'lucide-react'; // Import MoreHorizontal for three dots
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useBookmarkTree } from '@/components/bookmarks/bookmarks-tree/hooks/useBookmarkTree';
import { Checkbox } from '@/components/ui/checkbox';
import { WebsiteLogo } from '@/components/websites/WebsiteLogo';
import { motion } from 'framer-motion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/animate-ui/radix/dropdown-menu';

export const HIGHLIGHT_CLASS = 'in-data-[search-match=true]:bg-blue-400/20!';
export const INDENT = 15;

export type BookmarkTreeFoldersProps = {
    tree: ReturnType<typeof useBookmarkTree>['tree'];
    navigableItems?: boolean;
    checkableItems?: boolean;
};

export function BookmarkTreeFolders({ tree, navigableItems, checkableItems }: BookmarkTreeFoldersProps) {
    const router = useRouter();
    const { setOpen } = useSidebar();

    return (
        <Tree indent={INDENT} tree={tree}>
            {tree.getItems().map((item) => {
                const data = item.getItemData();
                return (
                    <div key={item.getId()} className='flex items-center gap-1.5'>
                        {checkableItems && (
                            <Checkbox
                                checked={
                                    {
                                        checked: true,
                                        unchecked: false,
                                        indeterminate: 'indeterminate' as const,
                                    }[item.getCheckedState()]
                                }
                                onCheckedChange={(checked) => {
                                    const checkboxProps = item.getCheckboxProps();
                                    checkboxProps.onChange?.({ target: { checked } });
                                }}
                            />
                        )}
                        <TreeItem key={item.getId()} item={item} asChild>
                            <SidebarMenu onClick={() => setOpen(true)}>
                                <SidebarMenuButton
                                    tooltip={item.getItemName()}
                                    onClick={() =>
                                        data.type === 'folder' &&
                                        navigableItems &&
                                        router.push('/folder/' + item.getId())
                                    }
                                    className={cn(
                                        HIGHLIGHT_CLASS,
                                        'group flex items-center gap-2 cursor-pointer relative',
                                    )}
                                >
                                    <span className='flex items-center gap-2'>
                                        {data.type === 'folder' ? (
                                            <span className='flex items-center gap-2'>
                                                {/* Chevron with rotation */}
                                                <motion.div
                                                    animate={{ rotate: item.isExpanded() ? 90 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className={cn(
                                                        'flex-shrink-0',
                                                        item.getChildren().length > 0 && 'text-black-foreground/50',
                                                    )}
                                                >
                                                    <ChevronRight className='size-4 text-muted-foreground' />
                                                </motion.div>

                                                {/* Folder icon */}
                                                {item.isExpanded() ? (
                                                    <FolderOpenIcon
                                                        color={data.color}
                                                        className='size-4 text-muted-foreground'
                                                    />
                                                ) : (
                                                    <FolderIcon
                                                        color={data.color}
                                                        className='size-4 text-muted-foreground'
                                                    />
                                                )}
                                                {data.name}
                                            </span>
                                        ) : navigableItems ? (
                                            <a
                                                href={data.url}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className={cn('group flex items-center gap-2 rounded')}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <LinkIcon className='w-4 h-4 text-muted-foreground opacity-80 group-hover:opacity-100' />
                                                <WebsiteLogo url={data.url} className='w-4 h-4 rounded' />
                                                {data.name}
                                            </a>
                                        ) : (
                                            <span className='flex items-center gap-2'>
                                                <LinkIcon className='w-4 h-4 text-muted-foreground opacity-80 group-hover:opacity-100' />
                                                <WebsiteLogo url={data.url} className='w-4 h-4 rounded' />
                                                {data.name}
                                            </span>
                                        )}
                                    </span>

                                    {/* Three dots button visible only when the current item is hovered */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className='absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity'>
                                                <MoreHorizontal className='w-5 h-5 text-muted-foreground' />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className='w-56'>
                                            <DropdownMenuLabel>{data.name}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                {/* Edit option */}
                                                <DropdownMenuItem>
                                                    <Edit className='w-4 h-4 text-muted-foreground' />
                                                    <span>Edit</span>
                                                    <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuGroup>
                                                {/* Delete option in red */}
                                                <DropdownMenuItem className='text-red-600'>
                                                    <Trash className='w-4 h-4 text-red-600' />
                                                    <span>Delete</span>
                                                    <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </SidebarMenuButton>
                            </SidebarMenu>
                        </TreeItem>
                    </div>
                );
            })}
        </Tree>
    );
}
