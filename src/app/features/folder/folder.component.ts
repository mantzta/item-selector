import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Folder, FolderState, FolderStateEnum } from '../../core/models/folder';
import { FormsModule } from '@angular/forms';
import { ItemComponent } from '../item/item.component';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../core/services/item.service';
import { SelectionService } from '../../core/services/selection.service';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [FormsModule, CommonModule, ItemComponent],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent implements OnInit, OnChanges {
  @Input() folder!: Folder;
  @Input() parentState?: FolderState | null;
  @Input() level!: number;
  @Input() clearFlag?: boolean;
  @Output() stateChanged = new EventEmitter<FolderState>();
  state?: FolderState | null;
  collapsed = false;

  constructor(private itemService: ItemService, private selectionService: SelectionService) {}

  ngOnInit(): void {
    if (this.folder.folderChildren.length) {
      this.itemService.sortByTitle(this.folder.folderChildren);
    }

    if (this.folder.itemChildren.length) {
      this.itemService.sortByTitle(this.folder.itemChildren);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["parentState"] && changes["parentState"].currentValue != null) {
      this.folder.state = changes["parentState"].currentValue;
      this.state = this.folder.state;
      this.updateSelectedChildren();
    }

    if (changes['clearFlag']) {
      this.folder.state = FolderStateEnum.Unselected;
      this.state = FolderStateEnum.Unselected;
      this.updateSelectedChildren();
    }
  }

  toggleFolderCheckbox(): void {
    if (this.folder.state === FolderStateEnum.Selected) {
      this.folder.state = FolderStateEnum.Unselected;
    } else {
      this.folder.state = FolderStateEnum.Selected;
    }

    this.updateSelectedChildren();
    this.state = this.folder.state;
    this.stateChanged.emit(this.folder.state);
  }
  
  toggleFolder(): void {
    this.collapsed = !this.collapsed;
  }

  updateSelectedChildren(): void {
    if (this.folder.state === FolderStateEnum.Unselected) {
      this.folder.selectedItems.forEach(i => this.selectionService.removeItem(i));
      this.folder.selectedItems.clear();
    } else if (this.folder.state === FolderStateEnum.Selected) {
      this.folder.itemChildren.forEach(item => this.folder.selectedItems.add(item.id));
      this.folder.selectedItems.forEach(i => this.selectionService.addItem(i));
    }
  }

  onChildFolderStateChange(): void {
    this.changeFolderState();
  }

  onChildItemStateChange(selected: boolean, itemId: number): void {
    if (selected) {
      this.folder.selectedItems.add(itemId);
      this.selectionService.addItem(itemId);
    } else {
      this.folder.selectedItems.delete(itemId);
      this.selectionService.removeItem(itemId);
    }

    this.changeFolderState();
  }

  private changeFolderState(): void {
    this.state = null;
    if (this.folder.selectedItems.size === this.folder.itemChildren.length
      && this.folder.folderChildren.every(f => f.state === FolderStateEnum.Selected)
    ) {
      this.folder.state = FolderStateEnum.Selected;
    } else if (this.folder.selectedItems.size === 0
      && this.folder.folderChildren.every(f => !f.state || f.state === FolderStateEnum.Unselected)) { 
      this.folder.state = FolderStateEnum.Unselected;
    } else {
      this.folder.state = FolderStateEnum.Indeterminate;
    }

    this.stateChanged.emit(this.folder.state);
  }
}
