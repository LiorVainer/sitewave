'use client';

import { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useConvexAuth } from 'convex/react';
import { cn } from '@/lib/utils';

type AuthSensitiveWrapperProps = {
    children: ReactNode;
    className?: string;
    tooltip?: string;
};

export const AuthSensitiveWrapper = ({
    children,
    className,
    tooltip = 'Sign in to use this feature',
}: AuthSensitiveWrapperProps) => {
    const { isAuthenticated } = useConvexAuth();

    const content = (
        <div className={cn(className, !isAuthenticated && 'opacity-50')}>
            <div className={cn(className, !isAuthenticated && 'pointer-events-none')}>{children}</div>
        </div>
    );

    return isAuthenticated ? (
        content
    ) : (
        <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
    );
};
