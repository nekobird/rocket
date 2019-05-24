import {
  Num,
  Point,
  PointHelper,
} from '../rocket';

export interface Rectangle {
  left: number;
  right: number;
  top: number;
  bottom: number;
  center: Point;
  width: number;
  height: number;
}

export class DOMRect {

  public static getRectFromElements(elements: HTMLElement | HTMLElement[]): Rectangle | false {
    let targets: HTMLElement[];

    if (Array.isArray(elements) === false) {
      targets = <HTMLElement[]>[elements];
    } else {
      targets = <HTMLElement[]>elements;
    }

    if (targets.length === 0) {
      return false;
    }

    const result = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: 0,
      height: 0,
      center: PointHelper.zero(),
    };

    for (let i = 0; i < targets.length; i++) {
      const rect = targets[i].getBoundingClientRect();
      if (i === 0) {
        result.left = rect.left;
        result.right = rect.right;
        result.top = rect.top;
        result.bottom = rect.bottom;
      } else {
        if (rect.left < result.left) {
          result.left = rect.left;
        }
        if (rect.right > result.right) {
          result.right = rect.right;
        }
        if (rect.top < result.top) {
          result.top = rect.top;
        }
        if (rect.bottom > result.bottom) {
          result.bottom = rect.bottom;
        }
      }
    }

    result.width  = Num.getNumberLineDistance(result.left, result.right);
    result.height = Num.getNumberLineDistance(result.top,  result.bottom);

    result.center = PointHelper.newPoint(
      result.left + result.width / 2,
      result.top + result.height / 2,
    );
    return result;
  }
}