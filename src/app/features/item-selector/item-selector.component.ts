import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ItemService } from '../../core/services/item.service';
import { SelectionTree } from '../../core/models/selection-tree';
import { finalize } from 'rxjs';
import { Folder } from '../../core/models/folder';
import { FolderComponent } from '../folder/folder.component';

@Component({
  selector: 'app-item-selector',
  standalone: true,
  imports: [FolderComponent],
  templateUrl: './item-selector.component.html',
  styleUrl: './item-selector.component.scss'
})
export class ItemSelectorComponent implements OnInit {
  @Output() updatedSelection = new EventEmitter<number[]>();
  rootFolders!: Folder[];
  loadingTree = true;
  clearFlag = false;

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getFoldersWithItems().pipe(
      finalize(() => this.loadingTree = false)
    ).subscribe((response: SelectionTree) => {
      this.rootFolders = response.rootFolders;
      this.itemService.sortByTitle(this.rootFolders);
    });
  }

  clearSelection(): void {
    this.clearFlag = !this.clearFlag;
  }
}
