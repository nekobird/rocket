import {
  DOMUtil
} from '../../rocket';

import {
  Sortable
} from './sortable';

export class Dummy {
  public sortable: Sortable;

  public element?: HTMLElement;
  public isActive: boolean = false;

  constructor(sortable: Sortable) {
    this.sortable = sortable;
  }

  public create() {
    const { isActive, activeItem, config } = this.sortable;
    if (
      this.isActive === false
      && isActive === true
      && DOMUtil.isHTMLElement(activeItem.element) === true
    ) {
      if (typeof this.element === 'undefined') {
        this.element = config.createDummyFromItem(
          activeItem.element as HTMLElement,
          this.sortable,
        );
        this.isActive = true;
      }
    }
  }

  public prepare() {
    const { isActive, activeItem, config } = this.sortable;
    if (
      this.isActive === true
      && isActive === true
      && DOMUtil.isHTMLElement(activeItem.element) === true
      && DOMUtil.isHTMLElement(this.element) === true
    ) {
      config.setDummyElementPropertiesFromItem(
        this.element as HTMLElement,
        activeItem.element as HTMLElement,
        this.sortable,
      );
    }
  }

  public replaceWithActiveItem() {
    const { isActive, activeItem } = this.sortable;
    if (
      this.isActive === true
      && isActive === true
      && DOMUtil.isHTMLElement(activeItem.element) === true
      && DOMUtil.isHTMLElement(this.element) === true
    ) {
      const parent = (this.element as HTMLElement).parentElement;
      if (parent !== null) {
        parent.replaceChild(
          activeItem.element as HTMLElement,
          this.element as HTMLElement,
        );
      }
    }
  }

  public destroy() {
    if (
      this.isActive === true
      && DOMUtil.isHTMLElement(this.element)
    ) {
      
      const parent = (this.element as HTMLElement).parentElement;
      if (parent !== null) {
        parent.removeChild(this.element as HTMLElement);
      }
      if (DOMUtil.isHTMLElement(this.element) === true) {
        (this.element as HTMLElement).remove();
      }
      this.element = undefined;
      this.isActive = false;
    }
  }
}
