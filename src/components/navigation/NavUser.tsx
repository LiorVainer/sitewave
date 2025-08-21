import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/animate-ui/radix/sidebar';
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import { BadgeCheck, ChevronsUpDown, CreditCard, LogOut, LucideLogIn, Moon, Sparkles, Sun } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/animate-ui/radix/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useThemeToggle } from '@/hooks/use-theme';
import Link from 'next/link';

export const NavUser = () => {
    const { user, openUserProfile, signOut } = useClerk();
    const { isDarkMode, toggleTheme } = useThemeToggle();
    const isMobile = useIsMobile();

    return (
        <SidebarMenu>
            <SignedOut>
                <SidebarMenuButton asChild>
                    <Link href='/sign-in'>
                        <LucideLogIn />
                        <span>Sign In</span>
                    </Link>
                </SidebarMenuButton>
            </SignedOut>
            <SignedIn>
                {user && (
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size='lg'
                                    className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                                >
                                    <Avatar className='h-8 w-8 rounded-lg'>
                                        <AvatarImage src={user.imageUrl} alt={user.fullName ?? 'Avatar Picture'} />
                                        <AvatarFallback className='rounded-lg'>{`${user.firstName?.at(0)}${user.lastName?.at(0)}`}</AvatarFallback>
                                    </Avatar>
                                    <div className='grid flex-1 text-left text-sm leading-tight'>
                                        <span className='truncate font-semibold'>{user.fullName}</span>
                                        <span className='truncate text-xs'>
                                            {user.primaryEmailAddress?.emailAddress}
                                        </span>
                                    </div>
                                    <ChevronsUpDown className='ml-auto size-4' />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                                side={isMobile ? 'bottom' : 'right'}
                                align='end'
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className='p-0 font-normal'>
                                    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                                        <Avatar className='h-8 w-8 rounded-lg'>
                                            <AvatarImage src={user.imageUrl} alt={user.fullName ?? 'Avatar Picture'} />
                                            <AvatarFallback className='rounded-lg'>{`${user.firstName?.at(0)}${user.lastName?.at(0)}`}</AvatarFallback>
                                        </Avatar>
                                        <div className='grid flex-1 text-left text-sm leading-tight'>
                                            <span className='truncate font-semibold'>{user.fullName}</span>
                                            <span className='truncate text-xs'>
                                                {user.primaryEmailAddress?.emailAddress}
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Sparkles />
                                        Upgrade to Pro
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => openUserProfile()}>
                                        <BadgeCheck />
                                        Account
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CreditCard />
                                        Billing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={toggleTheme}>
                                        {isDarkMode ? <Sun /> : <Moon />}
                                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                    </DropdownMenuItem>
                                    {/*<DropdownMenuItem>*/}
                                    {/*    <Bell />*/}
                                    {/*    Notifications*/}
                                    {/*</DropdownMenuItem>*/}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut()}>
                                    <LogOut />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                )}
            </SignedIn>
        </SidebarMenu>
    );
};
