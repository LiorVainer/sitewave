import { cn } from '@/lib/utils';

export type PageWrapperProps = {
    children: React.ReactNode;
    className?: string;
};

export const PageWrapper = ({ children, className }: PageWrapperProps) => (
    <div className={cn('bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-[100vh]', className)}>
        {children}
    </div>
);
