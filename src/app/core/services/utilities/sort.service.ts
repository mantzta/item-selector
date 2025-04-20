import { Injectable } from '@angular/core';
import { Item } from '../../models/item';
import { Folder } from '../../models/folder';

@Injectable({
    providedIn: 'root'
})
export class SortService {
    sortByTitle(elements: (Folder | Item)[]): void {
        elements.sort((a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();

            if (titleA < titleB) {
                return -1;
            }
            if (titleA > titleB) {
                return 1;
            }
            return 0;
        });
    }
}