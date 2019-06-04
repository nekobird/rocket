import {
  DOMUtil
} from '../../rocket';

import {
  Sortable
} from './sortable';

export class DummyManager {
  public sortable: Sortable;

  public element?: HTMLElement;

  constructor(sortable: Sortable) {
    this.sortable = sortable;
  }

  public prepare() {
    const { isActive, activeItem, config } = this.sortable;
    if (
      isActive === true
      && DOMUtil.isHTMLElement(activeItem) === true
    ) {
      if (typeof this.element === 'undefined') {
        this.element = config.createDummyFromItem(activeItem, this.sortable);
      }
      config.setDummyElementPropertiesFromItem(this.element, activeItem, this.sortable);
    }
  }
}
