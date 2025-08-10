import { Doc } from '@convex/dataModel';

export type WebsiteDocument = Doc<'websites'>;
export type PopulatedBookmarkDocument = Doc<'bookmarks'> & {
    website: WebsiteDocument | null;
};
export type FolderDocument = Doc<'folders'>;
export type BookmarkDocument = Doc<'bookmarks'>;
