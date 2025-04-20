import { Item } from "./item";

export interface Folder {
    id: number;
    title: string;
    parentId: number | null;
    folderChildren: Folder[];
    itemChildren: Item[];
    state: FolderState;
    selectedItems: Set<number>;
}

export enum FolderStateEnum {
    Selected = "selected",
    Unselected = "unselected",
    Indeterminate = "indeterminate"
}

export type FolderState = FolderStateEnum.Selected | FolderStateEnum.Unselected | FolderStateEnum.Indeterminate;