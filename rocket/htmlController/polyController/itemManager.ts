import {
  PolyController,
} from './polyController';

export class ItemManager {

  private controller: PolyController;

  public items: HTMLElement[];
  public activeItems: HTMLElement[];

  public isActive: boolean = false;

  constructor(controller: PolyController) {
    this.controller = controller;

    this.items = [];
    this.activeItems = [];
  }

  public initialize(): this {
    this.loadItemsFromConfig();
    this.filterItems();
    this.filterActiveItems();
    return this;
  }

  public loadItemsFromConfig(): this {
    const { config } = this.controller;

    if (
      typeof config.itemsSelector === 'string'
      && typeof config.items === 'undefined'
    ) {
      const items: NodeListOf<HTMLElement> = document.querySelectorAll(config.itemsSelector);
      if (items !== null) {
        this.items = Array.from(items);
        return this;
      }
    }
      
    if (
      Array.isArray(config.items) === false
      && NodeList.prototype.isPrototypeOf(<NodeListOf<HTMLElement>>config.items)
    ) {
      this.items = Array.from(<NodeListOf<HTMLElement>>config.items);
      return this;
    }
    
    if (Array.isArray(config.items) === true) {
      this.items = <HTMLElement[]>config.items;
      return this;
    }

    throw new Error('PolyController: Items not defined.');
  }

  public setItems(items: HTMLElement[] | NodeListOf<HTMLElement> | string): this {
    if (typeof items === 'string') {
      const results: NodeListOf<HTMLElement> = document.querySelectorAll(items);
      if (results !== null) {
        this.items = Array.from(results);
      }
      return this;
    }

    if (NodeList.prototype.isPrototypeOf(items)) {
      this.items = Array.from(<NodeListOf<HTMLElement>>items);
      return this;
    }

    if (Array.isArray(items) === true) {
      this.items = <HTMLElement[]>items;
    }
    return this;
  }

  public filterItems(): this {
    this.items = this.items.filter(item => this.itemIsValid(item));
    return this;
  }

  private filterActiveItems(): this {
    const { config } = this.controller;

    if (this.items.length > 0) {
      this.items.forEach(item => {
        if (item.classList.contains(config.classNameItemActive)) {
          this.activeItems.push(item);
          this.isActive = true;
        }
      });
      this.controller.isReady = true;
    }
    return this;
  }

  public itemIsValid(item: HTMLElement): boolean {
    let valid: boolean = true;

    if (typeof item.dataset.id !== 'string') {
      valid = false;
    }

    return valid;
  }

  public getItemFromId(id: string): HTMLElement | false {
    let matchedItems: HTMLElement[] = [];

    this.items.forEach(item => {
      if (item.dataset.id === id) {
        matchedItems.push(item);
      }
    });

    if (matchedItems.length > 0) {
      return matchedItems[0];
    }

    return false;
  }

  // @action

  public activate(item: HTMLElement): boolean {
    const { config } = this.controller;

    if (this.activeItems.indexOf(item) === -1) {
      item.classList.add(config.classNameItemActive);
      this.activeItems.push(item);
      this.isActive = true;
      return true;
    }
    return false;
  }

  public deactivate(item: HTMLElement): boolean {
    const { config } = this.controller;

    const index: number = this.activeItems.indexOf(item);

    if (index !== -1) {
      item.classList.remove(config.classNameItemActive);
      this.activeItems.splice(index, 1);
      if (this.activeItems.length === 0) {
        this.isActive = false;
      }
      return true;
    }
    return false;
  }
}