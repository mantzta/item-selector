import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SelectionService {
    private selectedItemsSubject = new BehaviorSubject<Set<number>>(new Set<number>());
    selectedItems$ = this.selectedItemsSubject.asObservable();

    addItem(id: number): void {
        const currentSelected = this.selectedItemsSubject.value;
        currentSelected.add(id);
        this.selectedItemsSubject.next(currentSelected);
    }

    removeItem(id: number): void {
        const currentSelected = this.selectedItemsSubject.value;
        currentSelected.delete(id);
        this.selectedItemsSubject.next(currentSelected);
    }

    clearSelection(): void {
        this.selectedItemsSubject.next(new Set<number>());
    }

    getSelectedItems(): Set<number> {
        return this.selectedItemsSubject.value;
    }
}
