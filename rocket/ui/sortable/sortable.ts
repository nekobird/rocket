import {
  DOMPoint,
  DOMUtil,
  Point,
  PointHelper,
  ViewportModel,
} from '../../rocket';

import {
  SORTABLE_DEFAULT_CONFIG,
  SortableConfig,
} from './config';

import {
  ElementManager,
} from './elementManager';

import {
  EventManager,
} from './eventManager';

import {
  SortModel,
} from './sortModel';

export class Sortable {
  public config: SortableConfig;

  public elementManager: ElementManager;
  public eventManager: EventManager;
  public sortModel: SortModel;

  public isActive: boolean = false;
  public hasMoved: boolean = false;

  public targetItem?: HTMLElement;
  public activeItem?: HTMLElement;
  public activeIdentifier?: string;
  public activeItemPointOffset?: Point;
  public dummy?: HTMLElement;

  constructor(config?: Partial<SortableConfig>) {
    this.config = Object.assign({}, SORTABLE_DEFAULT_CONFIG);
    if (typeof config === 'object') {
      this.setConfig(config);
    }
    this.elementManager = new ElementManager(this);
    this.eventManager = new EventManager(this);
    this.sortModel = new SortModel(this);
  }

  public setConfig(config: Partial<SortableConfig>) {
    Object.assign(this.config, config);
  }

  public initialize() {
    this.elementManager.initialize();
    this.eventManager.initialize();
  }

  public get groupElements(): HTMLElement[] | false {
    const { groups } = this.elementManager;
    if (
      typeof groups === 'object'
      && Array.isArray(groups) === true
    ) {
      return groups;
    }
    return false;
  }

  public get itemElements(): HTMLElement[] | false {
    const { items } = this.elementManager;
    if (
      typeof items === 'object'
      && Array.isArray(items) === true
    ) {
      return items;
    }
    return false;
  }

  public preventDefault = (event: TouchEvent) => {
    if (
      event.cancelable === true
      && this.eventManager.isActive === true
      && typeof event.changedTouches === 'object'
    ) {
      Array
        .from(event.changedTouches)
        .forEach(touch => {
          if (
            typeof touch.identifier !== 'undefined'
            && this.eventManager.activeIdentifier === touch.identifier.toString()
          ) {
            event.preventDefault();
          }
        });
    }
  }

  public disableEventsOnActivate() {
    if (this.config.disableTouchEventsWhileActive === true) {
      window.addEventListener('touchstart', this.preventDefault, { passive: false });
      window.addEventListener('touchmove',  this.preventDefault, { passive: false });
      window.addEventListener('touchend',   this.preventDefault, { passive: false });
    }
  }

  public enableEventsOnDeactivate() {
    if (this.config.disableTouchEventsWhileActive === true) {
      window.removeEventListener('touchstart', this.preventDefault);
      window.removeEventListener('touchmove',  this.preventDefault);
      window.removeEventListener('touchend',   this.preventDefault);
    }
  }

  public activate({ identifier, downData }) {
    if (
      this.isActive === false
      && typeof this.targetItem !== 'undefined'
    ) {
      this.config.beforeActivate(this);

      this.disableEventsOnActivate();
      this.isActive = true;
      this.activeItem = this.targetItem;
      this.activeIdentifier = identifier.toString();

      this.config.activateItem(this.activeItem as HTMLElement, this);
      this.updateInitialActiveItemOffset(downData);

      this.config.afterActivate(this);
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
      && this.groupElements !== false
    ) {
      if (this.hasMoved === false) {
        this.prepareDummy();
        this.groupElement.insertBefore(
          this.dummy as HTMLElement,
          this.activeItem
        );
        this.config.popItem(this.activeItem, this.groupElement, this);
        this.sortModel.
        this.hasMoved = true;
      }

      const pointer = { x, y };
      const groupPointerOffset = DOMPoint.getElementOffsetFromPoint(this.groupElement, pointer);
      const to = PointHelper.subtract(
        groupPointerOffset,
        this.activeItemPointOffset as Point
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
      && DOMUtil.isHTMLElement(this.dummy as HTMLElement) === true
    ) {
      const corners = DOMPoint.getElementCornerPoints(this.activeItem);
      const closestChild = DOMPoint.getClosestChildFromPoints(
        this.groupElement,
        corners,
        item => {
          return (
            item !== this.activeItem
            && (this.itemElements as HTMLElement[]).indexOf(item) !== -1
          );
        },
      );

      // We need to defer inserting element until deactivation.
      if (typeof closestChild === 'object') {
        const topPoints = DOMPoint.getElementTopPoints(this.activeItem);
        if (DOMPoint.elementCenterIsAbovePoints(closestChild, topPoints) === true) {
          this.groupElement.insertBefore(
            this.dummy as HTMLElement,
            closestChild
          );
        }

        const bottomPoints = DOMPoint.getElementBottomPoints(this.activeItem);
        if (DOMPoint.elementCenterIsBelowPoints(closestChild, bottomPoints) === true) {
          this.groupElement.insertBefore(
            this.dummy as HTMLElement,
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
      this.config.beforeDeactivate(this);
      this.config.deactivateItem(this.activeItem, this);
      this.config.unpopItem(this.activeItem, this.groupElement, this);

      if (DOMUtil.isHTMLElement(<HTMLElement>this.dummy) === true) {
        this.groupElement.replaceChild(
          this.activeItem,
          <HTMLElement>this.dummy,
        );
        if (this.groupElement.contains(<HTMLElement>this.dummy) === true) {
          this.groupElement.removeChild(<HTMLElement>this.dummy);
        }
      }

      this.isActive = false;
      this.hasMoved = false;

      this.activeItem = undefined;
      this.dummy = undefined;
      this.activeIdentifier = undefined;
      this.activeItemPointOffset = undefined;

      this.enableEventsOnDeactivate();
      this.config.afterDeactivate(this);
      this.config.onComplete(this);
    }
  }

  public scrollCheck() {
    // TODO: Fix flickering issues onScrollUp.
    // TODO: Check if it's already at the bottom or top.
    // TODO: Add offset support.
    // TODO: Add: Scroll Speed to config.
    if (
      this.isActive === true
      && typeof this.activeItem !== 'undefined'
      && this.config.autoScroll === true
    ) {
      const bottomPoint = DOMPoint.getElementBottomPoints(this.activeItem)[0].y;
      const topPoint = DOMPoint.getElementTopPoints(this.activeItem)[0].y;
      if (bottomPoint >= ViewportModel.height) {
        window.scrollBy(0, 1);
      } else if (topPoint <= 0) {
        window.scrollBy(0, -1);
      }
      this.prepareAndInsertDummy();
    }
  }
}
