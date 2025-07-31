export type FolderTreeNode = {
    id: string; // unique identifier
    name: string; // folder name
    type: 'folder'; // distinguishes folder vs. bookmark
    children: string[]; // IDs of child items (folders/bookmarks)
    parentFolderId?: string | null; // ID of parent folder, null if root
};

export type BookmarkTreeNode = {
    id: string; // prefixed id like "bookmark-abc123"
    name: string; // bookmark title
    type: 'bookmark'; // used to check type during rendering
    url: string; // bookmark link
};

export type TreeNode = FolderTreeNode | BookmarkTreeNode;
