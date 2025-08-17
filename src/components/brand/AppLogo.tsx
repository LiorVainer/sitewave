import { cn } from '@/lib/utils';
import Image from 'next/image';

export const AppLogo = ({ className }: { className?: string }) => (
    <Image
        src='/logos/sitewave.svg' // put your file under /public/logos
        alt='Sitewave'
        width={42}
        height={42}
        className={cn('pt-2', className)}
        priority
    />
);
