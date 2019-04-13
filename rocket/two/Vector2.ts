import {
  Angle,
  Num,
} from '../Rocket'

export interface Point {
  x: number,
  y: number,
  [key: string]: any,
}

export class Vector2 {

  public x: number = 0
  public y: number = 0

  constructor(...args) {
    // @ts-ignore
    this.setPoint(...args)
    return this
  }

  setPoint(x: number | Point, y?: number): Vector2 {
    if (
      typeof x === 'number' &&
      typeof y === 'number'
    ) {
      this.x = x
      this.y = y
    } else if (typeof x === 'undefined') {
      this.x = 0
      this.y = 0
    } else {
      this.equals(<Point>x)
    }

    return this
  }

  set magnitude(mag: number) {
    this
      .normalize()
      .multiply(mag)
  }

  get magnitude(): number {
    return Num.hypotenuse(this.x, this.y)
  }

  public equals(point: Point): Vector2 {
    this.x = point.x
    this.y = point.y
    return this
  }

  public isEqualTo(point: Point): boolean {
    return (
      this.x === point.x &&
      this.y === point.y
    )
  }

  public round(to: number = 0): Vector2 {
    this.x = parseFloat(
      this.x.toFixed(to)
    )
    this.y = parseFloat(
      this.y.toFixed(to)
    )
    return this
  }

  get clone(): Vector2 {
    return Vector2.equals(this)
  }

  get array(): [number, number] {
    return [this.x, this.y]
  }

  get string(): string {
    return `x: ${this.x}, y: ${this.y}`
  }

  get average(): number {
    return (Math.abs(this.x) + Math.abs(this.y)) / 2
  }

  public absolute(): Vector2 {
    this.x = Math.abs(this.x)
    this.y = Math.abs(this.y)
    return this
  }

  // ADD

  add(point: Point): Vector2 {
    this.x += point.x
    this.y += point.y
    return this
  }

  addX(point: number | Point): Vector2 {
    if (typeof point === 'number') {
      this.x += point
    } else {
      this.x += point.x
    }
    return this
  }

  addY(point: number | Point): Vector2 {
    if (typeof point === 'number') {
      this.y += point
    } else {
      this.y += point.y
    }
    return this
  }

  // SUBTRACT

  subtract(point) {
    this.x -= point.x
    this.y -= point.y
    return this
  }

  subtractX(point) {
    if (typeof point === 'number') {
      this.x -= point
    } else {
      this.x -= point.x
    }
    return this
  }

  subtractY(point) {
    if (typeof point === 'number') {
      this.y -= point
    } else {
      this.y -= point.y
    }
    return this
  }

  // MULTIPLY

  multiply(by) {
    this.x *= by
    this.y *= by
    return this
  }

  multiplyX(by) {
    this.x *= by
    return this
  }

  multiplyY(by) {
    this.y *= by
    return this
  }

  // DIVIDE

  divide(by) {
    by = by === 0 ? 1 : by
    this.x /= by
    this.y /= by
    return this
  }

  divideX(by) {
    by = by === 0 ? 1 : by
    this.x /= by
    return this
  }

  divideY(by) {
    by = by === 0 ? 1 : by
    this.y /= by
    return this
  }

  constrain(constrain) {
    this.x = Num.constrain(this.x, constrain)
    this.y = Num.constrain(this.y, constrain)
    return this
  }

  dot(point) {
    return this.x * point.x + this.y * point.y
  }

  normalize() {
    let mag = Math.abs(this.magnitude)
    mag = mag === 0 ? 1 : mag
    this.x /= mag
    this.y /= mag
    return this
  }

  getDistanceTo(to) {
    return Vector2
      .subtract(this, to)
      .magnitude
  }

  // ANGLE

  get angle() {
    let m = Math.abs(
      Math.sqrt(this.x * this.x + this.y * this.y)
    )
    let angle = Math.acos(this.x / m)
    if (this.y < 0) {
      angle = Math.PI + (Math.PI - angle)
    }
    return Num.cycle(angle, Math.PI * 2)
  }

  getAngleFrom(from) {
    let x = (this.x - from.x)
    let y = (this.y - from.y)
    let m = Math.abs(
      Math.sqrt(x * x + y * y)
    )
    let angle = Math.acos(x / m)
    if (y < 0) {
      angle = Math.PI + (Math.PI - angle)
    }
    return angle
  }

  getAngleTo(to) {
    let x = (to.x - this.x)
    let y = (to.y - this.y)
    let m = Math.abs(
      Math.sqrt(x * x + y * y)
    )
    let angle = Math.acos(x / m)
    if (y < 0) {
      angle = Math.PI + (Math.PI - angle)
    }
    return angle
  }

  // ROTATE

  rotateBy(by) {
    let angle = this.angle + by
    let m = Math.abs(
      Math.sqrt(this.x * this.x + this.y * this.y)
    )
    this.x = Math.cos(angle) * m
    this.y = Math.sin(angle) * m
    return this
  }

  rotateTo(angle) {
    angle = Num.cycle(angle, Math.PI * 2)
    let m = Math.abs(
      Math.sqrt(this.x * this.x + this.y * this.y)
    )
    this.x = Math.cos(angle) * m
    this.y = Math.sin(angle) * m
    return this
  }

  rotateByFrom(by, from) {
    by = Num.cycle(by, Math.PI * 2)
    let x = this.x - from.x
    let y = this.y - from.y
    let m = Math.abs(
      Math.sqrt(x * x + y * y)
    )
    let a = Math.acos(x / m)
    if (y < 0) {
      a = Math.PI + (Math.PI - a)
    }
    let finalAngle = Num.cycle(a + by, Math.PI * 2)
    this.x = from.x + Math.cos(finalAngle) * m
    this.y = from.y + Math.sin(finalAngle) * m
    return this
  }

  rotateToFrom(to, from) {
    to = Num.cycle(to, Math.PI * 2)
    let x = this.x - from.x
    let y = this.y - from.y
    let m = Math.abs(
      Math.sqrt(x * x + y * y)
    )
    this.x = from.x + Math.cos(to) * m
    this.y = from.y + Math.sin(to) * m
    return this
  }

  // MOVE

  moveBy(x, y) {
    if (
      typeof x === 'number' &&
      typeof y === 'number'
    ) {
      this.x += x
      this.y += y
    } else if (
      typeof x !== 'object' &&
      typeof y === 'undefined'
    ) {
      this.add(x)
    }
    return this
  }

  moveTo(x, y) {
    if (
      typeof x === 'number' &&
      typeof y === 'number'
    ) {
      this.x = x
      this.y = y
    } else if (
      typeof x !== 'object' &&
      typeof y === 'undefined'
    ) {
      this.equals(x)
    }
    return this
  }

  moveRadiallyBy(angle, by) {
    angle = Num.cycle(angle, Math.PI * 2)
    this.x += Math.cos(angle) * by
    this.y += Math.sin(angle) * by
    return this
  }

  moveRadiallyTo(angle, by) {
    angle = Num.cycle(angle, Math.PI * 2)
    this.x = Math.cos(angle) * by
    this.y = Math.sin(angle) * by
    return this
  }

  scaleBy(by) {
    let magnitude = Math.abs(Math.sqrt(this.x * this.x + this.y * this.y))
    magnitude = magnitude === 0 ? 1 : magnitude
    this.x /= magnitude
    this.y /= magnitude
    this.x *= by
    this.y *= by
    return this
  }

  scaleByFrom(by, from) {
    let sub = Vector2.subtract(this, from)
    let m = sub.magnitude
    sub
      .normalize()
      .multiply(m * by)
      .add(from)
    this.equals(sub)
    return this
  }

  limit(by) {
    let mag = this.magnitude
    if (mag > by) {
      this
        .normalize()
        .multiply(by)
    }
    return this
  }

  public lerp(point: Point, time: number): Vector2 {
    this.x = Num.modulate(time, 1, [this.x, point.x], false)
    this.y = Num.modulate(time, 1, [this.y, point.y], false)
    return this
  }

  // ZERO

  public zero(): Vector2 {
    this.x = 0
    this.y = 0
    return this
  }

  get isZero(): boolean {
    return (this.x === 0 && this.y === 0)
  }

  // STATIC

  static projectFrom(from: Vector2, direction: Vector2, by: Vector2): Vector2 {
    let to = Vector2
      .equals(direction)
      .normalize()
      .multiply(by)
    return Vector2.add(from, to)
  }

  static get zero(): Vector2 {
    return new Vector2(0, 0)
  }

  static get random(): Vector2 {
    return new Vector2(Math.random(), Math.random())
  }

  static equals(point: Point): Vector2 {
    return new Vector2(point.x, point.y)
  }

  static add(a: Point, b: Point): Vector2 {
    return new Vector2(a).add(b)
  }

  static subtract(a: Point, b: Point): Vector2 {
    return new Vector2(a.x, a.y).subtract(b)
  }

  static multiply(v: Point, n: number): Vector2 {
    return new Vector2(v.x, v.y).multiply(n)
  }

  static divide(v: Point, n: number): Vector2 {
    return new Vector2(v.x, v.y).divide(n)
  }

  static normalize(v: Point): Vector2 {
    return new Vector2(v.x, v.y).normalize()
  }

  static getMidPointBetween(a: Point, b: Point): Vector2 {
    let x = a.x - b.x
    let y = a.y - b.y
    x /= 2
    y /= 2
    x += b.x
    y += b.y
    return new Vector2(x, y)
  }

  static getDistanceBetween(a: Point, b: Point): number {
    return Vector2
      .subtract(a, b)
      .magnitude
  }

  static splitAtAngle(target: Point, angle: number, by: number): Vector2[] {
    let results: Vector2[] = []
    results[0] = Vector2
      .equals(target)
      .moveRadiallyBy(angle, -by)
    results[1] = Vector2
      .equals(target)
      .moveRadiallyBy(angle, by)
    return results
  }

  static scaleByFrom(vector, to, from) {
    let result = Vector2.equals(vector)
    return result.scaleByFrom(to, from)
  }

  static getDisplacement(from, to) {
    return Vector2.subtract(to, from)
  }

  static getDirection(from, to) {
    return Vector2
      .subtract(to, from)
      .normalize()
  }

  // COMPARISON

  static isEqual(a, b) {
    return a.x === a.x && a.y === b.y ? true : false
  }

  // ANGLES

  static angleIsInProximity(a, b, tolerance) {
    let d1 = Angle.differenceClockwise(a, b)
    let d2 = Angle.differenceCounterclockwise(a, b)
    let d = Math.min(d1, d2)
    return d <= tolerance ? true : false
  }

  static getAngleBetween2Points(a, b) {
    let a1 = Vector2.equals(a).angle
    let a2 = Vector2.equals(b).angle
    let b1 = Angle.differenceClockwise(a1, a2)
    let b2 = Angle.differenceCounterclockwise(a1, a2)
    return Math.min(b1, b2)
  }

  static getAngleBetween3Points(a, b, c) {
    let va = Vector2.equals(a)
    let vb = Vector2.equals(b)
    let vc = Vector2.equals(c)
    let a1 = vb.getAngleTo(va)
    let a2 = vb.getAngleTo(vc)
    let b1 = Angle.differenceClockwise(a1, a2)
    let b2 = Angle.differenceCounterclockwise(a1, a2)
    return Math.min(b1, b2)
  }

  // TRIANGLE

  static getBasePointOfTriangle(v1, v2, v3) {
    let a1 = v1.getAngleTo(v3)
    let a2 = v1.getAngleTo(v2)
    let a = Math.abs(a1 - a2)
    let h = v1.getDistanceTo(v2)
    let bh = Math.sin(a) * h
    let ml = Math.atan(a) / bh
    let fv = Vector2.equals(v1)
    return fv.moveRadiallyBy(a1, ml)
  }

  // GROUP

  static addGroupBy(group, by) {
    for (let point of group) {
      point.add(by)
    }
    return group
  }

  static subtractGroupBy(group, by) {
    for (let point of group) {
      point.subtract(by)
    }
    return group
  }

  static multiplyGroupBy(group, by) {
    for (let point of group) {
      point.multiply(by)
    }
    return group
  }

  static divideGroupBy(group, by) {
    for (let point of group) {
      point.divide(by)
    }
    return group
  }

  static scaleGroupByFrom(group, by, from) {
    for (let point of group) {
      point.scaleByFrom(by, from)
    }
    return group
  }

  static rotateGroupToFrom(group, to, from) {
    for (let point of group) {
      point.rotateToFrom(to, from)
    }
    return group
  }

  static rotateGroupByFrom(group, by, from) {
    for (let point of group) {
      point.rotateByFrom(by, from)
    }
    return group
  }

}