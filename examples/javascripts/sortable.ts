import {
  DOMHelper,
  DOMUtil,
  DragEventManager,
  Point,
} from '../../rocket/rocket'

export interface SortableConfig {

}

const SORTABLE_CONFIG: SortableConfig = {

}

export class Sortable {

  public isActive: boolean = false
  public hasMoved: boolean = false
  public activeItem: HTMLElement

  public dragEventManager: DragEventManager

  constructor() {

  }



  private reset() {
    this.isActive   = false
    this.hasMoved   = false
    this.activeItem = undefined
  }
}