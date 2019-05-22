import {
  ViewportModel,
} from '../rocket';

export interface ScrollTo {
  left: number;
  top: number;
}

export class DOMScroll {
  public static getScrollLeftToElement(element: HTMLElement): number {
    const rect = element.getBoundingClientRect();
    return window.scrollX + rect.left;
  }

  public static getScrollTopToElement(element: HTMLElement): number {
    const rect = element.getBoundingClientRect();
    return window.scrollY + rect.top;
  }

  public static getScrollLeftToElementCenterFrame(element: HTMLElement): number {
    const left = this.getScrollLeftToElement(element);
    return left - ((ViewportModel.width - element.offsetWidth) / 2);
  }

  public static getScrollTopToElementCenterFrame(element: HTMLElement): number {
    const top = this.getScrollTopToElement(element);
    return top - ((ViewportModel.height - element.offsetHeight) / 2);
  }

  public static getScrollToElementCenterFrame(element: HTMLElement): ScrollTo {
    return {
      left: this.getScrollLeftToElementCenterFrame(element),
      top: this.getScrollTopToElementCenterFrame(element),
    };
  }
}
