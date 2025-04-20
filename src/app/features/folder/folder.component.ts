import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Folder, FolderState, FolderStateEnum } from '../../core/models/folder';
import { FormsModule } from '@angular/forms';
import { ItemComponent } from '../item/item.component';
import { CommonModule } from '@angular/common';
import { SortService } from '../../core/services/utilities/sort.service';

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
  stateToPassDown?: FolderState | null;
  collapsed = false;

  constructor(private sortService: SortService) { }

  ngOnInit(): void {
    if (this.folder.folderChildren.length) {
      this.sortService.sortByTitle(this.folder.folderChildren);
    }

    if (this.folder.itemChildren.length) {
      this.sortService.sortByTitle(this.folder.itemChildren);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle changes from parent passed down
    if (changes["parentState"] && changes["parentState"].currentValue != null) {
      this.folder.state = changes["parentState"].currentValue;
      this.stateToPassDown = this.folder.state;
    }

    // Handle clearing from clear button click
    if (changes['clearFlag']) {
      this.folder.state = FolderStateEnum.Unselected;
      this.stateToPassDown = FolderStateEnum.Unselected;
    }
  }

  toggleCheckbox(): void {
    if (this.folder.state === FolderStateEnum.Selected) {
      this.folder.state = FolderStateEnum.Unselected;
    } else {
      this.folder.state = FolderStateEnum.Selected;
    }

    // Pass new state both to parent and children
    this.stateToPassDown = this.folder.state;
    this.stateChanged.emit(this.folder.state);
  }
  
  toggleFolder(): void {
    this.collapsed = !this.collapsed;
  }

  onChildChangeUpdateState(): void {
  // Handle changes from child passed up

    this.stateToPassDown = null;
    if (this.folder.itemChildren.every(i => i.isSelected)
      && this.folder.folderChildren.every(f => f.state === FolderStateEnum.Selected)
    ) {
      this.folder.state = FolderStateEnum.Selected;

    } else if (this.folder.itemChildren.every(i => !i.isSelected)
      && this.folder.folderChildren.every(f => !f.state || f.state === FolderStateEnum.Unselected)) { 
      this.folder.state = FolderStateEnum.Unselected;

    } else {
      this.folder.state = FolderStateEnum.Indeterminate;
    }

    this.stateChanged.emit(this.folder.state);
  }
}
