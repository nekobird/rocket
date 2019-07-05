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
    let left = 0;
    if (Array.isArray(elements) === true) {
      const rect = DOMRect.getRectFromElements(elements);
      if (rect !== false) {
        left = rect.left;
      }
    } else {
      left = (elements as HTMLElement).getBoundingClientRect().left;
    }
    return window.scrollX + left;
  }

  public static getScrollTopToElements(elements: HTMLElement | HTMLElement[]): number {
    let top = 0;
    if (Array.isArray(elements) === true) {
      const rect = DOMRect.getRectFromElements(elements);
      if (rect !== false) {
        top = rect.top;
      }
    } else {
      top = (elements as HTMLElement).getBoundingClientRect().top;
    }
    return window.scrollX + top;
  }

  public static getScrollLeftToElementsCenterFrame(elements: HTMLElement | HTMLElement[]): number {
    let left = 0;
    let width = 0;
    if (Array.isArray(elements) === true) {
      const rect = DOMRect.getRectFromElements(elements);
      if (rect !== false) {
        left = rect.left;
        width = (elements as HTMLElement).offsetWidth;
      }
    } else {
      const rect = (elements as HTMLElement).getBoundingClientRect();
      left = rect.left;
      width = rect.width;
    }
    return left - ((ViewportModel.width - width) / 2);
  }

  public static getScrollTopToElementsCenterFrame(elements: HTMLElement | HTMLElement[]): number {
    let top, height;
    top = height = 0;
    if (Array.isArray(elements) === true) {
      const rect = DOMRect.getRectFromElements(elements);
      if (rect !== false) {
        top = rect.top
        height = (elements as HTMLElement).offsetHeight
      }
    } else {
      const rect = (elements as HTMLElement).getBoundingClientRect();
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
