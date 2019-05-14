import {
  Angle,
  Num,
  Point,
} from '../rocket'

export class Vector2 {

  public x: number = 0
  public y: number = 0

  constructor(x?: number | Point, y?: number) {
    this.setPoint(x, y)
    return this
  }

  public setPoint(x: number | Point | undefined, y?: number): this {
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

  public equals(point: Point): this {
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

  public round(to: number = 0): this {
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

  public absolute(): this {
    this.x = Math.abs(this.x)
    this.y = Math.abs(this.y)
    return this
  }

  // ADD

  public add(point: Point): this {
    this.x += point.x
    this.y += point.y
    return this
  }

  public addX(point: number | Point): this {
    if (typeof point === 'number') {
      this.x += point
    } else {
      this.x += point.x
    }
    return this
  }

  public addY(point: number | Point): this {
    if (typeof point === 'number') {
      this.y += point
    } else {
      this.y += point.y
    }
    return this
  }

  // SUBTRACT

  public subtract(point: Point): this {
    this.x -= point.x
    this.y -= point.y
    return this
  }

  public subtractX(point: number | Point): this {
    if (typeof point === 'number') {
      this.x -= point
    } else {
      this.x -= point.x
    }
    return this
  }

  public subtractY(point: number | Point): this {
    if (typeof point === 'number') {
      this.y -= point
    } else {
      this.y -= point.y
    }
    return this
  }

  // MULTIPLY

  public multiply(by: number): this {
    this.x *= by
    this.y *= by
    return this
  }

  public multiplyX(by: number): this {
    this.x *= by
    return this
  }

  public multiplyY(by: number): this {
    this.y *= by
    return this
  }

  // DIVIDE

  public divide(by: number): this {
    by = by === 0 ? 1 : by
    this.x /= by
    this.y /= by
    return this
  }

  public divideX(by: number): this {
    by = by === 0 ? 1 : by
    this.x /= by
    return this
  }

  public divideY(by: number): this {
    by = by === 0 ? 1 : by
    this.y /= by
    return this
  }

  public constrain(constrain: number): this {
    this.x = Num.constrain(this.x, constrain)
    this.y = Num.constrain(this.y, constrain)
    return this
  }

  public dot(point: Point): number {
    return this.x * point.x + this.y * point.y
  }

  public normalize(): this {
    let mag: number = Math.abs(this.magnitude)
    mag = mag === 0 ? 1 : mag
    this.x /= mag
    this.y /= mag
    return this
  }

  public getDistanceTo(to: Point): number {
    return Vector2
      .subtract(this, to)
      .magnitude
  }

  // ANGLE

  get angle() {
    let m: number = Math.abs(
      Math.sqrt(this.x * this.x + this.y * this.y)
    )
    let angle: number = Math.acos(this.x / m)
    if (this.y < 0) {
      angle = Math.PI + (Math.PI - angle)
    }
    return Num.cycle(angle, Math.PI * 2)
  }

  public getAngleFrom(from: Point): number {
    const x: number = (this.x - from.x)
    const y: number = (this.y - from.y)
    const m: number = Math.abs(
      Math.sqrt(x * x + y * y)
    )
    let angle: number = Math.acos(x / m)
    if (y < 0) {
      angle = Math.PI + (Math.PI - angle)
    }
    return angle
  }

  public getAngleTo(to: Point): number {
    const x: number = (to.x - this.x)
    const y: number = (to.y - this.y)
    const m: number = Math.abs(
      Math.sqrt(x * x + y * y)
    )
    let angle: number = Math.acos(x / m)
    if (y < 0) {
      angle = Math.PI + (Math.PI - angle)
    }
    return angle
  }

  // ROTATE

  public rotateBy(by: number): this {
    const angle: number = this.angle + by
    const m: number = Math.abs(
      Math.sqrt(this.x * this.x + this.y * this.y)
    )
    this.x = Math.cos(angle) * m
    this.y = Math.sin(angle) * m
    return this
  }

  public rotateTo(angle: number): this {
    angle = Num.cycle(angle, Math.PI * 2)
    const m: number = Math.abs(
      Math.sqrt(this.x * this.x + this.y * this.y)
    )
    this.x = Math.cos(angle) * m
    this.y = Math.sin(angle) * m
    return this
  }

  public rotateByFrom(by: number, from: Point): this {
    by = Num.cycle(by, Math.PI * 2)
    const x: number = this.x - from.x
    const y: number = this.y - from.y
    const m: number = Math.abs(
      Math.sqrt(x * x + y * y)
    )
    let a: number = Math.acos(x / m)
    if (y < 0) {
      a = Math.PI + (Math.PI - a)
    }
    const finalAngle: number = Num.cycle(a + by, Math.PI * 2)
    this.x = from.x + Math.cos(finalAngle) * m
    this.y = from.y + Math.sin(finalAngle) * m
    return this
  }

  public rotateToFrom(to: number, from: Point): this {
    to = Num.cycle(to, Math.PI * 2)
    const x: number = this.x - from.x
    const y: number = this.y - from.y
    const m: number = Math.abs(
      Math.sqrt(x * x + y * y)
    )
    this.x = from.x + Math.cos(to) * m
    this.y = from.y + Math.sin(to) * m
    return this
  }

  // MOVE

  public moveBy(x: number | Point, y?: number): this {
    if (
      typeof x === 'number' &&
      typeof y === 'number'
    ) {
      this.x += x
      this.y += y
    } else if (
      typeof x === 'object' &&
      typeof y === 'undefined'
    ) {
      this.add(<Point>x)
    }
    return this
  }

  public moveTo(x: number | Point, y?: number) {
    if (
      typeof x === 'number' &&
      typeof y === 'number'
    ) {
      this.x = x
      this.y = y
    } else if (
      typeof x === 'object' &&
      typeof y === 'undefined'
    ) {
      this.equals(<Point>x)
    }
    return this
  }

  public moveRadiallyBy(angle: number, by: number): this {
    angle = Num.cycle(angle, Math.PI * 2)
    this.x += Math.cos(angle) * by
    this.y += Math.sin(angle) * by
    return this
  }

  public moveRadiallyTo(angle: number, by: number): this {
    angle = Num.cycle(angle, Math.PI * 2)
    this.x = Math.cos(angle) * by
    this.y = Math.sin(angle) * by
    return this
  }

  public scaleBy(by: number): this {
    let magnitude: number = Math.abs(
      Math.sqrt(this.x * this.x + this.y * this.y)
    )
    magnitude = magnitude === 0 ? 1 : magnitude
    this.x /= magnitude
    this.y /= magnitude
    this.x *= by
    this.y *= by
    return this
  }

  public scaleByFrom(by: number, from: Point): this {
    const sub: Vector2 = Vector2.subtract(this, from)
    const m: number = sub.magnitude
    sub
      .normalize()
      .multiply(m * by)
      .add(from)
    this.equals(sub)
    return this
  }

  public limit(by: number): this {
    const mag: number = this.magnitude
    if (mag > by) {
      this
        .normalize()
        .multiply(by)
    }
    return this
  }

  public lerp(point: Point, time: number): this {
    this.x = Num.modulate(time, 1, [this.x, point.x], false)
    this.y = Num.modulate(time, 1, [this.y, point.y], false)
    return this
  }

  // ZERO

  public zero(): this {
    this.x = 0
    this.y = 0
    return this
  }

  get isZero(): boolean {
    return (this.x === 0 && this.y === 0)
  }

  // STATIC

  static projectFrom(from: Point, direction: Point, by: number): Vector2 {
    const to: Vector2 = Vector2
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
    let x: number = a.x - b.x
    let y: number = a.y - b.y
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

  static scaleByFrom(vector: Point, to: number, from: Point): Vector2 {
    let result: Vector2 = Vector2.equals(vector)
    return result.scaleByFrom(to, from)
  }

  static getDisplacement(from: Point, to: Point): Vector2 {
    return Vector2.subtract(to, from)
  }

  static getDirection(from: Point, to: Point): Vector2 {
    return Vector2
      .subtract(to, from)
      .normalize()
  }

  // COMPARISON

  static isEqual(a: Point, b: Point): boolean {
    return (a.x === a.x && a.y === b.y)
  }

  // ANGLES

  static angleIsInProximity(a: number, b: number, tolerance: number): boolean {
    const d1: number = Angle.differenceClockwise(a, b)
    const d2: number = Angle.differenceCounterclockwise(a, b)
    const d: number = Math.min(d1, d2)
    return d <= tolerance
  }

  static getAngleBetween2Points(a: Point, b: Point): number {
    const a1: number = Vector2.equals(a).angle
    const a2: number = Vector2.equals(b).angle
    const b1: number = Angle.differenceClockwise(a1, a2)
    const b2: number = Angle.differenceCounterclockwise(a1, a2)
    return Math.min(b1, b2)
  }

  static getAngleBetween3Points(a: Point, b: Point, c: Point): number {
    const va: Vector2 = Vector2.equals(a)
    const vb: Vector2 = Vector2.equals(b)
    const vc: Vector2 = Vector2.equals(c)
    const a1: number = vb.getAngleTo(va)
    const a2: number = vb.getAngleTo(vc)
    const b1: number = Angle.differenceClockwise(a1, a2)
    const b2: number = Angle.differenceCounterclockwise(a1, a2)
    return Math.min(b1, b2)
  }

  // TRIANGLE

  static getBasePointOfTriangle(v1: Point, v2: Point, v3: Point): Vector2 {
    const a1: number = v1.getAngleTo(v3)
    const a2: number = v1.getAngleTo(v2)
    const a: number = Math.abs(a1 - a2)
    const h: number = v1.getDistanceTo(v2)
    const bh = Math.sin(a) * h
    const ml = Math.atan(a) / bh
    const fv = Vector2.equals(v1)
    return fv.moveRadiallyBy(a1, ml)
  }
}