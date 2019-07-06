import {
  DOMRect,
  ViewportModel,
} from '../rocket';

export interface DOMScrollTo {
  left: number;
  top: number;
}

export class DOMScroll {

  public static get scrollLeft(): number {
    return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || window.scrollX || 0;
  }

  public static get scrollTop(): number {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || window.scrollY || 0;
  }

  public static getScrollLeftToElements(elements: HTMLElement | HTMLElement[]): number {
    let rect, left = 0;

    if (Array.isArray(elements) === true) {
      rect = DOMRect.getRectFromElements(elements);
    } else {
      rect = (elements as HTMLElement).getBoundingClientRect();
    }

    if (rect !== false) left = rect.left;

    return left + this.scrollLeft;
  }

  public static getScrollTopToElements(elements: HTMLElement | HTMLElement[]): number {
    let rect, top = 0;

    if (Array.isArray(elements) === true) {
      rect = DOMRect.getRectFromElements(elements);
    } else {
      rect = (elements as HTMLElement).getBoundingClientRect();
    }

    if (rect !== false) top = rect.top;

    return top + this.scrollTop;
  }

  public static getScrollLeftToElementsCenterFrame(elements: HTMLElement | HTMLElement[]): number {
    let rect, left = 0, width = 0;

    if (Array.isArray(elements) === true) {
      rect = DOMRect.getRectFromElements(elements);
    } else {
      rect = (elements as HTMLElement).getBoundingClientRect();
    }

    if (rect !== false) {
      left = rect.left;
      width = rect.width;
    }

    return left - ((ViewportModel.width - width) / 2) + this.scrollLeft;
  }

  public static getScrollTopToElementsCenterFrame(elements: HTMLElement | HTMLElement[]): number {
    let rect, top = 0, height = 0;

    if (Array.isArray(elements) === true) {
      rect = DOMRect.getRectFromElements(elements);
    } else {
      rect = (elements as HTMLElement).getBoundingClientRect();
    }

    if (rect !== false) {
      top = rect.top;
      height = rect.height;
    }

    return top - ((ViewportModel.height - height) / 2) + this.scrollTop;
  }

  public static getScrollToElementsCenterFrame(elements: HTMLElement): DOMScrollTo {
    return {
      left: this.getScrollLeftToElementsCenterFrame(elements),
      top: this.getScrollTopToElementsCenterFrame(elements),
    };
  }
}
