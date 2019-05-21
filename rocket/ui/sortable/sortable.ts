import {
  DOMPoint,
  DOMTraverse,
  Point,
  PointHelper,
  ViewportModel,
} from '../../rocket';

import {
  SORTABLE_DEFAULT_CONFIG,
  SortableConfig,
} from './config';

import {
  ItemManager,
} from './itemManager';

import {
  EventManager,
} from './eventManager';

export class Sortable {

  public config: SortableConfig;
  public itemManager: ItemManager;
  public eventManager: EventManager;

  public isActive: boolean = false;
  public hasMoved: boolean = false;

  public targetItem?: HTMLElement;
  public activeItem?: HTMLElement;
  public activeIdentifier?: string;
  public activeItemPointOffset?: Point;

  public dummy?: HTMLElement;

  public determineItem = item => item.classList.contains('sortableItem');

  constructor(config?: Partial<SortableConfig>) {
    this.config = Object.assign({}, SORTABLE_DEFAULT_CONFIG);
    if (typeof config === 'object') {
      this.setConfig(config);
    }

    this.itemManager = new ItemManager(this);
    this.eventManager = new EventManager(this);
  }

  public setConfig(config: Partial<SortableConfig>) {
    Object.assign(this.config, config);
  }

  public initialize() {
    this.itemManager.initialize();
    this.eventManager.initialize();
  }

  // @getters

  public get groupElement(): HTMLElement | false {
    if (typeof this.itemManager.group === 'object') {
      return this.itemManager.group;
    }
    return false;
  }

  public get itemElements(): HTMLElement[] | false {
    if (
      typeof this.itemManager.items === 'object'
      && Array.isArray(this.itemManager.items) === true
    ) {
      return this.itemManager.items;
    }
    return false;
  }

  // @event_handler

  public preventDefault = event => {
    event.preventDefault();
  }

  // @events

  public disableEventsOnActivate() {
    if (this.config.disableTouchEventsWhileActive === true) {
      window.addEventListener('touchstart', this.preventDefault, { passive: false });
      window.addEventListener('touchmove', this.preventDefault, { passive: false });
      window.addEventListener('touchend', this.preventDefault, { passive: false });
    }
  }

  public enableEventsOnDeactivate() {
    if (this.config.disableTouchEventsWhileActive === true) {
      window.removeEventListener('touchstart', this.preventDefault);
      window.removeEventListener('touchmove', this.preventDefault);
      window.removeEventListener('touchend', this.preventDefault);
    }
  }

  public disableActiveItemEventsOnActivate() {
    if (
      this.config.disableEventsOnItemWhileActive === true
      && typeof this.activeItem === 'object'
    ) {
      this.activeItem.addEventListener('touchstart', this.preventDefault, { passive: false });
      this.activeItem.addEventListener('touchmove', this.preventDefault, { passive: false });
      this.activeItem.addEventListener('touchend', this.preventDefault, { passive: false });
    }
  }

  public enableActiveItemEventsOnDeactivate() {
    if (
      this.config.disableEventsOnItemWhileActive === true
      && typeof this.activeItem === 'object'
    ) {
      this.activeItem.removeEventListener('touchstart', this.preventDefault);
      this.activeItem.removeEventListener('touchmove', this.preventDefault);
      this.activeItem.removeEventListener('touchend', this.preventDefault);
    }
  }

  // @actions

  public activate({ identifier, downData }) {
    if (
      this.isActive === false
      && typeof this.targetItem !== 'undefined'
    ) {
      this.disableEventsOnActivate();

      this.isActive = true;
      this.activeItem = this.targetItem;
      this.activeIdentifier = identifier.toString();

      this.disableActiveItemEventsOnActivate();

      this.config.activateItem(<HTMLElement>this.activeItem, this);

      this.updateInitialActiveItemOffset(downData);
    }
  }

  public updateInitialActiveItemOffset(downData) {
    if (typeof this.activeItem !== 'undefined') {
      this.activeItemPointOffset = DOMPoint.getElementOffsetFromPoint(
        this.activeItem,
        PointHelper.newPoint(
          downData.clientX,
          downData.clientY,
        )
      );
    }
  }

  public prepareDummy() {
    if (typeof this.activeItem === 'object') {
      if (typeof this.dummy === 'undefined') {
        this.dummy = this.config.createDummyFromItem(this.activeItem, this);
      }
      this.config.setDummyElementPropertiesFromItem(this.dummy, this.activeItem, this);
    }
  }

  public move({ clientX: x, clientY: y }) {
    if (
      this.isActive === true
      && typeof this.activeItem === 'object'
      && this.groupElement !== false
    ) {
      if (this.hasMoved === false) {
        this.prepareDummy();

        this.groupElement.insertBefore(
          <HTMLElement>this.dummy,
          this.activeItem
        );
        this.config.popItem(this.activeItem, this.groupElement, this);
        this.hasMoved = true;
      }
      const pointer = { x, y };
      const groupPointerOffset = DOMPoint.getElementOffsetFromPoint(this.groupElement, pointer);
      const to = PointHelper.subtract(
        groupPointerOffset,
        <Point>this.activeItemPointOffset
      );
      this.config.moveItem(this.activeItem, to, this);
      this.prepareAndInsertDummy();
    }
  }

  public prepareAndInsertDummy() {
    if (
      typeof this.activeItem === 'object'
      && this.groupElement !== false
      && this.itemElements !== false
    ) {
      const corners = DOMPoint.getElementCornerPoints(this.activeItem);
      const closestChild = DOMPoint.getClosestChildFromPoints(
        this.groupElement,
        corners,
        item => {
          return (
            item !== this.activeItem
            && (<HTMLElement[]>this.itemElements).indexOf(item) !== -1
          );
        },
      );

      if (typeof closestChild === 'object') {
        const topPoints = DOMPoint.getElementTopPoints(this.activeItem);
        if (DOMPoint.elementCenterIsAbovePoints(closestChild, topPoints) === true) {
          this.groupElement.insertBefore(
            <HTMLElement>this.dummy,
            closestChild
          );
        }

        const bottomPoints = DOMPoint.getElementBottomPoints(this.activeItem);
        if (DOMPoint.elementCenterIsBelowPoints(closestChild, bottomPoints) === true) {
          this.groupElement.insertBefore(
            <HTMLElement>this.dummy,
            closestChild.nextElementSibling
          );
        }
      }
    }
  }

  public deactivate() {
    if (
      this.isActive === true
      && typeof this.activeItem === 'object'
      && this.groupElement !== false
    ) {
      this.config.deactivateItem(this.activeItem, this);
      this.config.unpopItem(this.activeItem, this.groupElement, this);

      this.groupElement.replaceChild(
        this.activeItem,
        <HTMLElement>this.dummy,
      );

      this.enableActiveItemEventsOnDeactivate();

      this.isActive = false;
      this.hasMoved = false;

      if (this.groupElement.contains(<HTMLElement>this.dummy) === true) {
        this.groupElement.removeChild(<HTMLElement>this.dummy);
      }

      this.activeItem = undefined;
      this.dummy = undefined;
      this.activeIdentifier = undefined;
      this.activeItemPointOffset = undefined;

      this.enableEventsOnDeactivate();

      this.config.onComplete(this);
    }
  }

  public scrollCheck() {
    // TODO: Fix flickering issues onScrollUp.
    if (
      this.isActive === true
      && typeof this.activeItem !== 'undefined'
      && this.config.autoScroll === true
    ) {
      const bottomPoint = DOMPoint.getElementBottomPoints(this.activeItem)[0].y;
      const topPoint = DOMPoint.getElementTopPoints(this.activeItem)[0].y;
      if (bottomPoint >= ViewportModel.height) {
        window.scrollBy(0, 5);
      } else if (topPoint <= 0) {
        window.scrollBy(0, -5);
      }
    }
  }
}
