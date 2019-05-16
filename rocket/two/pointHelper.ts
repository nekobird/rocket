import {
  Point,
  Num,
} from '../rocket'


export class PointHelper {
  public static new(x: number, y: number): Point {
    return {x, y}
  }

  public static isEqual(point: Point, ...points: Point[]): boolean {
    let isEqual: boolean = true
    points.forEach(_point => {
      if (
        point.x !== _point.x ||
        point.y !== _point.y
      ) {
        isEqual = false
      }
    })
    return isEqual
  }

  public static round(point: Point, to: number = 0, mutate: boolean = false): Point {
    const x: number = parseFloat(point.x.toFixed(to))
    const y: number = parseFloat(point.y.toFixed(to))
    if (mutate === true) {
      point.x = x
      point.y = y
      return point
    }
    return {x, y}
  }

  public static absolute(point: Point, mutate: boolean = false): Point {
    const x: number = Math.abs(point.x)
    const y: number = Math.abs(point.y)
    if (mutate === true) {
      point.x = x
      point.y = y
      return point
    }
    return {x, y}
  }

  public static add(point1: Point, point2: Point, mutate: boolean = false): Point {
    const x: number = point1.x + point2.x
    const y: number = point1.y + point2.y
    if (mutate === true) {  
      point1.x = x
      point1.y = y
      return point1
    }
    return {x, y}
  }

  public static subtract(point: Point, by: Point, mutate: boolean = false): Point {
    const x: number = point.x - by.x
    const y: number = point.y - by.y
    if (mutate === true) {  
      point.x = x
      point.y = y
      return point
    }
    return {x, y}
  }

  public static multiply(point: Point, by: Point, mutate: boolean = false): Point {
    const x: number = point.x * by.x
    const y: number = point.y * by.y
    if (mutate === true) {
      point.x = x
      point.y = y
      return point
    }
    return {x, y}
  }

  public divide(point: Point, by: Point, mutate: boolean = false): Point | undefined {
    if (by.x === 0 || by.y === 0) {
      return undefined
    }
    const x: number = point.x / by.x
    const y: number = point.y / by.y
    if (mutate === true) {
      point.x = x
      point.y = y
      return point
    }
    return {x, y}
  }

  public static magnitude({x, y}: Point): number {
    return Num.hypotenuse(x, y)
  }

  public static normalize(point: Point, mutate: boolean = false): Point {
    let mag: number = Math.abs(PointHelper.magnitude(point))
    mag = mag === 0 ? 1 : mag
    const x: number = point.x / mag
    const y: number = point.y / mag
    if (mutate === true) {
      point.x = x
      point.y = y
      return point
    }
    return {x, y}
  }

  public static getDistanceTo(from: Point, to: Point): number {
    const difference: Point = PointHelper.subtract(from, to, true)
    return PointHelper.magnitude(difference)
  }

  public static getMidPointBetween(a: Point, b: Point): Point {
    let x: number = a.x - b.x
    let y: number = a.y - b.y
    x /= 2
    y /= 2
    x += b.x
    y += b.y
    return {x, y}
  }

  public static lerp(from: Point, to: Point, time: number, mutate: boolean = false): Point {
    const x: number = Num.modulate(time, 1, [from.x, to.x], false)
    const y: number = Num.modulate(time, 1, [from.y, to.y], false)
    if (mutate === true) {
      from.x = x
      from.y = y
      return from
    }
    return {x, y}
  }

  // Zero

  public static zero(point: Point, mutate: boolean = false): Point {
    if (mutate === true) {
      point.x = 0
      point.y = 0
      return point
    }
    return {x: 0, y: 0}
  }

  public static isZero(point: Point): boolean {
    return (point.x === 0 && point.y === 0)
  }
}