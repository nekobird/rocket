import {
  DOMPoint,
  Point,
  PointHelper,
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
import { DOMTraverse } from '../../dom/DOMTraverse';

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
    console.log(this.itemManager.items);
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
          downData.clientY
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
      && typeof this.itemManager.group === 'object'
    ) {
      if (this.hasMoved === false) {
        this.prepareDummy();

        this.itemManager.group.insertBefore(
          <HTMLElement>this.dummy,
          this.activeItem
        );
        this.config.popItem(this.activeItem, this.itemManager.group, this);
        this.hasMoved = true;
      }
      const pointer = { x, y };
      const groupPointerOffset = DOMPoint.getElementOffsetFromPoint(this.itemManager.group, pointer);
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
      && typeof this.itemManager.group === 'object'
    ) {
      const corners = DOMPoint.getElementCornerPoints(this.activeItem);
      const element = DOMPoint.getClosestChildFromPoints(this.itemManager.group, corners, item => {
        return (
          item !== this.activeItem &&
          item.classList.contains('sortableItem') === true
        );
      });
      if (typeof element === 'object') {
        const topPoints = DOMPoint.getElementTopPoints(this.activeItem);
        if (DOMPoint.elementCenterIsAbovePoints(element, topPoints) === true) {
          this.itemManager.group.insertBefore(<HTMLElement>this.dummy, element);
        }

        const bottomPoints = DOMPoint.getElementBottomPoints(this.activeItem);
        if (DOMPoint.elementCenterIsBelowPoints(element, bottomPoints) === true) {
          this.itemManager.group.insertBefore(<HTMLElement>this.dummy, element.nextElementSibling);
        }
      }
    }
  }

  public deactivate() {
    if (
      this.isActive === true
      && typeof this.activeItem === 'object'
      && typeof this.itemManager.group === 'object'
    ) {

      this.config.deactivateItem(this.activeItem, this);
      this.config.unpopItem(this.activeItem, this.itemManager.group, this);

      this.itemManager.group.replaceChild(
        this.activeItem,
        <HTMLElement>this.dummy
      );

      this.enableActiveItemEventsOnDeactivate();

      this.isActive = false;
      this.hasMoved = false;

      this.activeItem = undefined;
      this.dummy = undefined;
      this.activeIdentifier = undefined;
      this.activeItemPointOffset = undefined;

      this.enableEventsOnDeactivate();

      this.config.onComplete(this);
    }
  }
}