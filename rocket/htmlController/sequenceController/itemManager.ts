import {
  SequenceController,
} from './sequenceController';

export class ItemManager {
  private controller: SequenceController;

  public items: HTMLElement[];

  public activeItem?: HTMLElement;
  public activeIndex?: number;

  public isActive: boolean = false;

  constructor(controller: SequenceController) {
    this.controller = controller;
    this.items = [];
  }

  public initialize(): this {
    this.loadItemsFromConfig();
    this.filterItems();
    this.filterActiveItems();
    return this
  }

  public loadItemsFromConfig(): this {
    const { config } = this.controller;
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
    throw new Error('SequenceController: Items not defined.');
  }

  public filterItems(): this {
    this.items = this.items.filter(item => this.itemIsValid(item));
    return this;
  }

  private filterActiveItems(): this {
    const { config } = this.controller;
    if (this.items.length > 0) {
      this.items.forEach((item, index) => {
        if (config.itemIsActive(item, this.controller) === true) {
          if (this.isActive === false) {
            this.activeIndex = index;
            this.activeItem = item;
            this.isActive = true;
          } else {
            config.deactivateItem(item, this.controller);
          }
        }
      });
      this.controller.isReady = true;
    }
    return this;
  }

  public itemIsValid(item: HTMLElement): boolean {
    const { config } = this.controller;
    let valid: boolean = true;
    if (typeof config.getItemId(item) !== 'string')
      valid = false;
    return valid;
  }

  public getItemFromId(id: string): HTMLElement | false {
    const { config } = this.controller;
    let matchedItems: HTMLElement[] = [];
    this.items.forEach(item => {
      if (config.getItemId(item) === id)
        matchedItems.push(item);
    });
    if (matchedItems.length > 0)
      return matchedItems[0];
    return false;
  }
}
