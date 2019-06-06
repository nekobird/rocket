import {
  DOMTraverse,
  DOMUtil,
  DragEventManager,
} from '../../rocket';

import {
  SortableList,
} from './sortableList';

export class EventManager {
  public sortable: SortableList;
  public dragEventManager: DragEventManager;

  public isActive: boolean = false;
  public activeIdentifier?: string;

  constructor(sortable: SortableList) {
    this.dragEventManager = new DragEventManager();
    this.sortable = sortable;
  }

  public initialize() {
    const { config } = this.sortable;
    this.dragEventManager.setConfig({
      enableLongPress: (config.activateOnLongPress || config.listenToLongPress),
      longPressWait: config.longPressWait,

      leftMouseButtonOnly: config.leftMouseButtonOnly,

      enableDownRepeater: true,
      downRepeaterFrequency: 60,
      onDownRepeat: this.handleOnActive,

      condition: this.eventCondition,
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
      && DOMUtil.isHTMLElement(event.downData.target)
    ) {
      return event.downData.target;
    }
    return false;
  }

  public eventCondition = event => {
    const { config, elementManager } = this.sortable;
    const item = this.getTargetItemFromDownEvent(event);
    if (
      item !== false
      && typeof elementManager.items === 'object'
      && Array.isArray(elementManager.items) === true
    ) {
      const targetItem = DOMTraverse.findAncestor(
        item,
        element => (elementManager.items as HTMLElement[]).indexOf(element) !== -1,
        false,
      );
      if (
        targetItem !== false
        && config.condition(
          targetItem as HTMLElement, event, this.dragEventManager, this.sortable
        ) === true
      ) {
        this.sortable.targetItem = targetItem as HTMLElement;
        return true;
      }
    }
    return false;
  }

  private handleOnDown = (event, manager) => {
    const { config, targetItem } = this.sortable;
    config.onDown(
      targetItem as HTMLElement, event, manager, this.sortable
    );
    if (config.activateOnLongPress === false) {
      this.activate(event);
      this.sortable.activate(event);
    }
  }

  private handleOnLongPress = (event, manager) => {
    const { config, targetItem } = this.sortable;
    config.onLongPress(
      targetItem as HTMLElement, event, manager, this.sortable
    );
    if (
      config.activateOnLongPress === true
      && config.longPressCondition(event, manager, this.sortable) === true
    ) {
      this.activate(event);
      this.sortable.activate(event);
    }
  }

  public handleOnDrag = (event, manager) => {
    const { config, targetItem, isActive, activeIdentifier } = this.sortable;
    config.onDrag(
      targetItem as HTMLElement, event, manager, this.sortable
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
      targetItem as HTMLElement, event, manager, this.sortable
    );
    if (
      isActive === true
      && activeIdentifier === event.identifier.toString()
      && typeof event.upData === 'object'
    ) {
      this.deactivate();
      this.sortable.deactivate();
    }
  }

  private handleOnCancel = (event, manager) => {
    const { config, targetItem, isActive, activeIdentifier } = this.sortable;
    config.onCancel(
      targetItem as HTMLElement, event, manager, this.sortable
    );
    if (
      isActive === true
      && activeIdentifier === event.identifier.toString()
    ) {
      this.deactivate();
      this.sortable.deactivate();
    }
  }

  private handleOnActive = (repeater, event, manager) => {
    const { config, isActive, activeIdentifier } = this.sortable;
    if (
      isActive === true
      && activeIdentifier === event.identifier.toString()
      && config.autoScroll === true
    ) {
      this.sortable.scrollCheck();
    } 
  }

  private activate(event) {
    this.isActive = true;
    this.activeIdentifier = event.identifier;
  }

  private deactivate() {
    this.isActive = false;
    this.activeIdentifier = undefined;
  }
}
