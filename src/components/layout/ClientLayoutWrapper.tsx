'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { AppSidebar } from '@/components/navigation/AppSidebar';

export const ClientLayoutWrapper = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();

    const noLayoutRoutes = ['/sign-in', '/sign-up'];

    const isExcluded = noLayoutRoutes.includes(pathname);

    return isExcluded ? <>{children}</> : <AppSidebar>{children}</AppSidebar>;
};
