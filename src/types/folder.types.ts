import { Id } from '../../convex/_generated/dataModel';

export type FolderNode = {
    _id: Id<'folders'>;
    name: string;
    parentFolderId?: Id<'folders'>;
    createdAt: number;
    children: FolderNode[];
    bookmarks: {
        _id: Id<'bookmarks'>;
        title: string;
        url: string;
        createdAt: number;
    }[];
};
