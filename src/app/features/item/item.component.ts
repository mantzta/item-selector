import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Item } from '../../core/models/item';
import { FormsModule } from '@angular/forms';
import { FolderState, FolderStateEnum } from '../../core/models/folder';
import { CommonModule } from '@angular/common';
import { SelectionService } from '../../core/services/utilities/selection.service';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {
  @Input() item!: Item;
  @Input() parentState?: FolderState | null;
  @Input() level!: number;
  @Input() clearFlag?: boolean;
  @Output() stateChange = new EventEmitter<boolean>();

  constructor(private selectionService: SelectionService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["parentState"] && changes["parentState"].currentValue != null) {
      this.item.isSelected = changes["parentState"].currentValue === FolderStateEnum.Selected ? true : false;
      this.setSelectionInTotal();
    }

    if (changes['clearFlag']) {
      this.item.isSelected = false;
      this.setSelectionInTotal();
    }
  }

  toggleCheckbox(): void {
    this.item.isSelected = !this.item.isSelected;
    this.setSelectionInTotal();
    this.stateChange.emit(this.item.isSelected);
  }

  setSelectionInTotal() {
    if (this.item.isSelected) {
      this.selectionService.addItem(this.item.id);
    } else {
      this.selectionService.removeItem(this.item.id);
    }
  }
}
