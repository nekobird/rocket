import {
  Num,
} from '../rocket';

export interface Offset {
  top: number;
  bottom: number;
  left: number;
  right: number;
  x: number;
  y: number;
}

export class DOMOffset {

  public static getElementOffsetFrom(target: HTMLElement, from: HTMLElement): Offset {
    const targetRect = target.getBoundingClientRect();
    const fromRect   = from.getBoundingClientRect();

    const top    = Num.getNumberLineDistance(targetRect.top,    fromRect.top);
    const bottom = Num.getNumberLineDistance(targetRect.bottom, fromRect.bottom);
    const left   = Num.getNumberLineDistance(targetRect.left,  fromRect.left);
    const right  = Num.getNumberLineDistance(targetRect.right, fromRect.right);

    return {
      top, bottom,
      left, right,
      x: left,
      y: top,
    };
  }

  // Get element offset relative to the document.
  public static getElementOffsetFromDocument(element: HTMLElement): Offset {
    const rect = element.getBoundingClientRect();

    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop  = window.pageYOffset || document.documentElement.scrollTop;

    const left = rect.left + scrollLeft;
    const top  = rect.top + scrollTop;

    return {
      left, top,
      right: rect.right + scrollLeft,
      bottom: rect.bottom + scrollTop,
      x: left,
      y: top,
    };
  }
}