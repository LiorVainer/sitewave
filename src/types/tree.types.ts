export type FolderTreeNode = {
    _id: string; // unique identifier
    name: string; // folder name
    type: 'folder'; // distinguishes folder vs. bookmark
    children: string[]; // IDs of child items (folders/bookmarks)
    parentFolderId?: string | null; // ID of parent folder, null if root
    color: string; // color for folder icon
};

export type BookmarkTreeNode = {
    _id: string; // prefixed id like "bookmark-abc123"
    name: string; // bookmark title
    type: 'bookmark'; // used to check type during rendering
    url: string; // bookmark link
};

export type TreeNode = FolderTreeNode | BookmarkTreeNode;
