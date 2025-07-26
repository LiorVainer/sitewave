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
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from '@/components/animate-ui/radix/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/animate-ui/radix/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/animate-ui/radix/dropdown-menu';
import { Bot, ChevronRight, ChevronsUpDown, Folder, Frame, Plus, Settings2, Sparkles, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { WebsiteSuggestionsProvider } from '@/context/WebsiteSuggestionsContext';
import { NavUser } from '@/components/navigation/NavUser';
import { PageWrapper } from '@/components/general/PageWrapper';
import { BookmarksFoldersSidebarGroup } from '@/components/navigation/BookmarksFoldersSidebarGroup';
import { SignedIn } from '@clerk/nextjs';

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
    const [activeTeam, setActiveTeam] = React.useState(DATA.teams[0]);

    if (!activeTeam) return null;

    return (
        <SidebarProvider>
            <Sidebar collapsible='icon'>
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
                                        <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                                            <activeTeam.logo className='size-4' />
                                        </div>
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

                <SidebarContent>
                    {/* Nav Main */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Platform</SidebarGroupLabel>
                        <SidebarMenu>
                            {DATA.navMain.map((item) => (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    defaultOpen={item.isActive}
                                    className='group/collapsible'
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                                <ChevronRight className='ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90' />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton asChild>
                                                            <a href={subItem.url}>
                                                                <span>{subItem.title}</span>
                                                            </a>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>

                    <SignedIn>
                        <BookmarksFoldersSidebarGroup />
                    </SignedIn>
                </SidebarContent>
                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>

            <SidebarInset>
                <header className='flex h-16 shrink-0 items-center justify-between w-full gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4'>
                    <div className='flex items-center gap-2'>
                        <SidebarTrigger className='-ml-1' />
                        <Separator orientation='vertical' className='mr-2 h-4' />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className='hidden md:block'>
                                    <BreadcrumbLink href='#'>Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className='hidden md:block' />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Discover Websites</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <PageWrapper className='flex flex-col gap-4 p-4 pt-0 flex-1 rounded-xl w-full md:min-h-min @container/main'>
                    <WebsiteSuggestionsProvider>{children}</WebsiteSuggestionsProvider>
                </PageWrapper>
            </SidebarInset>
        </SidebarProvider>
    );
};
