import { cn } from '@/lib/utils';

export type PageWrapperProps = {
    children: React.ReactNode;
    className?: string;
};

export const PageWrapper = ({ children, className }: PageWrapperProps) => (
    <div
        className={cn(
            'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900',
            className,
        )}
    >
        {children}
    </div>
);
