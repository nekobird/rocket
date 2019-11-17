import {
  DOMRectangle,
  Offset,
  Viewport,
} from '@/rocket';

export class DOMScroll {
  public static get scrollLeft(): number {
    if (typeof window.pageXOffset === 'number') {
      return window.pageXOffset;
    }

    return document.documentElement.scrollLeft
      || document.body.scrollLeft
      || window.scrollX
      || 0;
  }

  public static get scrollTop(): number {
    if (typeof window.pageYOffset === 'number') {
      return window.pageYOffset;
    }

    return document.documentElement.scrollTop
      || document.body.scrollTop
      || window.scrollY
      || 0;
  }

  public static getScrollLeftToElement(...elements: HTMLElement[]): number {
    let rect;

    let left = 0;

    if (elements.length > 1) {
      rect = DOMRectangle.getMinimumBoundingRectangleFromElements(...elements);
    } else {
      rect = elements[0].getBoundingClientRect();
    }

    if (rect !== false) {
      left = rect.left;
    }

    return left + this.scrollLeft;
  }

  public static getScrollTopToElement(...elements: HTMLElement[]): number {
    let rect;

    let top = 0;

    if (elements.length > 1) {
      rect = DOMRectangle.getMinimumBoundingRectangleFromElements(...elements);
    } else {
      rect = elements[0].getBoundingClientRect();
    }

    if (rect !== false) {
      top = rect.top;
    }

    return top + this.scrollTop;
  }

  public static getScrollLeftToElementsCenterFrame(...elements: HTMLElement[]): number {
    let rect;

    let left = 0;

    let width = 0;

    if (elements.length > 1) {
      rect = DOMRectangle.getMinimumBoundingRectangleFromElements(...elements);
    } else {
      rect = elements[0].getBoundingClientRect();
    }

    if (rect !== false) {
      left = rect.left;

      width = rect.width;
    }

    return left - (Viewport.width - width) / 2 + this.scrollLeft;
  }

  public static getScrollTopToElementsCenterFrame(...elements: HTMLElement[]): number {
    let rect;

    let top = 0;

    let height = 0;

    if (elements.length > 1) {
      rect = DOMRectangle.getMinimumBoundingRectangleFromElements(...elements);
    } else {
      rect = elements[0].getBoundingClientRect();
    }

    if (rect !== false) {
      top = rect.top;

      height = rect.height;
    }

    return top - (Viewport.height - height) / 2 + this.scrollTop;
  }

  public static getScrollToElementsCenterFrame(...elements: HTMLElement[]): Offset {
    return {
      left: this.getScrollLeftToElementsCenterFrame(...elements),
      top: this.getScrollTopToElementsCenterFrame(...elements),
    };
  }
}
