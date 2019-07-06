import {
  Num,
  Point,
  PointHelper,
} from '../rocket';

interface IdentifyElementFn {
  (element: HTMLElement): boolean;
}

export class DOMPoint {
  // Point is relative to viewport. (clientX, clientY)
  // Offset is relative to Point.
  public static getElementOffsetFromPoint(element: HTMLElement, { x, y }: Point): Point {
    const { left, top } = element.getBoundingClientRect();
    return {
      x: Num.getEuclideanDistance(left, x),
      y: Num.getEuclideanDistance(top, y),
    };
  }

  public static getElementCornerPoints(element: HTMLElement): Point[] {
    const { top, bottom, left, right } = element.getBoundingClientRect();
    return [
      PointHelper.newPoint(left, top),
      PointHelper.newPoint(left, bottom),
      PointHelper.newPoint(right, top),
      PointHelper.newPoint(right, bottom),
    ];
  }

  public static getElementCenterPoint(element: HTMLElement): Point {
    const { left, top, width, height } = element.getBoundingClientRect();
    return PointHelper.newPoint(
      left + (width  / 2),
      top  + (height / 2),
    );
  }

  public static getElementDiagonalPoints(element: HTMLElement): [Point, Point] {
    const { top, bottom, left, right } = element.getBoundingClientRect();
    return [
      PointHelper.newPoint(left, top),
      PointHelper.newPoint(right, bottom),
    ];
  }

  public static getElementTopPoints(element: HTMLElement): Point[] {
    const { left, right, top } = element.getBoundingClientRect();
    return [
      PointHelper.newPoint(left, top),
      PointHelper.newPoint(right, top),
    ];
  }

  public static getElementBottomPoints(element: HTMLElement): Point[] {
    const { left, right, bottom } = element.getBoundingClientRect();
    return [
      PointHelper.newPoint(left, bottom),
      PointHelper.newPoint(right, bottom),
    ];
  }

  public static getElementLeftPoints(element: HTMLElement): Point[] {
    const { left, top, bottom } = element.getBoundingClientRect();
    return [
      PointHelper.newPoint(left, top),
      PointHelper.newPoint(left, bottom),
    ];
  }

  public static getElementRightPoints(element: HTMLElement): Point[] {
    const { right, top, bottom } = element.getBoundingClientRect();
    return [
      PointHelper.newPoint(right, top),
      PointHelper.newPoint(right, bottom),
    ];
  }

  public static elementIsAbovePoints(element: HTMLElement, points: Point | Point[], offset: number = 0) {
    const { bottom } = element.getBoundingClientRect();
    if (Array.isArray(points) === true) {
      let isAbovePoints: boolean = true;

      points.forEach(({ y }) => {
        if (bottom + offset < y === false)
          isAbovePoints = false;
      })

      return isAbovePoints;
    }
    return bottom + offset < (<Point>points).y;
  }

  public static elementIsBelowPoints(element: HTMLElement, points: Point | Point[], offset: number = 0) {
    const { top } = element.getBoundingClientRect();
    if (Array.isArray(points) === true) {
      let isBelowPoints: boolean = true;

      points.forEach(({ y }) => {
        if (top + offset > y === false)
          isBelowPoints = false;
      });
      return isBelowPoints;
    }
    return top + offset > (<Point>points).y;
  }

  public static elementCenterIsAbovePoints(element: HTMLElement, points: Point | Point[], offset: number = 0) {
    const centerPoint = this.getElementCenterPoint(element);
    if (Array.isArray(points) === true) {
      let isAbovePoint: boolean = true;

      points.forEach(({ y }) => {
        if (centerPoint.y + offset > y === false)
          isAbovePoint = false;
      });

      return isAbovePoint;
    }

    return centerPoint.y + offset > (<Point>points).y;
  }

  public static elementCenterIsBelowPoints(element: HTMLElement, points: Point | Point[], offset: number = 0) {
    const centerPoint = this.getElementCenterPoint(element);
    if (Array.isArray(points) === true) {
      let isBelowPoint: boolean = true;

      points.forEach(({ y }) => {
        if (centerPoint.y + offset < y === false)
          isBelowPoint = false;
      });

      return isBelowPoint;
    }

    return centerPoint.y + offset < (points as Point).y;
  }

  public static getClosestDistanceFromElementCornersToPoint(element: HTMLElement, point: Point): number {
    const corners = this.getElementCornerPoints(element);

    const distances = corners.map(corner => PointHelper.getDistanceTo(corner, point));

    return Math.min(...distances);
  }

  public static getDistanceFromElementCenterToPoint(element: HTMLElement, point: Point): number {
    return PointHelper.getDistanceTo(
      this.getElementCenterPoint(element),
      point
    );
  }

  // Point is relative to viewport. (clientX, clientY)

  public static pointIsInElement({ x, y }: Point, element: HTMLElement): boolean {
    return document.elementsFromPoint(x, y).indexOf(element) !== -1;
  }

  public static findElementFromPoint({ x, y }: Point, identifyElementFn?: IdentifyElementFn, getAll: boolean = true): HTMLElement | HTMLElement[] | false {
    const elements = document.elementsFromPoint(x, y);

    if (elements.length === 0) return false;

    const identifyElement = typeof identifyElementFn === 'undefined' ? () => true : identifyElementFn;

    let results: HTMLElement[] = [];
    elements.forEach(element => {
      if (identifyElement(element as HTMLElement) === true)
        results.push(element as HTMLElement);
    });

    if (results.length === 0) {
      return false;
    } else if (results.length === 1) {
      return results[0];
    }

    if (getAll === true) return results;
    return results[0];
  }

  public static getClosestChildFromPoints(parent: HTMLElement, points: Point | Point[], identifyElementFn?: IdentifyElementFn): HTMLElement | false {
    if (typeof identifyElementFn === 'undefined')
      identifyElementFn = element => true;

    const children: HTMLElement[] = <HTMLElement[]>Array.from(parent.children);
    const selectedChildren: HTMLElement[] = children.filter(identifyElementFn);

    if (selectedChildren.length === 0) return false;

    const distances: number[] = selectedChildren.map(item => {
      if (Array.isArray(points) === true) {
        const distances = points.map(
          point => this.getClosestDistanceFromElementCornersToPoint(item, point)
        );
        return Math.min(...distances);
      } else {
        return this.getClosestDistanceFromElementCornersToPoint(item, points as Point);
      }
    })

    const closesDistanceIndex: number = distances.indexOf(Math.min(...distances));

    return selectedChildren[closesDistanceIndex];
  }
}
