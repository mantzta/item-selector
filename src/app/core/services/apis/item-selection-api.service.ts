import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { FoldersItemsResponse } from '../../models/folders-items-response';
import { Item } from '../../models/item';
import { Folder, FolderStateEnum } from '../../models/folder';
import { SelectionMap } from '../../models/selection-map';

@Injectable({
    providedIn: 'root'
})
export class ItemSelectionApiService {
    private apiUrl = 'assets/response.json';

    constructor(private http: HttpClient) {}

    getFoldersWithItems(): Observable<SelectionMap> {
        return this.http.get<FoldersItemsResponse>(this.apiUrl).pipe(
            map(response => {

                return this.createSelectionTree(response);
            })
        );
    }

    private createSelectionTree(foldersData: FoldersItemsResponse): SelectionMap {
        const tree = this.addFoldersToMap(foldersData.folders);
        this.addFolderToParent(tree.map);
        this.addItemToParent(tree.map, foldersData.items);

        return tree;
    }

    private addFoldersToMap(folders: { columns: string[], data: [number, string, number][] }): SelectionMap {
        const map = new Map<number, Folder>();
        const rootFolders: Folder[] = [];

        folders.data.forEach(f => {
            const idIndex = folders.columns.findIndex(c => c === "id");
            const titleIndex = folders.columns.findIndex(c => c === "title");
            const parentIdIndex = folders.columns.findIndex(c => c === "parent_id");

            const folder = this.transformFolder(f, idIndex, titleIndex, parentIdIndex);
            map.set(folder.id, folder);

            if (!folder.parentId) {
                rootFolders.push(folder);
            }
        });

        return {rootFolders, map};
    }

    private addFolderToParent(map: Map<number, Folder>): void {
        for (const [key, folder] of map.entries()) {
            if (folder.parentId) {
                const children = map.get(folder.parentId)?.folderChildren;
                children?.push({ ...folder })
               //map.get(folder.parentId)?.folderChildren.push(folder);
            }
        }
    }

    private addItemToParent(map: Map<number, Folder>, items: { columns: string[], data: [number, string, number][] }): void {
        items.data.forEach(i => {
            const idIndex = items.columns.findIndex(c => c === "id");
            const titleIndex = items.columns.findIndex(c => c === "title");
            const folderIdIndex = items.columns.findIndex(c => c === "folder_id");

            const item = this.transformItem(i, idIndex, titleIndex, folderIdIndex);

            map.get(item.folderId)?.itemChildren.push(item);
        });
    }

    private transformFolder(
        folder: [number, string, number],
        idIndex: number,
        titleIndex: number,
        parentIdIndex: number
    ): Folder {
        return {
            id: folder[idIndex] as number,
            title: folder[titleIndex] as string,
            parentId: folder[parentIdIndex] as number,
            folderChildren: [],
            itemChildren: [],
            state: FolderStateEnum.Unselected
        };
    }

    private transformItem(
        item: [number, string, number],
        idIndex: number,
        titleIndex: number,
        folderIdIndex: number
    ): Item {
        return {
            id: item[idIndex] as number,
            title: item[titleIndex] as string,
            folderId: item[folderIdIndex] as number,
            isSelected: false
        };
    }
}