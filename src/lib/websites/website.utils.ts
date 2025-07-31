export const faviconUrlFromWebsiteUrl = (websiteUrl: string): string => {
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(websiteUrl)}&sz=32`;
};
