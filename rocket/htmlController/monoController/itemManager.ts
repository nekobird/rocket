import {
  MonoController,
} from './monoController';

export class ItemManager {

  private controller: MonoController;

  public items: HTMLElement[];

  public activeItem?: HTMLElement;
  public activeItemId?: string;

  public isActive: boolean = false;

  constructor(controller: MonoController) {
    this.controller = controller;

    this.items = [];
  }

  // Initialize

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

    throw new Error('MonoController: Items not defined.');
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

  public filterActiveItems(): this {
    const { config } = this.controller;

    if (this.items.length > 0) {
      this.items.forEach(item => {
        if (item.classList.contains(config.classNameItemActive) === true) {
          if (this.isActive === true) {
            item.classList.remove(config.classNameItemActive);
          } else {
            this.activeItem = item;
            this.activeItemId = item.dataset.id;
            this.isActive = true;
          }
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
    const matchedItems: HTMLElement[] = [];

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

  public activate(item: HTMLElement) {
    if (this.itemIsValid(item) === true) {
      item.classList.add(
        this.controller.config.classNameItemActive
      );
      this.activeItem = item;
      this.activeItemId = item.dataset.id;
      this.isActive = true;
    }
  }

  public deactivate() {
    if (typeof this.activeItem !== 'undefined') {
      this.activeItem.classList.remove(
        this.controller.config.classNameItemActive
      );
      this.activeItem = undefined;
      this.activeItemId = undefined;
      this.isActive = false;
    }
  }
}