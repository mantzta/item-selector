import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { Folder } from '../../core/models/folder';
import { FolderComponent } from '../folder/folder.component';
import { SortService } from '../../core/services/utilities/sort.service';
import { ItemSelectionApiService } from '../../core/services/apis/item-selection-api.service';
import { SelectionMap } from '../../core/models/selection-map';

@Component({
  selector: 'app-item-selector',
  standalone: true,
  imports: [FolderComponent],
  templateUrl: './item-selector.component.html',
  styleUrl: './item-selector.component.scss'
})
export class ItemSelectorComponent implements OnInit {
  rootFolders!: Folder[];
  loadingTree = true;
  clearFlag = false;

  constructor(private itemSelectionApiService: ItemSelectionApiService, private sortService: SortService) { }

  ngOnInit(): void {
    this.itemSelectionApiService.getFoldersWithItems().pipe(
      finalize(() => this.loadingTree = false)
    ).subscribe((response: SelectionMap) => {
      this.rootFolders = response.rootFolders;
      this.sortService.sortByTitle(this.rootFolders);
    });
  }

  clearSelection(): void {
    this.clearFlag = !this.clearFlag;
  }
}
