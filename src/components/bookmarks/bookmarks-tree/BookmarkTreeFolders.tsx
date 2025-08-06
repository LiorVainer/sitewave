'use client';
import { Tree, TreeItem } from '@/components/tree';
import { SidebarMenu, SidebarMenuButton, useSidebar } from '@/components/animate-ui/radix/sidebar';
import { FolderIcon, FolderOpenIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useBookmarkTree } from '@/components/bookmarks/bookmarks-tree/hooks/useBookmarkTree';
import { Checkbox } from '@/components/ui/checkbox';
import { WebsiteLogo } from '@/components/websites/WebsiteLogo';

export const HIGHLIGHT_CLASS = 'in-data-[search-match=true]:bg-blue-400/20!';

export type BookmarkTreeFoldersProps = {
    tree: ReturnType<typeof useBookmarkTree>['tree'];
    navigableItems?: boolean;
    checkableItems?: boolean;
};

export function BookmarkTreeFolders({ tree, navigableItems, checkableItems }: BookmarkTreeFoldersProps) {
    const router = useRouter();
    const { setOpen } = useSidebar();

    return (
        <Tree indent={15} tree={tree}>
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
                                                {item.isExpanded() ? (
                                                    <FolderOpenIcon className='size-4 text-muted-foreground' />
                                                ) : (
                                                    <FolderIcon className='size-4 text-muted-foreground' />
                                                )}
                                                {data.name}
                                            </span>
                                        ) : navigableItems ? (
                                            <a
                                                href={data.url}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className={cn('group flex items-center gap-2 px-2 py-1 rounded')}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <WebsiteLogo url={data.url} className='w-4 h-4 rounded' />
                                                {data.name}
                                            </a>
                                        ) : (
                                            <span className='flex items-center gap-2'>
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
