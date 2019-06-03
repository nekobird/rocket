import {
  DOMUtil,
  DOMStyle,
  DOMTraverse,
} from '../../rocket';

import {
  Sortable,
} from './sortable';

export interface ItemModel {
  item: HTMLElement;

  left: number;
  right: number;
  top: number;
  bottom: number;

  offsetLeft: number;
  offsetTop: number;

  width: number;
  height: number;
}

export class SortModel {
  public sortable: Sortable;

  public items?: ItemModel[];

  public activeItem?: HTMLElement;
  public dummyItem?: HTMLElement;

  public isActive: boolean = false;

  public isMoving: boolean = false;
  public moveTarget;

  constructor(sortable: Sortable) {
    this.sortable = sortable;
  }

  // 1) Create model and populate it's data.
  public activate() {
    const { itemManager, isActive, dummy, activeItem } = this.sortable;
    if (
      isActive === true
      && typeof itemManager.items !== 'undefined'
      && Array.isArray(itemManager.items) === true
      && DOMUtil.isHTMLElement(activeItem)
      && DOMUtil.isHTMLElement(dummy)
    ) {
      this.dummyItem = dummy;
      this.activeItem = activeItem;

      this.items = [];
      itemManager.items.forEach(item => {
        if (item !== activeItem) {
          (this.items as ItemModel[]).push(
            this.createModelFromItem(item)
          );
        }
      });
      this.items.sort((a, b) => a.top - b.top);
    }
  }

  public createModelFromItem(element: HTMLElement) {
    const { top, bottom, left, right } = element.getBoundingClientRect();
    return {
      item: element,

      top, bottom, left, right,

      offsetLeft: element.offsetLeft,
      offsetTop: element.offsetTop,

      width: element.offsetWidth,
      height: element.offsetHeight,
    };
  }

  // 2) moveItem
  public handleMove() {
    if (this.isMoving === false) {
      this.isMoving = true;
    } // Fix this.
    const beforeIndex = this.getClosestItemIndex();
    const newOrder = this.getNewOrder(beforeIndex);
    this.prepare();
    this.move(this.dummyItem, newOrder.newDummyLocation.x, newOrder.newDummyLocation.y);
    newOrder.newItemsLocations.forEach(location => {
      // @ts-ignore
      this.move(location, location.x, location.y);
    });
    this.updateModel(newOrder.newItemsLocations);
    this.bake();
  }

  public updateModel(newItemsLocations) {
    this.items = [];
    newItemsLocations.forEach(item => {
      // @ts-ignore
      this.items.push(
        this.createModelFromItem(item.item)
      );
    });
    this.items.sort((a, b) => a.top - b.top);
  }

  public bake() {
    const { group } = this.sortable.itemManager;
    // @ts-ignore
    this.items.forEach(item => {
      // @ts-ignore
      group.removeChild(item.item);
    });
    // @ts-ignore
    this.items.forEach(item => {
      // @ts-ignore
      group.appendChild(item.item);
    });
  }

  public move(element, left, top) {
    element.style.transitionDuration = '120ms';
    element.style.transitionTimingFunction = 'ease-out';
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
  }

  public getNewOrder(beforeIndex) {
    // MoveTo
    // { left, top, item, index }
    let newItemsLocations = [];
    let newDummyLocation;
    // @ts-ignore
    let left = this.items[0].offsetLeft;
    // @ts-ignore
    let top = this.items[0].offsetTop;
    // @ts-ignore
    this.items.forEach((item, index) => {
      if (beforeIndex + 1 === index) {
        newDummyLocation = { left, top };
        // @ts-ignore
        top += DOMStyle.getTotalVerticalDimension(this.dummyItem);
      }
      top += DOMStyle.getTotalVerticalDimension(item.item);
      // @ts-ignore
      newItemsLocations.push({ item, left, top, index });
    });
    return {
      newItemsLocations,
      newDummyLocation,
    };
  }

  public prepare() {
    const { itemManager } = this.sortable;
    // Prepare Group.
    // @ts-ignore
    itemManager.group.style.position = 'relative';
    // Prepare Items.
    // @ts-ignore
    this.items.forEach(item => {
      item.item.style.left = `${item.offsetLeft}px`;
      item.item.style.top = `${item.offsetTop}px`;
      item.item.style.position = 'absolute';
    });
    // @ts-ignore
    this.dummyItem.style.left = `${this.dummyItem.offsetLeft}px`;
    // @ts-ignore
    this.dummyItem.style.top = `${this.dummyItem.offsetTop}px`;
    // @ts-ignore
    this.dummyItem.style.position = 'absolute';
  }

  public deactivate() {
    this.items = undefined;
    this.activeItem = undefined;
    this.dummyItem = undefined;
    this.isActive = false;
  }

  // Before
  public getClosestItemIndex() {
    // @ts-ignore
    const activeItemBottom = this.activeItem.getBoundingClientRect().bottom;
    let beforeIndex = -1;
    // @ts-ignore
    for (let i = 0; i < this.items.length; i++) {
      // @ts-ignore
      const currentItem = this.items[i];
      const currentItemMidLine = currentItem.top + currentItem.item.offsetHeight / 2;
      if (activeItemBottom >= currentItemMidLine) {
        beforeIndex = i;
        break;
      }
    }
    return beforeIndex;
  }
}