import {
  Num,
  Point,
} from '../rocket';

interface IdentifiyElementFunction {
  (element: HTMLElement): boolean;
}

export class DOMPoint {
  // Point is relative to viewport. (clientX, clientY)
  // Offset is relative to Point.
  public static getElementOffsetFromPoint(
    element: HTMLElement,
    { x, y }: Point,
  ): Point {
    const { left, top } = element.getBoundingClientRect();

    return new Point(
      Num.getEuclideanDistance(left, x),
      Num.getEuclideanDistance(top, y),
    );
  }

  public static getElementCornerPoints(element: HTMLElement): Point[] {
    const { top, bottom, left, right } = element.getBoundingClientRect();

    return [
      new Point(left, top),
      new Point(left, bottom),
      new Point(right, top),
      new Point(right, bottom),
    ];
  }

  public static getElementCenterPoint(element: HTMLElement): Point {
    const { left, top, width, height } = element.getBoundingClientRect();

    return new Point(
      left + width / 2,
      top + height / 2
    );
  }

  public static getElementDiagonalPoints(element: HTMLElement): [Point, Point] {
    const { top, bottom, left, right } = element.getBoundingClientRect();

    return [
      new Point(left, top),
      new Point(right, bottom),
    ];
  }

  public static getElementTopPoints(element: HTMLElement): Point[] {
    const { left, right, top } = element.getBoundingClientRect();

    return [
      new Point(left, top),
      new Point(right, top)
    ];
  }

  public static getElementBottomPoints(element: HTMLElement): Point[] {
    const { left, right, bottom } = element.getBoundingClientRect();

    return [
      new Point(left, bottom),
      new Point(right, bottom)
    ];
  }

  public static getElementLeftPoints(element: HTMLElement): Point[] {
    const { left, top, bottom } = element.getBoundingClientRect();

    return [
      new Point(left, top),
      new Point(left, bottom)
    ];
  }

  public static getElementRightPoints(element: HTMLElement): Point[] {
    const { right, top, bottom } = element.getBoundingClientRect();

    return [
      new Point(right, top),
      new Point(right, bottom)
    ];
  }

  public static isElementAbovePoints(
    element: HTMLElement,
    points: Point | Point[],
    offset: number = 0,
  ) {
    const { bottom } = element.getBoundingClientRect();

    if (Array.isArray(points) === true) {
      let isAbovePoints = true;

      points = points as Point[];

      points.forEach(({ y }) => {
        if (bottom + offset < y === false) {
          isAbovePoints = false;
        }
      });

      return isAbovePoints;
    }

    const point = points as Point;

    return bottom + offset < point.y;
  }

  public static isElementBelowPoints(
    element: HTMLElement,
    points: Point | Point[],
    offset: number = 0,
  ) {
    const { top } = element.getBoundingClientRect();

    if (Array.isArray(points) === true) {
      let isBelowPoints = true;

      (points as Point[]).forEach(({ y }) => {
        if (top + offset > y === false) {
          isBelowPoints = false;
        }
      });

      return isBelowPoints;
    }

    return top + offset > (points as Point).y;
  }

  public static isElementCenterAbovePoints(
    element: HTMLElement,
    points: Point | Point[],
    offset: number = 0,
  ) {
    const centerPoint = this.getElementCenterPoint(element);

    if (Array.isArray(points) === true) {
      let isAbovePoint = true;

      (points as Point[]).forEach(({ y }) => {
        if (centerPoint.y + offset > y === false) {
          isAbovePoint = false;
        }
      });

      return isAbovePoint;
    }

    return centerPoint.y + offset > (points as Point).y;
  }

  public static isElementCenterBelowPoints(
    element: HTMLElement,
    points: Point | Point[],
    offset: number = 0,
  ) {
    const centerPoint = this.getElementCenterPoint(element);

    if (Array.isArray(points) === true) {
      let isBelowPoint = true;

      (points as Point[]).forEach(({ y }) => {
        if (centerPoint.y + offset < y === false) {
          isBelowPoint = false;
        }
      });

      return isBelowPoint;
    }

    return centerPoint.y + offset < (points as Point).y;
  }

  public static getClosestDistanceFromElementCornersToPoint(
    element: HTMLElement,
    point: Point,
  ): number {
    const corners = this.getElementCornerPoints(element);

    const distances = corners.map(corner => {
      return Point.getDistanceTo(corner, point);
    });

    return Math.min(...distances);
  }

  public static getDistanceFromElementCenterToPoint(element: HTMLElement, point: Point): number {
    const centerPoint = this.getElementCenterPoint(element);

    return Point.getDistanceTo(centerPoint, point);
  }

  // Point is relative to viewport. (clientX, clientY)

  public static pointIsInElement({ x, y }: Point, element: HTMLElement): boolean {
    return document
      .elementsFromPoint(x, y)
      .indexOf(element) !== -1;
  }

  public static findElementFromPoint(
    { x, y }: Point,
    identifiyElementFunction?: IdentifiyElementFunction,
    getAll: boolean = true,
  ): HTMLElement | HTMLElement[] | false {
    const elements = document.elementsFromPoint(x, y);

    if (elements.length === 0) {
      return false;
    }

    let identifyElement;

    if (typeof identifiyElementFunction === 'undefined') {
      identifyElement = () => true;
    } else {
      identifyElement = identifiyElementFunction;
    }

    let results: HTMLElement[] = [];

    elements.forEach(element => {
      if (identifyElement(element as HTMLElement) === true) {
        results.push(element as HTMLElement);
      }
    });

    if (results.length === 0) {
      return false;
    } else if (results.length === 1) {
      return results[0];
    }

    if (getAll === true) {
      return results;
    }

    return results[0];
  }

  public static getClosestChildFromPoints(
    parent: HTMLElement,
    points: Point | Point[],
    identifiyElementFunction?: IdentifiyElementFunction,
  ): HTMLElement | false {
    if (typeof identifiyElementFunction === 'undefined') {
      identifiyElementFunction = element => true;
    }

    const children = [...parent.children] as HTMLElement[];

    const selectedChildren = children.filter(identifiyElementFunction);

    if (selectedChildren.length === 0) {
      return false;
    }

    const distances = selectedChildren.map(item => {
      if (Array.isArray(points) === true) {
        const distances = (points as Point[]).map(point =>
          this.getClosestDistanceFromElementCornersToPoint(item, point),
        );

        return Math.min(...distances);
      } else {
        return this.getClosestDistanceFromElementCornersToPoint(item, points as Point);
      }
    });

    const closesDistanceIndex = distances.indexOf(Math.min(...distances));

    return selectedChildren[closesDistanceIndex];
  }
}
