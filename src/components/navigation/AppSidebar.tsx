'use client';

import * as React from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from '@/components/animate-ui/radix/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/animate-ui/radix/dropdown-menu';
import { Bot, ChevronsUpDown, Folder, Frame, Plus, Settings2, Sparkles, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavUser } from '@/components/navigation/NavUser';
import { BookmarksFoldersSidebarGroup } from '@/components/navigation/BookmarksFoldersSidebarGroup';
import { ThreadsSidebarGroup } from '@/components/threads/ThreadsSidebarGroup';
import { SignedIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '../layout/PageWrapper';
import { AppLogo } from '@/components/brand/AppLogo';
import { SidebarToolbar } from '@/components/navigation/SidebarToolbar';

const DATA = {
    user: {
        name: 'Lior Vainer',
        email: 'lior@sitewave.app',
        avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
    teams: [
        {
            name: 'Sitewave',
            logo: Sparkles,
            plan: 'Pro',
        },
    ],
    navMain: [
        {
            title: 'Discover',
            url: '/discover',
            icon: Bot,
            isActive: true,
            items: [
                { title: 'Suggestions', url: '/discover/suggestions' },
                { title: 'Topics', url: '/discover/topics' },
            ],
        },
        {
            title: 'Library',
            url: '/library',
            icon: Folder,
            items: [
                { title: 'My Folders', url: '/library/folders' },
                { title: 'Tags', url: '/library/tags' },
            ],
        },
        {
            title: 'Saved',
            url: '/saved',
            icon: Star,
            items: [
                { title: 'Starred', url: '/saved/starred' },
                { title: 'History', url: '/saved/history' },
            ],
        },
        {
            title: 'Settings',
            url: '/settings',
            icon: Settings2,
            items: [
                { title: 'Account', url: '/settings/account' },
                { title: 'Appearance', url: '/settings/theme' },
            ],
        },
    ],
    projects: [
        {
            name: 'Inbox',
            url: '/inbox',
            icon: Frame,
        },
        {
            name: 'Explore AI',
            url: '/explore',
            icon: Sparkles,
        },
    ],
};

export const AppSidebar = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const isMobile = useIsMobile();
    const router = useRouter();
    const [activeTeam, setActiveTeam] = React.useState(DATA.teams[0]);

    if (!activeTeam) return null;

    return (
        <SidebarProvider className='h-full'>
            <Sidebar collapsible='icon' className='h-full'>
                <SidebarHeader>
                    {/* Team Switcher */}
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size='lg'
                                        className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                                    >
                                        <AppLogo />
                                        <div className='grid flex-1 text-left text-sm leading-tight'>
                                            <span className='truncate font-semibold'>{activeTeam.name}</span>
                                            <span className='truncate text-xs'>{activeTeam.plan}</span>
                                        </div>
                                        <ChevronsUpDown className='ml-auto' />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                                    align='start'
                                    side={isMobile ? 'bottom' : 'right'}
                                    sideOffset={4}
                                >
                                    <DropdownMenuLabel className='text-xs text-muted-foreground'>
                                        Teams
                                    </DropdownMenuLabel>
                                    {DATA.teams.map((team, index) => (
                                        <DropdownMenuItem
                                            key={team.name}
                                            onClick={() => setActiveTeam(team)}
                                            className='gap-2 p-2'
                                        >
                                            <div className='flex size-6 items-center justify-center rounded-sm border'>
                                                <team.logo className='size-4 shrink-0' />
                                            </div>
                                            {team.name}
                                            <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className='gap-2 p-2'>
                                        <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                                            <Plus className='size-4' />
                                        </div>
                                        <div className='font-medium text-muted-foreground'>Add team</div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    {/* Team Switcher */}
                </SidebarHeader>

                <SidebarContent className='overflow-hidden'>
                    {/*<SidebarNewBookmarkDialog />*/}
                    <SidebarToolbar />
                    <div className='overflow-y-auto h-full'>
                        <SignedIn>
                            <BookmarksFoldersSidebarGroup />
                        </SignedIn>
                        <ThreadsSidebarGroup />
                    </div>
                </SidebarContent>
                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>

            <SidebarInset className='overflow-hidden min-h-0 h-full'>
                <header className='flex top-0 z-30 bg-white h-16 min-h-0 shrink-0 items-center justify-between w-full gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4'>
                    <div className='flex items-center gap-2 min-h-0'>
                        <SidebarTrigger className='-ml-1' />
                        <Separator orientation='vertical' className='mr-2 h-4' />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className='block'>
                                    <BreadcrumbLink asChild>
                                        <span className='cursor-pointer' onClick={() => router.replace('/')}>
                                            Home
                                        </span>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className='block' />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Discover Websites</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <PageWrapper className='flex h-full @container/main overflow-hidden flex-col gap-4 p-4'>
                    {children}
                </PageWrapper>
            </SidebarInset>
        </SidebarProvider>
    );
};
