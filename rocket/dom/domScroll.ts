import {
  DOMRect,
  ViewportModel,
} from '../rocket';

export interface ScrollTo {
  left: number;
  top: number;
}

export class DOMScroll {

  public static getScrollLeftToElements(elements: HTMLElement | HTMLElement[]): number {
    let left: number = 0;
    if (Array.isArray(elements) === true) {
      const rect = DOMRect.getRectFromElements(elements);
      if (rect !== false) {
        left = rect.left
      }
    } else {
      left = (<HTMLElement>elements).getBoundingClientRect().left;
    }
    return window.scrollX + left;
  }

  public static getScrollTopToElements(elements: HTMLElement | HTMLElement[]): number {
    let top: number = 0;
    if (Array.isArray(elements) === true) {
      const rect = DOMRect.getRectFromElements(elements);
      if (rect !== false) {
        top = rect.top
      }
    } else {
      top = (<HTMLElement>elements).getBoundingClientRect().top;
    }
    return window.scrollX + top;
  }

  public static getScrollLeftToElementsCenterFrame(elements: HTMLElement | HTMLElement[]): number {
    let left: number = 0;
    let width: number = 0;
    if (Array.isArray(elements) === true) {
      const rect = DOMRect.getRectFromElements(elements);
      if (rect !== false) {
        left = rect.left
        width = (<HTMLElement>elements).offsetWidth
      }
    } else {
      let rect = (<HTMLElement>elements).getBoundingClientRect();
      left = rect.left;
      width = rect.width;
    }
    return left - ((ViewportModel.width - width) / 2);
  }

  public static getScrollTopToElementsCenterFrame(elements: HTMLElement | HTMLElement[]): number {
    let top: number = 0;
    let height: number = 0;
    if (Array.isArray(elements) === true) {
      const rect = DOMRect.getRectFromElements(elements);
      if (rect !== false) {
        top = rect.top
        height = (<HTMLElement>elements).offsetHeight
      }
    } else {
      let rect = (<HTMLElement>elements).getBoundingClientRect();
      top = rect.top;
      height = rect.height;
    }
    return top - ((ViewportModel.height - height) / 2);
  }

  public static getScrollToElementsCenterFrame(elements: HTMLElement): ScrollTo {
    return {
      left: this.getScrollLeftToElementsCenterFrame(elements),
      top: this.getScrollTopToElementsCenterFrame(elements),
    };
  }
}
