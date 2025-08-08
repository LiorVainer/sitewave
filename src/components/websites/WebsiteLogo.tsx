import { faviconUrlFromWebsiteUrl } from '@/lib/websites/website.utils';
import { cn } from '@/lib/utils';

export type WebsiteLogoProps = {
    url: string;
    className?: string;
};

export const WebsiteLogo = ({ url, className }: WebsiteLogoProps) => {
    const faviconUrl = faviconUrlFromWebsiteUrl(url);

    return <img src={faviconUrl} alt='website-icon' className={cn('w-6 h-6 rounded', className)} />;
};
