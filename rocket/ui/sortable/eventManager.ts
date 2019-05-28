import {
  DOMTraverse,
  DragEventManager,
} from '../../rocket';

import {
  Sortable,
} from './sortable';

export class EventManager {
  public sortable: Sortable;

  public dragEventManager: DragEventManager;

  constructor(sortable: Sortable) {
    this.dragEventManager = new DragEventManager();
    this.sortable = sortable;
  }

  public initialize() {
    const { config } = this.sortable;
    this.dragEventManager.setConfig({
      enableDownRepeater: true,
      downRepeaterDelay: 1 / 60,

      enableLongPress: (config.activateOnLongPress || config.listenToLongPress),
      longPressWait: config.longPressWait,

      leftMouseButtonOnly: config.leftMouseButtonOnly,

      condition: this.eventCondition,
      onDownRepeat: this.handleOnActive,
      onDown: this.handleOnDown,
      onLongPress: this.handleOnLongPress,
      onDrag: this.handleOnDrag,
      onUp: this.handleOnUp,
      onCancel: this.handleOnCancel,
    });

    this.dragEventManager.initialize();
  }

  public getTargetItemFromDownEvent(event): HTMLElement | false {
    if (
      typeof event.downData === 'object'
      && typeof event.downData.target === 'object'
    ) {
      return event.downData.target;
    }
    return false;
  }

  public eventCondition = event => {
    const { itemManager } = this.sortable;
    const item = this.getTargetItemFromDownEvent(event);
    if (
      item !== false
      && typeof itemManager.items === 'object'
      && Array.isArray(itemManager.items) === true
    ) {
      const targetItem = DOMTraverse.findAncestor(
        item, element => (<HTMLElement[]>itemManager.items).indexOf(element) !== -1, false
      );
      if (targetItem !== false) {
        this.sortable.targetItem = <HTMLElement>targetItem;
        return true;
      }
    }
    return false;
  }

  private handleOnDown = (event, manager) => {
    const { config, targetItem } = this.sortable;
    config.onDown(
      <HTMLElement>targetItem, event,
      manager, this.sortable
    );
    if (config.activateOnLongPress === false) {
      this.sortable.activate(event);
    }
  }

  private handleOnLongPress = (event, manager) => {
    const { config, targetItem } = this.sortable;
    config.onLongPress(
      <HTMLElement>targetItem, event,
      manager, this.sortable
    );
    if (
      config.activateOnLongPress === true
      && event.previousEvent !== 'drag'
    ) {
      this.sortable.activate(event);
    }
  }

  public handleOnDrag = (event, manager) => {
    const { config, targetItem, isActive, activeIdentifier } = this.sortable;
    config.onDrag(
      <HTMLElement>targetItem, event,
      manager, this.sortable
    );
    if (
      isActive === true
      && activeIdentifier === event.identifier.toString()
      && typeof event.dragData === 'object'
    ) {
      this.sortable.move(event.dragData);
    }
  }

  public handleOnUp = (event, manager) => {
    const { config, targetItem, isActive, activeIdentifier } = this.sortable;
    config.onUp(
      <HTMLElement>targetItem, event,
      manager, this.sortable
    );
    if (
      isActive === true
      && activeIdentifier === event.identifier.toString()
      && typeof event.upData === 'object'
    ) {
      this.sortable.deactivate();
    }
  }

  private handleOnCancel = (event, manager) => {
    const { config, targetItem, isActive, activeIdentifier } = this.sortable;
    config.onCancel(
      <HTMLElement>targetItem, event,
      manager, this.sortable
    );
    if (
      isActive === true
      && activeIdentifier === event.identifier.toString()
    ) {
      this.sortable.deactivate();
    }
  }

  private handleOnActive = (event, manager) => {
    const { config, isActive, activeIdentifier } = this.sortable;
    if (
      isActive === true
      && activeIdentifier === event.identifier.toString()
      && config.autoScroll === true
    ) {
      this.sortable.scrollCheck();
    } 
  }
}
