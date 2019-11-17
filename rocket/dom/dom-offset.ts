import {
  DOMScroll,
  FullOffset,
  Num,
} from '@/rocket';

export class DOMOffset {
  public static getElementOffsetFromAnotherElement(from: HTMLElement, to: HTMLElement): FullOffset {
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();

    const top = Num.getEuclideanDistance(fromRect.top, toRect.top);
    const bottom = Num.getEuclideanDistance(fromRect.bottom, toRect.bottom);

    const left = Num.getEuclideanDistance(fromRect.left, toRect.left);
    const right = Num.getEuclideanDistance(fromRect.right, toRect.right);

    return { top, bottom, left, right };
  }

  public static getElementOffsetFromDocument(element: HTMLElement): FullOffset {
    const rect = element.getBoundingClientRect();

    const { scrollLeft, scrollTop } = DOMScroll;

    const top = rect.top + scrollTop;
    const bottom = rect.bottom + scrollTop;

    const left = rect.left + scrollLeft;
    const right = rect.right + scrollLeft;

    return { top, bottom, left, right };
  }

  public static getElementOffsetFromView(element: HTMLElement): FullOffset {
    const { top, bottom, left, right } = element.getBoundingClientRect();

    return { top, bottom, left, right };
  }
}
