import {
  DOMRect,
  DOMUtil,
} from '../../rocket';

import {
  Sortable,
} from './sortable';

export class ElementManager {
  public sortable: Sortable;

  public groups?: HTMLElement[];
  public items?: HTMLElement[];

  public isReady: boolean = false;

  constructor(sortable: Sortable) {
    this.sortable = sortable;
  }

  public initialize() {
    this.updateGroups();
    this.updateItems();
  }

  public updateGroups(): this {
    const { config } = this.sortable;
    // Get groups from selector.
    if (
      typeof config.groups === 'undefined'
      && typeof config.groupsSelector === 'string'
    ) {
      const groups = document.querySelectorAll(config.groupsSelector);
      if (groups !== null) {
        this.groups = Array.from(groups) as HTMLElement[];
        this.isReady = true;
        return this;
      }
      throw new Error('Sortable: Fail to get groups.');
    }

    // Get groups from NodeList or HTMLCollection.
    if (
      typeof config.groups === 'object'
      && (
        config.groups instanceof NodeList === true
        || config.groups instanceof HTMLCollection === true
      )
    ) {
      this.groups = Array.from(config.groups) as HTMLElement[];
      this.isReady = true;
      return this;
    }

    // Get groups from HTMLElement[].
    if (Array.isArray(config.groups) === true) {
      // Make an array copy.
      this.groups = [...config.groups as HTMLElement[]];
      this.isReady = true;
      return this;
    }

    throw new Error('Sortable: Groups are not defined.');
  }

  public updateItems(): this {
    const { config } = this.sortable;
    if (
      typeof this.groups === 'object'
      && Array.isArray(this.groups) === true
    ) {
      this.items = [];
      this.groups.forEach(group => {
        (this.items as HTMLElement[]).concat(
          Array.from(group.children).filter(
            child => config.childIsItem(child as HTMLElement)
          ) as HTMLElement[]
        );
      });
    }
    return this;
  }

  public getGroupFromItem(item: HTMLElement): HTMLElement | false {
    if (
      typeof this.groups === 'object'
      && Array.isArray(this.groups) === true
    ) {
      for (let i = 0; i < this.groups.length; i++) {
        if (this.groups[i] === item.parentElement) {
          return this.groups[i];
        }
      }
    }
    return false;
  }

  public getGroupFromActiveItem(): HTMLElement | false {
    const { isActive, activeItem } = this.sortable;
    if (
      isActive === true
      && DOMUtil.isHTMLElement(activeItem) === true
      && typeof this.groups === 'object'
      && Array.isArray(this.groups) === true
    ) {
      const areas: number[] = [];
      this.groups.forEach(group => {
        areas.push(
          DOMRect.getOverlappingAreaFromElements(activeItem as HTMLElement, group)
        );
      });
      const index = areas.indexOf(Math.max(...areas))
      if (DOMUtil.isHTMLElement(this.groups[index]) == true) {
        return this.groups[index];
      }
    }
    return false;
  }
}
