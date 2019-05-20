import {
  Point,
  Vector2,
} from '../rocket';

export class Geo2Util {

  // linear
  // negative  = \
  // positive  = /
  // 0         = horizontal
  // undefined = vertical
  public static getSlopeOfLine(ls: Point, le: Point): number | false {
    if (le.x === ls.x) {
      return false;
    } else {
      let rise: number = le.y - ls.y;
      let run: number = le.x - ls.x;
      return rise / run;
    }
  }

  public static checkIfTwoLineSegmentsAreParallel(
    ls1: Point, le1: Point, ls2: Point, le2: Point
  ): boolean {
    let s1: number | false = Geo2Util.getSlopeOfLine(ls1, le1)
    let s2: number | false = Geo2Util.getSlopeOfLine(ls2, le2)
    return s1 === s2
  }

  // Two lines will always intersect unless they are parallel.
  // Check if two line segments intersect each other.
  public static checkIfTwoLineSegmentsIntersect(
    ls1: Point, le1: Point, ls2: Point, le2: Point
  ): boolean {
    const pi: Point | false = Geo2Util.getPointOfIntersectionBetweenTwoLineSegments(ls1, le1, ls2, le2);

    if (pi === false) {
      return false;
    }

    if (
      pi.x > Math.max(ls1.x, le1.x)
      || pi.x < Math.min(ls1.x, le1.x)
      || pi.x > Math.max(ls2.x, le2.x)
      || pi.x < Math.min(ls2.x, le2.x)
      || pi.y > Math.max(ls1.y, le1.y)
      || pi.y < Math.min(ls1.y, le1.y)
      || pi.y > Math.max(ls2.y, le2.y)
      || pi.y < Math.min(ls2.y, le2.y)
    ) {
      return false;
    }
    return true;
  }

  public static getPointOfIntersectionBetweenTwoLineSegments(
    ls1: Point, le1: Point, ls2: Point, le2: Point
  ): Vector2 | false {
    if (Geo2Util.checkIfTwoLineSegmentsAreParallel(ls1, le1, ls2, le2) === true) {
      return false;
    }

    let ix: number = 0;
    let iy: number = 0;

    // Get slope.
    let m1: number | false = Geo2Util.getSlopeOfLine(ls1, le1);
    let m2: number | false = Geo2Util.getSlopeOfLine(ls2, le2);

    let yi1;
    let yi2;

    if (
      m1 === false
      && typeof m2 === 'number'
    ) {
      ix = ls1.x;
      yi2 = -1 * m2 * ls2.x + ls2.y;
      iy = m2 * ix + yi2;
    } else if (
      m2 === false
      && typeof m1 === 'number'
    ) {
      ix = ls2.x;
      yi1 = -1 * m1 * ls1.x + ls1.y;
      iy = m1 * ix + yi1;
    } else if (
      typeof m1 === 'number'
      && typeof m2 === 'number'
    ) {
      // Get y-intercept
      // b = -m * x + y
      yi1 = -1 * m1 * ls1.x + ls1.y;
      yi2 = -1 * m2 * ls2.x + ls2.y;
      // Complete line equations
      ix = (yi1 - yi2) / (m2 - m1);
      iy = m1 * ix + yi1;
    }

    return new Vector2(ix, iy);
  }
}
