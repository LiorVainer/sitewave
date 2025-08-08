'use client';
import { Tree, TreeItem } from '@/components/tree';
import { SidebarMenu, SidebarMenuButton, useSidebar } from '@/components/animate-ui/radix/sidebar';
import { ChevronRight, FolderIcon, FolderOpenIcon, LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useBookmarkTree } from '@/components/bookmarks/bookmarks-tree/hooks/useBookmarkTree';
import { Checkbox } from '@/components/ui/checkbox';
import { WebsiteLogo } from '@/components/websites/WebsiteLogo';
import { motion } from 'framer-motion';

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
                                    className={cn(HIGHLIGHT_CLASS, 'group flex items-center gap-2 cursor-pointer')}
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
                                </SidebarMenuButton>
                            </SidebarMenu>
                        </TreeItem>
                    </div>
                );
            })}
        </Tree>
    );
}
