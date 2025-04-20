import { Folder } from "./folder";

export interface SelectionTree {
    rootFolders: Folder[],
    map: Map<number, Folder>
}