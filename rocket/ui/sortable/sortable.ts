import {
  DOMPoint,
  DOMTraverse,
  Point,
  PointHelper,
} from '../../rocket';

import {
  SORTABLE_CONFIG,
  SortableConfig,
} from './config';

import {
  EventManager,
} from './eventManager';

import {
  ItemManager,
} from './itemManager';

export class Sortable {
  public config: SortableConfig;

  public eventManager: EventManager;
  public itemManager: ItemManager;

  public isActive: boolean = false;
  public hasMoved: boolean = false;

  public activeIdentifier?: string;

  public initialOffset?: Point;

  public targetItem?: HTMLElement;
  public activeItem?: HTMLElement;
  public dummyElement?: HTMLElement;

  constructor(config?: Partial<SortableConfig>) {
    this.config = Object.assign({}, SORTABLE_CONFIG);
    if (typeof config === 'object') {
      this.setConfig(config);
    }

    this.eventManager = new EventManager(this);
    this.itemManager = new ItemManager(this);
  }  

  public setConfig(config: Partial<SortableConfig>) {
    Object.assign(this.config, config);
  }

  public initialize() {
    this.itemManager.initialize();
    this.eventManager.initialize();
  }

  // @event_handler
  public preventDefault = event => {
    event.preventDefault();
  };

  // @helper
  public getLastItem(): HTMLElement | false {
    return DOMTraverse.getNthChild('last', <HTMLElement>this.config.container, item => {
      return (
        (<HTMLElement[]>this.config.items).indexOf(item) !== -1
        && this.activeItem !== item
        && this.dummyElement !== item
      );
    });
  }

  public prepareAndInsertDummyElementAt(point: Point) {
    const closestItem = DOMPoint.getClosestChildFromPoints(
      <HTMLElement>this.config.container,
      DOMPoint.getElementCornerPoints(<HTMLElement>this.activeItem),
      item => {
        return (
          (<HTMLElement[]>this.config.items).indexOf(item) !== -1
          && this.activeItem !== item
        );
      }
    );

    if (closestItem !== false) {
      if (typeof this.dummyElement === 'undefined') {
        this.dummyElement = this.config.createDummyFromItem(
          <HTMLElement>this.activeItem, this
        );
      }

      this.config.setDummyElementPropertiesFromItem(
        this.dummyElement, <HTMLElement>this.activeItem, this
      );

      this.insertDummyElement(closestItem, point);
    } 
  }

  public insertDummyElement(closestItem: HTMLElement, point: Point) {
    if (
      typeof this.dummyElement === 'object'
      && typeof this.activeItem === 'object'
    ) {
      const activeItemTopPoints = DOMPoint.getElementTopPoints(this.activeItem);
      const activeItemBottomPoints = DOMPoint.getElementBottomPoints(this.activeItem);

      if (DOMPoint.elementCenterIsAbovePoints(closestItem, activeItemTopPoints) === true) {
        (<HTMLElement>this.itemManager.container).insertBefore(this.dummyElement, closestItem.nextElementSibling);
      }
      else if (DOMPoint.elementCenterIsBelowPoints(closestItem, activeItemBottomPoints) === true) {
        (<HTMLElement>this.itemManager.container).insertBefore(this.dummyElement, closestItem);
      }
    }
  }

  public updateInitialOffset({ clientX: x, clientY: y}) {
    if (typeof this.activeItem === 'object') {
      this.initialOffset = DOMPoint.getElementOffsetFromPoint(
        this.activeItem, { x, y }
      );
    }
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

  public activate(item: HTMLElement, { identifier, downData }) {
    if (this.isActive === false) {
      this.disableEventsOnActivate();

      this.isActive = true;
      this.activeItem = item;
      this.activeIdentifier = identifier.toString();

      this.disableActiveItemEventsOnActivate();

      this.config.activateItem(this.activeItem, this);
      this.updateInitialOffset(downData);
    }
  }

  public move({ clientX: x, clientY: y }) {
    if (
      this.isActive === true
      && typeof this.activeItem === 'object'
    ) {
      if (this.hasMoved === false) {
        this.config.popItem(this.activeItem, this);
        this.hasMoved = true;
      }

      const point: Point = { x, y };
      const offset = DOMPoint.getElementOffsetFromPoint(
        <HTMLElement>this.config.container, point
      );

      const to: Point = PointHelper.subtract(offset, <Point>this.initialOffset);

      this.config.moveItem(this.activeItem, to, this);

      this.prepareAndInsertDummyElementAt(point);
    }
  }

  public deactivate() {
    if (
      this.isActive === true
      && typeof this.activeItem === 'object'
    ) {
      this.config.deactivateItem(this.activeItem, this);
      this.config.unpopItem(this.activeItem, this);

      if (typeof this.dummyElement !== 'undefined') {
        (<HTMLElement>this.config.container).replaceChild(
          this.activeItem, this.dummyElement
        );
      }

      this.enableActiveItemEventsOnDeactivate();

      this.isActive = false;
      this.hasMoved = false;

      this.activeItem = undefined;
      this.dummyElement = undefined;
      this.initialOffset = undefined;
      this.activeIdentifier = undefined;

      this.config.onComplete(this);

      this.enableEventsOnDeactivate();
    }
  }
}