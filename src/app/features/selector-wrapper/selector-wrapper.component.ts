import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ItemSelectorComponent } from "../item-selector/item-selector.component";
import { SelectionService } from '../../core/services/selection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-selector-wrapper',
  standalone: true,
  imports: [ItemSelectorComponent],
  templateUrl: './selector-wrapper.component.html',
  styleUrl: './selector-wrapper.component.scss'
})
export class SelectorWrapperComponent implements OnInit, OnDestroy {
  @ViewChild(ItemSelectorComponent) itemSelector!: ItemSelectorComponent;
  selectedItemsIds: number[] = [];
  clearSelection?: boolean;
  selectedSubscription!: Subscription;

  constructor(private selectionService: SelectionService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.selectedSubscription = this.selectionService.selectedItems$.subscribe(items => {
      this.selectedItemsIds = [...items];
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.selectedSubscription.unsubscribe();
  }

  triggerClear(): void {
    this.itemSelector.clearSelection();
  }
}

