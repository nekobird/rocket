import {
  Num,
  Point,
  Rectangle,
} from '@/rocket';

export class DOMRectangle {
  public static getMinimumBoundingRectangleFromElements(...elements: HTMLElement[]): Rectangle | null {
    if (elements.length === 0) {
      return null;
    }

    const result = {
      top: 0,
      bottom: 0,

      left: 0,
      right: 0,

      width: 0,
      height: 0,

      center: Point.zero(),
    };

    for (let i = 0; i < elements.length; i++) {
      const { top, bottom, left, right } = elements[i].getBoundingClientRect();

      if (i === 0) {
        result.top = top;
        result.bottom = bottom;
        result.left = left;
        result.right = right;
      } else {
        if (top < result.top) {
          result.top = top;
        }

        if (bottom > result.bottom) {
          result.bottom = bottom;
        }

        if (left < result.left) {
          result.left = left;
        }

        if (right > result.right) {
          result.right = right;
        }
      }
    }

    result.width = Num.getEuclideanDistance(result.left, result.right);
    result.height = Num.getEuclideanDistance(result.top, result.bottom);

    result.center = new Point(result.left + result.width / 2, result.top + result.height / 2);

    return result;
  }

  public static twoElementRectanglesAreOverlapping(
    element1: HTMLElement,
    element2: HTMLElement,
  ): boolean {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    if (
      rect1.left > rect2.right
      || rect2.left > rect1.right
      || rect1.top > rect2.bottom
      || rect2.top > rect1.bottom
    ) {
      return false;
    }

    return true;
  }

  public static getTwoElementRectanglesOverlappingArea(
    element1: HTMLElement,
    element2: HTMLElement,
  ): number {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    if (this.twoElementRectanglesAreOverlapping(element1, element2) === true) {
      const top = Math.max(rect1.top, rect2.top);
      const bottom = Math.min(rect1.bottom, rect2.bottom);

      const left = Math.max(rect1.left, rect2.left);
      const right = Math.min(rect1.right, rect2.right);

      const width = Num.getEuclideanDistance(left, right);
      const height = Num.getEuclideanDistance(top, bottom);

      return width * height;
    }

    return 0;
  }
}
