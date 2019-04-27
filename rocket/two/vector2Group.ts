import {
  Point,
  Vector2,
} from '../rocket'

export class Vector2Group {

  public static addGroupBy(group: Vector2[], by: Point): Vector2[] {
    return group.map(point => {
      return point.add(by)
    })
  }

  public static subtractGroupBy(group: Vector2[], by: Point): Vector2[] {
    return group.map(point => {
      return point.subtract(by)
    })
  }

  public static multiplyGroupBy(group: Vector2[], by: number): Vector2[] {
    return group.map(point => {
      return point.multiply(by)
    })
  }

  public static divideGroupBy(group: Vector2[], by: number): Vector2[] {
    return group.map(point => {
      return point.divide(by)
    })
  }

  public static scaleGroupByFrom(group: Vector2[], by: number, from: Point): Vector2[] {
    return group.map(point => {
      return point.scaleByFrom(by, from)
    })
  }

  public static rotateGroupToFrom(group: Vector2[], to: number, from: Point): Vector2[] {
    return group.map(point => {
      return point.rotateToFrom(to, from)
    })
  }

  public static rotateGroupByFrom(group: Vector2[], by: number, from: Point): Vector2[] {
    return group.map(point => {
      return point.rotateByFrom(by, from)
    })
  }

}