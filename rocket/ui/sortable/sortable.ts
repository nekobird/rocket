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
  SortableTransition,
} from './sortableTransition';

import {
  Dummy,
} from './dummy';

import {
  ActiveItem,
} from './activeItem';

export class Sortable {
  public config: SortableConfig;

  public elementManager: ElementManager;
  public eventManager: EventManager;
  public dummy: Dummy;
  public activeItem: ActiveItem;
  public transition: SortableTransition;

  public isActive: boolean = false;
  public hasMoved: boolean = false;

  public targetItem?: HTMLElement;
  
  public activeIdentifier?: string;
  public activeItemPointOffset?: Point;

  constructor(config?: Partial<SortableConfig>) {
    this.config = Object.assign({}, SORTABLE_DEFAULT_CONFIG);
    if (typeof config === 'object') {
      this.setConfig(config);
    }
    this.elementManager = new ElementManager(this);
    this.eventManager = new EventManager(this);
    this.dummy = new Dummy(this);
    this.activeItem = new ActiveItem(this);
    this.transition = new SortableTransition(this);
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
      this.activeItem.create(this.targetItem);
      this.activeIdentifier = identifier.toString();

      this.config.activateItem(this.activeItem.element as HTMLElement, this);
      this.activeItem.setInitialPointToItemOffset(
        PointHelper.newPoint(downData.clientX, downData.clientY)
      );
      this.config.afterActivate(this);
    }
  }

  public move({ clientX: x, clientY: y }) {
    const group = this.activeItem.activeGroup;
    if (
      this.isActive === true
      && DOMUtil.isHTMLElement(this.activeItem.element)
      && group !== false
    ) {
      this.prepareMove();
      this.activeItem.move({ x, y });
      this.prepareAndInsertDummy();
    }
  }

  public prepareMove() {
    const group = this.activeItem.activeGroup;
    if (
      this.hasMoved === false
      && group !== false
    ) {
      this.dummy.create();
      this.dummy.prepare();

      group.insertBefore(
        this.dummy.element as HTMLElement,
        this.activeItem.element as HTMLElement
      );

      this.config.popItem(
        this.activeItem.element as HTMLElement,
        this,
      );

      this.hasMoved = true;
    }
  }

  public prepareAndInsertDummy() {
    const group = this.activeItem.currentGroup;
    if (
      typeof group !== 'undefined'
      && this.itemElements !== false
      && this.dummy.isActive == true
      && this.activeItem.isActive == true
    ) {

      if (this.elementManager.groupHasItem(group) === true) {
        const corners = DOMPoint.getElementCornerPoints(this.activeItem.element as HTMLElement);
        const closestChild = DOMPoint.getClosestChildFromPoints(
          group,
          corners,
          item => {
            return (
              item !== this.activeItem.element
              && (this.itemElements as HTMLElement[]).indexOf(item) !== -1
            );
          },
        );

        // We need to defer inserting element until deactivation.
        if (typeof closestChild === 'object') {
          let target
          const topPoints = DOMPoint.getElementTopPoints(this.activeItem.element as HTMLElement);
          if (
            closestChild !== (this.dummy.element as HTMLElement).nextElementSibling
            && DOMPoint.elementCenterIsAbovePoints(closestChild, topPoints) === true
          ) {
            target = closestChild;
          }
          const bottomPoints = DOMPoint.getElementBottomPoints(this.activeItem.element as HTMLElement);
          if (
            closestChild.nextElementSibling !== this.dummy.element
            && DOMPoint.elementCenterIsBelowPoints(closestChild, bottomPoints) === true
          ) {
            target = closestChild.nextElementSibling;
          }
          if (typeof target !== 'undefined') {
            this.transition.go(group, target, () => {
              if (this.dummy.isActive === true) {
                group.insertBefore(
                  this.dummy.element as HTMLElement,
                  target,
                );
              }
            });
          }
        }
      } else {
        // Add to the end
        group.appendChild(this.dummy.element as HTMLElement);
      }
    }
  }

  public deactivate() {
    if (
      this.isActive === true
      && typeof this.activeItem === 'object'
    ) {
      this.transition.cleanup();
      this.transition.destroy();

      this.config.beforeDeactivate(this);
      this.config.deactivateItem(this.activeItem.element as HTMLElement, this);
      this.config.unpopItem(this.activeItem.element as HTMLElement, this);

      this.dummy.replaceWithActiveItem();
      this.dummy.destroy();

      this.isActive = false;
      this.hasMoved = false;

      this.activeItem.destroy();
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
      const bottomPoint = DOMPoint.getElementBottomPoints(this.activeItem.element as HTMLElement)[0].y;
      const topPoint = DOMPoint.getElementTopPoints(this.activeItem.element as HTMLElement)[0].y;
      if (bottomPoint >= ViewportModel.height) {
        window.scrollBy(0, 1);
      } else if (topPoint <= 0) {
        window.scrollBy(0, -1);
      }
      this.prepareAndInsertDummy();
    }
  }
}
