import {
  DOMScroll,
  FullOffset,
  Num,
} from '../rocket';

export class DOMOffset {
  // Assumes from top-left.
  public static getElementOffsetFrom(target: HTMLElement, from: HTMLElement): FullOffset {
    const targetRect = target.getBoundingClientRect();
    const fromRect = from.getBoundingClientRect();

    const top = Num.getEuclideanDistance(targetRect.top, fromRect.top);
    const bottom = Num.getEuclideanDistance(targetRect.bottom, fromRect.bottom);

    const left = Num.getEuclideanDistance(targetRect.left, fromRect.left);
    const right = Num.getEuclideanDistance(targetRect.right, fromRect.right);

    return { top, bottom, left, right };
  }

  // Get element offset top-left relative to document top-left.
  public static getElementOffsetFromDocument(element: HTMLElement): FullOffset {
    const rect = element.getBoundingClientRect();

    const { scrollLeft, scrollTop } = DOMScroll;

    const top = rect.top + scrollTop;
    const bottom = rect.bottom + scrollTop;

    const left = rect.left + scrollLeft;
    const right = rect.right + scrollLeft;

    return { top, bottom, left, right };
  }
}
