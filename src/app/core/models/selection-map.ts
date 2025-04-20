import { Folder } from "./folder";

export interface SelectionMap {
    rootFolders: Folder[],
    map: Map<number, Folder>
}