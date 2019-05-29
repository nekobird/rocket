// In progress
import {
  DOMPoint,
} from '../../rocket';

import {
  Sortable,
} from './sortable';

export interface ItemModel {
  item: HTMLElement;
  top: number;
  bottom: number;
}

export class SortModel {
  public sortable: Sortable;

  public items: ItemModel[];

  public isActive: boolean = false;

  constructor(sortable: Sortable) {
    this.sortable = sortable;
  }

  // This is done before activate until drag event is completed.
  public createModel() {
    const { itemManager, isActive, activeItem } = this.sortable;
    if (
      isActive === true
      && typeof itemManager.items !== 'undefined'
      && Array.isArray(itemManager.items) === true
    ) {
      this.items = [];

      itemManager.items.forEach(item => {
        if (item !== activeItem) {
          const { top, bottom } = item.getBoundingClientRect();
          this.items.push({ item, top, bottom });
        }
      });

      // Sort function
      this.items.sort((a, b) => a.top - b.top)
    }
  }

  public updateModel() {

  }

  public getClosestItemFromActiveItem() {
    const { isActive, activeItem, itemManager } = this.sortable;
    if (this.isActive === true) {

      // Check if its first item.
      if (activeItem.getBoundingClientRect().top <= this.items[0].top + this.items[0].item.offsetHeight / 2) {
        // Disable further scrolling.
      }


      // Check if it's last item.
      if (activeItem.getBoundingClientRect().bottom >= this.items[this.items.length - 1].top + this.items[0].item.offsetHeight / 2) {

      }
    }
  }

  public getClosestItemTopBottom() {
    let { activeItem } = this.sortable;
    for (let i = 0; i < this.items.length; i++) {
      activeItem = this.items[i].top
    }
  } 
  // TopBottom
  // centerOut
  // bottomUp
}