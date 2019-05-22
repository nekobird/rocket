import {
  Sortable,
} from './sortable';

export interface ItemModel {
  item: HTMLElement;
  left: number;
  top: number;
  
}

export class SortModel {
  public sortable: Sortable;

  constructor(sortable: Sortable) {
    this.sortable = sortable;
  }

  public createModel() {
    
  }
}