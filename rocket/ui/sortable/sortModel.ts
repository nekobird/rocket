import {
  Sortable,
} from './sortable';

export interface Model {
  
}

export class SortModel {
  public sortable: Sortable;

  constructor(sortable: Sortable) {
    this.sortable = sortable;
  }

  public createModel() {
    
  }
}