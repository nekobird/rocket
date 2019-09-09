import {
  Angle,
  Num,
  Point,
  PointLike,
} from '../rocket';

// Glossary

// point: An object containing x and y numbers, representing position in the cartesian plane.
// length: Magnitude between two vectors OR magnitude of a vector.
// displacement: A vector, representing the distance and direction of one point to another.
// direction: A unit vector representing the direction from one point to another.

export class Vector2 {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number, y: number);
  constructor(n: number);
  constructor(v: Vector2);
  constructor(p: Point);
  constructor(p: PointLike);
  constructor();
  constructor(a?: number | PointLike, b?: number) {
    if (typeof a === 'number' && typeof b === 'number') {
      this.x = a;
      this.y = b;
    } else if (typeof a === 'number' && typeof b !== 'number') {
      this.x = a;
      this.y = a;
    } else if (Point.isPointLike(a) === true) {
      a = a as PointLike;

      this.x = a.x;
      this.y = a.y;
    }

    return this;
  }

  public equals(x: number, y: number): this;
  public equals(n: number): this;
  public equals(v: Vector2): this;
  public equals(p: Point): this;
  public equals(p: PointLike): this;
  public equals(a?: number | PointLike, b?: number): this {
    if (typeof a === 'number' && typeof b === 'number') {
      this.x = a;
      this.y = b;
    } else if (typeof a === 'number' && typeof b !== 'number') {
      this.x = a;
      this.y = a;
    } else if (Point.isPointLike(a) === true) {
      a = a as PointLike;

      this.x = a.x;
      this.y = a.y;
    }

    return this;
  }

  public isEqual(...v: PointLike[]): boolean {
    return v.every(p => this.x === p.x && this.y === p.y);
  }

  public toPoint(): Point {
    return new Point(this.x, this.y);
  }

  public negative(): this {
    this.x = -this.x;
    this.y = -this.y;

    return this;
  }

  public absolute(): this {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);

    return this;
  }

  // TODO: See if this make sense
  public clamp(by: number): this {
    this.x = Num.clamp(this.x, by);
    this.y = Num.clamp(this.y, by);

    return this;
  }

  public limit(by: number): this {
    if (this.magnitude > by) {
      this
        .normalize()
        .multiply(by);
    }

    return this;
  }

  get magnitude(): number {
    return Num.hypotenuse(this.x, this.y);
  }

  set magnitude(magnitude: number) {
    this
      .normalize()
      .multiply(magnitude);
  }

  public normalize(): this {
    let magnitude = Math.abs(this.magnitude);

    if (magnitude === 0) {
      magnitude = 1;
    }

    this.x /= magnitude;
    this.y /= magnitude;

    return this;
  }

  public dot(point: PointLike): number {
    return this.x * point.x + this.y * point.y;
  }

  public round(to: number = 0): this {
    this.x = parseFloat(this.x.toFixed(to));
    this.y = parseFloat(this.y.toFixed(to));

    return this;
  }

  public zero(): this {
    this.x = this.y = 0;

    return this;
  }

  get isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }

  public clone(): Vector2 {
    return Vector2.clone(this);
  }

  get array(): [number, number] {
    return [this.x, this.y];
  }

  get string(): string {
    return `x: ${this.x}, y: ${this.y}`;
  }

  get average(): number {
    return (Math.abs(this.x) + Math.abs(this.y)) / 2;
  }

  public add(x: number, y: number): this;
  public add(n: number): this;
  public add(v: Vector2): this;
  public add(p: Point): this;
  public add(p: PointLike): this;
  public add(a: number | PointLike, b?: number): this {
    if (Point.isPointLike(a) === true) {
      a = a as PointLike;

      this.x += a.x;
      this.y += a.y;
    } else if (typeof a === 'number' && typeof b === 'number') {
      this.x += a;
      this.y += b;
    } else if (typeof a === 'number' && typeof b !== 'number') {
      this.x += a;
      this.y += a;
    }

    return this;
  }

  public addX(n: number): this;
  public addX(v: Vector2): this;
  public addX(p: Point): this;
  public addX(p: PointLike): this;
  public addX(a: number | PointLike): this {
    if (typeof a === 'number') {
      this.x += a;
    } else if (typeof a === 'object' && typeof a.x === 'number') {
      this.x += a.x;
    }

    return this;
  }

  public addY(n: number): this;
  public addY(v: Vector2): this;
  public addY(p: Point): this;
  public addY(p: PointLike): this;
  public addY(a: number | PointLike): this {
    if (typeof a === 'number') {
      this.y += a;
    } else if (typeof a === 'object' && typeof a.y === 'number') {
      this.y += a.y;
    }

    return this;
  }

  public subtract(x: number, y: number): this;
  public subtract(n: number): this;
  public subtract(v: Vector2): this;
  public subtract(p: Point): this;
  public subtract(p: PointLike): this;
  public subtract(a: number | PointLike, b?: number): this {
    if (Point.isPointLike(a) === true) {
      a = a as PointLike;

      this.x -= a.x;
      this.y -= a.y;
    } else if (typeof a === 'number' && typeof b !== 'number') {
      this.x -= a;
      this.y -= a;
    } else if (typeof a === 'number' && typeof b === 'number') {
      this.x -= a;
      this.y -= b;
    }

    return this;
  }

  public subtractX(n: number): this;
  public subtractX(v: Vector2): this;
  public subtractX(p: Point): this;
  public subtractX(p: PointLike): this;
  public subtractX(a: number | PointLike): this {
    if (typeof a === 'number') {
      this.x -= a;
    } else if (typeof a === 'object' && typeof a.x === 'number') {
      this.x -= a.x;
    }

    return this;
  }

  public subtractY(n: number): this;
  public subtractY(v: Vector2): this;
  public subtractY(p: Point): this;
  public subtractY(p: PointLike): this;
  public subtractY(a: number | PointLike): this {
    if (typeof a === 'number') {
      this.y -= a;
    } else if (typeof a === 'object' && typeof a.y === 'number') {
      this.y -= a.y;
    }

    return this;
  }

  public multiply(x: number, y: number): this;
  public multiply(n: number): this;
  public multiply(v: Vector2): this;
  public multiply(p: Point): this;
  public multiply(p: PointLike): this;
  public multiply(a: number | PointLike, b?: number): this {
    if (Point.isPointLike(a) === true) {
      a = a as PointLike;

      this.x *= a.x;
      this.y *= a.y;
    } else if (typeof a === 'number' && typeof b !== 'number') {
      this.x *= a;
      this.y *= a;
    } else if (typeof a === 'number' && typeof b === 'number') {
      this.x *= a;
      this.y *= b;
    }

    return this;
  }

  public multiplyX(n: number): this;
  public multiplyX(v: Vector2): this;
  public multiplyX(p: Point): this;
  public multiplyX(p: PointLike): this;
  public multiplyX(a: number | PointLike): this {
    if (typeof a === 'number') {
      this.x *= a;
    } else if (Point.isPointLike(a) === true) {
      this.x *= a.x;
    }

    return this;
  }

  public multiplyY(n: number): this;
  public multiplyY(v: Vector2): this;
  public multiplyY(p: Point): this;
  public multiplyY(p: PointLike): this;
  public multiplyY(a: number | PointLike): this {
    if (typeof a === 'number') {
      this.y *= a;
    } else if (Point.isPointLike(a) === true) {
      this.y *= a.y;
    }

    return this;
  }

  public divide(x: number, y: number): this;
  public divide(n: number): this;
  public divide(v: Vector2): this;
  public divide(p: Point): this;
  public divide(p: PointLike): this;
  public divide(a: number | PointLike, b?: number): this {
    if (typeof a === 'number' && typeof b !== 'number') {
      if (a === 0) {
        throw new Error('Vector2: Division by zero.');
      } else {
        this.x /= a;
        this.y /= a;
      }
    } else if (typeof a === 'number' && typeof b === 'number') {
      if (a === 0 || b === 0) {
        throw new Error('Vector2: Division by zero.');
      } else {
        this.x /= a;
        this.y /= b;
      }
    } else if (Point.isPointLike(a) === true) {
      a = a as PointLike;

      if (a.x === 0 || a.y === 0) {
        throw new Error('Vector2: Division by zero.');
      } else {
        this.x /= a.x;
        this.y /= a.y;
      }
    }

    return this;
  }

  public divideX(n: number): this;
  public divideX(v: Vector2): this;
  public divideX(p: Point): this;
  public divideX(p: PointLike): this;
  public divideX(a: number | PointLike): this {
    if (typeof a === 'number') {
      if (a === 0) {
        throw new Error('Vector2: Division by zero.');
      } else {
        this.x /= a;
      }
    } else if (Point.isPointLike(a) === true) {
      a = a as PointLike;

      if (a.x === 0) {
        throw new Error('Vector2: Division by zero.');
      } else {
        this.x /= a.x;
      }
    }

    return this;
  }

  public divideY(n: number): this;
  public divideY(v: Vector2): this;
  public divideY(p: Point): this;
  public divideY(p: PointLike): this;
  public divideY(a: number | PointLike): this {
    if (typeof a === 'number') {
      if (a === 0) {
        throw new Error('Vector2: Division by zero.');
      } else {
        this.y /= a;
      }
    } else if (Point.isPointLike(a) === true) {
      a = a as PointLike;

      if (a.y === 0) {
        throw new Error('Vector2: Division by zero.');
      } else {
        this.y /= a.y;
      }
    }

    return this;
  }

  public getDistanceTo(to: PointLike): number {
    return Vector2.subtract(this, to).magnitude;
  }

  get angle() {
    let angle = Math.acos(this.x / this.magnitude);

    if (this.y < 0) {
      angle = Math.PI + (Math.PI - angle);
    }

    return angle;
  }

  public getAngleFrom(from: PointLike): number {
    const x = this.x - from.x;
    const y = this.y - from.y;

    const m = Num.hypotenuse(x, y);

    let angle = Math.acos(x / m);

    if (y < 0) {
      angle = Math.PI + (Math.PI - angle);
    }

    return angle;
  }

  public getAngleTo(to: PointLike): number {
    const x = to.x - this.x;
    const y = to.y - this.y;

    const m = Num.hypotenuse(x, y);

    let angle = Math.acos(x / m);

    if (y < 0) {
      angle = Math.PI + (Math.PI - angle);
    }

    return angle;
  }

  public moveBy(v: PointLike): this;
  public moveBy(x: number): this;
  public moveBy(x: number, y: number): this;
  public moveBy(a: number | PointLike, b?: number): this {
    if (typeof a === 'number' && typeof b === 'number') {
      this.x += a;
      this.y += b;
    } else if (Point.isPointLike(a) === true) {
      a = a as PointLike;

      this.add(a);
    }

    return this;
  }

  public moveTo(v: PointLike): this;
  public moveTo(x: number, y: number): this;
  public moveTo(a: number | PointLike, b?: number): this {
    if (typeof a === 'number' && typeof b === 'number') {
      this.x = a;
      this.y = b;
    } else if (Point.isPointLike(a) === true) {
      a = a as PointLike;

      this.equals(a);
    }

    return this;
  }

  public polarTranslate(angle: number, length: number): this {
    angle = Num.cycle(angle, Math.PI * 2);

    this.x += Math.cos(angle) * length;
    this.y += Math.sin(angle) * length;

    return this;
  }

  public polarTranslateBy(by: number, length: number): this {
    const angle = Num.cycle(this.angle + by, Math.PI * 2);

    this.x += Math.cos(angle) * length;
    this.y += Math.sin(angle) * length;

    return this;
  }

  public moveRadiallyBy(angle: number, by: number): this {
    angle = Num.cycle(angle, Math.PI * 2);

    this.x += Math.cos(angle) * by;
    this.y += Math.sin(angle) * by;

    return this;
  }

  public moveRadiallyTo(angle: number, to: number): this {
    angle = Num.cycle(angle, Math.PI * 2);

    this.x = Math.cos(angle) * to;
    this.y = Math.sin(angle) * to;

    return this;
  }

  public rotateBy(by: number): this {
    const angle = this.angle + by;

    this.x = Math.cos(angle) * this.magnitude;
    this.y = Math.sin(angle) * this.magnitude;

    return this;
  }

  public rotateTo(angle: number): this {
    angle = Num.cycle(angle, Math.PI * 2);

    this.x = Math.cos(angle) * this.magnitude;
    this.y = Math.sin(angle) * this.magnitude;

    return this;
  }

  public rotateByFrom(by: number, from: PointLike): this {
    by = Num.cycle(by, Math.PI * 2);

    const x = this.x - from.x;
    const y = this.y - from.y;

    const m = Num.hypotenuse(x, y);

    let a = Math.acos(x / m);

    if (y < 0) {
      a = Math.PI + (Math.PI - a);
    }

    const angle = Num.cycle(a + by, Math.PI * 2);

    this.x = from.x + Math.cos(angle) * m;
    this.y = from.y + Math.sin(angle) * m;

    return this;
  }

  public rotateToFrom(to: number, from: PointLike): this {
    to = Num.cycle(to, Math.PI * 2);

    const x = this.x - from.x;
    const y = this.y - from.y;

    const m = Num.hypotenuse(x, y);

    this.x = from.x + Math.cos(to) * m;
    this.y = from.y + Math.sin(to) * m;

    return this;
  }

  public scaleBy(by: number): this {
    let magnitude = this.magnitude;

    if (magnitude === 0) {
      magnitude = 1;
    }

    this.x /= magnitude;
    this.y /= magnitude;

    this.x *= by;
    this.y *= by;

    return this;
  }

  public scaleByFrom(by: number, from: PointLike): this {
    const difference = Vector2.subtract(this, from);

    const magnitude = difference.magnitude;

    difference
      .normalize()
      .multiply(magnitude * by)
      .add(from);

    this.equals(difference);

    return this;
  }

  public applyLerp(t: number, point: PointLike): this {
    this.x = Num.transform(t, 1, [this.x, point.x], false);
    this.y = Num.transform(t, 1, [this.y, point.y], false);

    return this;
  }

  public applyCubicBezier(
    t: number,
    p1: PointLike,
    cp1: PointLike,
    cp2: PointLike,
    p2: PointLike,
  ): this {
    this.x = Num.cubicBezier(t, p1.x, cp1.x, cp2.x, p2.x);
    this.y = Num.cubicBezier(t, p1.y, cp1.y, cp2.y, p2.y);

    return this;
  }

  static clone(point: PointLike): Vector2 {
    return new Vector2(point.x, point.y);
  }

  static unit(v: PointLike): Vector2 {
    return Vector2
      .clone(v)
      .normalize();
  }

  static add(a: PointLike, b: PointLike): Vector2 {
    return Vector2
      .clone(a)
      .add(b);
  }

  static subtract(a: PointLike, b: PointLike): Vector2 {
    return Vector2
      .clone(a)
      .subtract(b);
  }

  static multiply(v: PointLike, n: number): Vector2 {
    return Vector2
      .clone(v)
      .multiply(n);
  }

  static divide(v: PointLike, n: number): Vector2 {
    return Vector2
      .clone(v)
      .divide(n);
  }

  static projectFrom(from: PointLike, direction: PointLike, by: number): Vector2 {
    const to = Vector2
    .clone(direction)
    .normalize()
    .multiply(by);

    return Vector2.add(from, to);
  }

  static splitAtAngle(target: PointLike, angle: number, by: number): Vector2[] {
    let results: Vector2[] = [];

    results[0] = Vector2.clone(target).moveRadiallyBy(angle, -by);
    results[1] = Vector2.clone(target).moveRadiallyBy(angle, by);

    return results;
  }

  static getMidPointBetween(a: PointLike, b: PointLike): Vector2 {
    let x = a.x - b.x;
    let y = a.y - b.y;

    x /= 2;
    y /= 2;

    x += b.x;
    y += b.y;

    return new Vector2(x, y);
  }

  // Distance and length are alias of each other.
  static getDistanceBetween(a: PointLike, b: PointLike): number {
    return Vector2.subtract(a, b).magnitude;
  }

  static getLengthBetween(a: PointLike, b: PointLike): number {
    return Vector2.subtract(a, b).magnitude;
  }

  static scaleByFrom(vector: PointLike, to: number, from: PointLike): Vector2 {
    return Vector2.clone(vector).scaleByFrom(to, from);
  }

  static getDisplacement(from: PointLike, to: PointLike): Vector2 {
    return Vector2.subtract(to, from);
  }

  static getDirection(from: PointLike, to: PointLike): Vector2 {
    return Vector2.subtract(to, from).normalize();
  }

  // Returns a Vector rotated 90degrees clockwise for a
  // 2D coordinate system where the positive Y axis goes down.
  static perpendicular(from: Vector2): Vector2 {
    return from.clone().rotateBy(Math.PI / 2);
  }

  static angleIsInProximity(a: number, b: number, tolerance: number): boolean {
    const d1 = Angle.differenceClockwise(a, b);
    const d2 = Angle.differenceCounterclockwise(a, b);

    const d = Math.min(d1, d2);

    return d <= tolerance;
  }

  static getAngleBetween2Points(a: PointLike, b: PointLike): number {
    const a1 = Vector2.clone(a).angle;
    const a2 = Vector2.clone(b).angle;

    const b1 = Angle.differenceClockwise(a1, a2);
    const b2 = Angle.differenceCounterclockwise(a1, a2);

    return Math.min(b1, b2);
  }

  static getAngleBetween3Points(a: PointLike, b: PointLike, c: PointLike): number {
    const va = Vector2.clone(a);
    const vb = Vector2.clone(b);
    const vc = Vector2.clone(c);

    const a1 = vb.getAngleTo(va);
    const a2 = vb.getAngleTo(vc);

    const b1 = Angle.differenceClockwise(a1, a2);
    const b2 = Angle.differenceCounterclockwise(a1, a2);

    return Math.min(b1, b2);
  }

  static getBasePointOfTriangle(v1: PointLike, v2: PointLike, v3: PointLike): Vector2 {
    const a1 = v1.getAngleTo(v3);
    const a2 = v1.getAngleTo(v2);

    const a = Math.abs(a1 - a2);

    const h = v1.getDistanceTo(v2);

    const bh = Math.sin(a) * h;
    const ml = Math.atan(a) / bh;

    const fv = Vector2.clone(v1);

    return fv.moveRadiallyBy(a1, ml);
  }

  // static perpendicular(): Vector2 {}

  static getCenterVector(...v: PointLike[]): Vector2 {
    const left = this.minX(...v);
    const right = this.maxX(...v);
    const top = this.minY(...v);
    const bottom = this.maxY(...v);

    return new Vector2(
      left + (right - left) / 2,
      top + (bottom - top) / 2
    );
  }

  static one(): Vector2 {
    return new Vector2(1, 1);
  }

  static get zero(): Vector2 {
    return new Vector2(0, 0);
  }

  static get random(): Vector2 {
    return new Vector2(Math.random(), Math.random());
  }

  static up(): Vector2 {
    return new Vector2(0, -1);
  }

  static down(): Vector2 {
    return new Vector2(0, 1);
  }

  static left(): Vector2 {
    return new Vector2(-1, 0);
  }

  static right(): Vector2 {
    return new Vector2(0, 1);
  }

  static min(...v: Vector2[]): Vector2 {
    const magnitudes = v.map(vector => vector.magnitude);
   
    const index = magnitudes.indexOf(Math.min(...magnitudes));

    return v[index];
  }

  static max(...v: Vector2[]): Vector2 {
    const magnitudes = v.map(vector => vector.magnitude);

    const index = magnitudes.indexOf(Math.max(...magnitudes));

    return v[index];
  }

  static minX(...p: PointLike[]): number {
    const x = p.map(point => point.x);

    const i = x.indexOf(Math.min(...x));

    return x[i];
  }

  static minY(...p: PointLike[]): number {
    const y = p.map(point => point.y);

    const i = y.indexOf(Math.min(...y));

    return y[i];
  }

  static maxX(...p: PointLike[]): number {
    const x = p.map(point => point.x);

    const i = x.indexOf(Math.max(...x));

    return x[i];
  }

  static maxY(...p: PointLike[]): number {
    const y = p.map(point => point.y);

    const i = y.indexOf(Math.max(...y));

    return y[i];
  }
}
