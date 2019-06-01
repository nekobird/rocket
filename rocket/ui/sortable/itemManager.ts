import {
  Sortable,
} from './sortable';

export class ItemManager {
  public sortable: Sortable;

  public group?: HTMLElement;
  public items?: HTMLElement[];

  constructor(sortable: Sortable) {
    this.sortable = sortable;
  }

  public initialize() {
    this.getGroup();
    this.getItems();
    this.prepareItems();
  }

  public getGroup(): this {
    const { config } = this.sortable;
    if (
      typeof config.group === 'undefined'
      && typeof config.groupSelector === 'string'
    ) {
      const group = document.querySelector(config.groupSelector);
      if (group !== null) {
        this.group = <HTMLElement>group;
        return this;
      }
      throw new Error('Sortable: Fail to get group.');
    }

    if (typeof config.group === 'object') {
      this.group = config.group;
      return this;
    }
    throw new Error('Sortable: Group is not defined.');
  }

  public getItems(): this {
    const { config } = this.sortable;
    if (
      typeof config.items === 'undefined'
      && typeof config.itemsSelector === 'string'
    ) {
      const items = document.querySelectorAll(config.itemsSelector);
      if (items !== null) {
        this.items = <HTMLElement[]>Array.from(items);
        return this;
      }
    }

    if (Array.isArray(config.items) === true) {
      this.items = [...(<HTMLElement[]>config.items)];
      return this;
    }

    if (typeof this.group === 'object') {
      this.items = <HTMLElement[]>Array.from(this.group.children).filter(
        child => config.childIsItem(<HTMLElement>child)
      );
    }
    throw new Error('Sortable: Items not defined.');
  }

  public prepareItems(): this {
    if (
      typeof this.items === 'object'
      && Array.isArray(this.items) === true
    ) {
      const { config } = this.sortable;
      this.items.forEach(item => {
        config.prepareItems(item);
      });
    }
    return this;
  }
}
