import {
  SortableList,
} from './sortableList';

export class ElementManager {
  public sortable: SortableList;

  public groups?: HTMLElement[];
  public items?: HTMLElement[];

  public isReady: boolean = false;

  constructor(sortable: SortableList) {
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
      throw new Error('SortableList: Fail to get groups.');
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

    throw new Error('SortableList: Groups are not defined.');
  }

  public updateItems(): this {
    const { config } = this.sortable;
    if (
      typeof this.groups === 'object'
      && Array.isArray(this.groups) === true
    ) {
      this.items = [];
      this.groups.forEach(group => {
        const children = Array.from(group.children).filter(
          child => config.childIsItem(child as HTMLElement)
        ) as HTMLElement[];
        this.items = (this.items as HTMLElement[]).concat(children);
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

  public getItemsFromGroup(group: HTMLElement): HTMLElement[] {
    const { config, activeItem } = this.sortable;
    return Array.from(group.children).filter(child => {
      if (
        config.childIsItem(child as HTMLElement)
        && child !== activeItem.element
      ) {
        return true;
      }
      return false;
    }) as HTMLElement[];
  }

  public groupHasItem(group: HTMLElement): boolean {
    return this.getItemsFromGroup(group).length > 0;
  }
}
