import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Item } from '../../core/models/item';
import { FormsModule } from '@angular/forms';
import { FolderState, FolderStateEnum } from '../../core/models/folder';
import { CommonModule } from '@angular/common';

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
  isSelected = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["parentState"] && changes["parentState"].currentValue != null) {
      this.isSelected = changes["parentState"].currentValue === FolderStateEnum.Selected
        || changes["parentState"].currentValue === FolderStateEnum.Indeterminate ? true : false;
    }

    if (changes['clearFlag']) {
      this.isSelected = false;
    }
  }

  toggleRowCheckbox(): void {
    this.isSelected = !this.isSelected;
    this.stateChange.emit(this.isSelected);
  }
}
