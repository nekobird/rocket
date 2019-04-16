import {
  Point,
  Vector2,
} from '../rocket'

export class Vector2Group {

  static addGroupBy(group: Vector2[], by: Point): Vector2[] {
    return group.map(point => {
      return point.add(by)
    })
  }

  static subtractGroupBy(group: Vector2[], by: Point): Vector2[] {
    return group.map(point => {
      return point.subtract(by)
    })
  }

  static multiplyGroupBy(group: Vector2[], by: number): Vector2[] {
    return group.map(point => {
      return point.multiply(by)
    })
  }

  static divideGroupBy(group: Vector2[], by: number): Vector2[] {
    return group.map(point => {
      return point.divide(by)
    })
  }

  static scaleGroupByFrom(group: Vector2[], by: number, from: Point): Vector2[] {
    return group.map(point => {
      return point.scaleByFrom(by, from)
    })
  }

  static rotateGroupToFrom(group: Vector2[], to: number, from: Point): Vector2[] {
    return group.map(point => {
      return point.rotateToFrom(to, from)
    })
  }

  static rotateGroupByFrom(group: Vector2[], by: number, from: Point): Vector2[] {
    return group.map(point => {
      return point.rotateByFrom(by, from)
    })
  }

}