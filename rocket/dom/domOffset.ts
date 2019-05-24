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
    const targetRect: DOMRect | ClientRect = target.getBoundingClientRect();
    const fromRect: DOMRect | ClientRect = from.getBoundingClientRect();

    const left: number = Num.getNumberLineDistance(targetRect.left, fromRect.left);
    const top: number = Num.getNumberLineDistance(targetRect.top , fromRect.top);

    return {
      left, top,
      right: Num.getNumberLineDistance(targetRect.right, fromRect.right),
      bottom: Num.getNumberLineDistance(targetRect.bottom, fromRect.bottom),
      x: left,
      y: top,
    };
  }

  // Get element offset relative to the document.
  public static getElementOffsetFromDocument(element: HTMLElement): Offset {
    const rect = element.getBoundingClientRect();

    const scrollLeft: number = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop: number = window.pageYOffset || document.documentElement.scrollTop;

    const left: number = rect.left + scrollLeft;
    const top: number = rect.top + scrollTop;

    return {
      left, top,
      right: rect.right + scrollLeft,
      bottom: rect.bottom + scrollTop,
      x: left,
      y: top,
    };
  }
}