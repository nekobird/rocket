import {
  DragEventManager,
  DOMTraverse,
} from '../../rocket';

import {
  Sortable,
} from './sortable';

export class EventManager {

  public sortable: Sortable;

  public dragEventManager?: DragEventManager;

  constructor(sortable: Sortable) {
    this.sortable = sortable;
  }  

  public initialize() {
    const { config } = this.sortable;

    this.dragEventManager = new DragEventManager({
      enableLongPress: (config.activateOnLongPress || config.listenToLongPress),
      longPressWait: config.longPressWait,

      condition: this.dragCondition,

      onDown: this.handleOnDown,
      onDrag: this.handleOnDrag,
      onUp: this.handleOnUp,
      onCancel: this.handleOnCancel,
      onLongPress: this.handleOnLongPress,
    });
  }


  public getItemFromDownEvent(event): HTMLElement | false {
    if (typeof event.downData === 'object') {
      const item: HTMLElement | HTMLElement[] | false = DOMTraverse.findAncestor(
        event.downData.target,
        item => ((<HTMLElement[]>this.sortable.config.items).indexOf(item) !== -1),
        false
      );

      if (item !== false) {
        return <HTMLElement>item;
      }
    }
    return false;
  }

  private dragCondition = event => {
    const item = this.getItemFromDownEvent(event)

    if (item !== false) {
      this.sortable.targetItem = item
      return true
    }

    return false
  }

  private handleOnDown = (event, manager) => {
    const { config, targetItem } = this.sortable

    config.onDown(<HTMLElement>targetItem, event, manager, this.sortable)

    if (config.activateOnLongPress === false) {
      this.sortable.activate(<HTMLElement>targetItem, event)
    }
  }

  private handleOnLongPress = (event, manager) => {
    const { config, targetItem } = this.sortable

    config.onLongPress(<HTMLElement>targetItem, event, manager, this.sortable)  

    if (
      config.activateOnLongPress === true
      && event.previousEvent !== 'drag'
    ) {
      this.sortable.activate(<HTMLElement>targetItem, event)
    }
  }

  private handleOnDrag = (event, manager) => {
    const { config, targetItem, isActive, activeIdentifier } = this.sortable

    config.onDrag(<HTMLElement>targetItem, event, manager, this.sortable)
    
    if (
      isActive === true
      && activeIdentifier === event.identifier.toString()
      && typeof event.dragData === 'object'
    ) {
      this.sortable.move(event.dragData)
    }
  }

  private handleOnUp = (event, manager) => {
    const { config, targetItem, isActive, activeIdentifier } = this.sortable

    config.onUp(<HTMLElement>targetItem, event, manager, this.sortable)

    if (
      isActive === true
      && activeIdentifier === event.identifier.toString()
    ) {
      this.sortable.deactivate()
    }
  }

  private handleOnCancel = (event, manager) => {
    const { config, targetItem, isActive, activeIdentifier } = this.sortable

    config.onCancel(<HTMLElement>targetItem, event, manager, this.sortable)

    if (
      isActive === true
      && activeIdentifier === event.identifier.toString()
    ) {
      this.sortable.deactivate()
    }
  }
}