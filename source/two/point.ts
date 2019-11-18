import {
  Num,
  Vector2,
} from '~/rocket';

export interface PointLike {
  x: number;
  y: number;

  [key: string]: any;
}

export class Point {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number, y: number);
  constructor(x: number);
  constructor(p: Point);
  constructor(v: Vector2);
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
  public equals(p: Point): this;
  public equals(v: Vector2): this;
  public equals(p: PointLike): this;
  public equals(a: number | PointLike, b?: number): this {
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

  public clone() {
    return new Point(this.x, this.y);
  }

  public isEqual(...points: PointLike[]): boolean {
    let isEqual = true;

    points.forEach(point => {
      if (this.x !== point.x || this.y !== point.y) {
        isEqual = false;
      }
    });

    return isEqual;
  }

  public toVector2(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  // @modify

  public round(to: number = 0): this {
    this.x = parseFloat(this.x.toFixed(to));
    this.y = parseFloat(this.y.toFixed(to));

    return this;
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

  public zero(): this {
    this.x = this.y = 0;

    return this;
  }

  // @calculate

  public getLengthFromOrigin(): number {
    return Num.hypotenuse(this.x, this.y);
  }

  public getLengthFrom(x: number, y: number): number;
  public getLengthFrom(p: number): number;
  public getLengthFrom(a: number | PointLike, b?: number): number {
    let x;
    let y;

    x = y = 0;

    if (typeof a === 'number' && typeof b === 'number') {
      x = a;
      y = b;
    } else if (Point.isPointLike(a) === true) {
      a = a as PointLike;
      x = a.x;
      y = a.y;
    }

    x = this.x - x;
    y = this.y - y;

    return Num.hypotenuse(x, y);
  }

  // @operations

  public add(x: number, y: number): this;
  public add(n: number): this;
  public add(p: Point): this;
  public add(v: Vector2): this;
  public add(p: PointLike): this;
  public add(a: PointLike | number, b?: number): this {
    if (typeof a === 'number' && typeof b === 'number') {
      this.x += a;
      this.y += b;
    } else if (typeof a === 'number' && typeof b !== 'number') {
      this.x += a;
      this.y += a;
    } else if (Point.isPointLike(a) === true) {
      a = a as PointLike;

      this.x += a.x;
      this.y += a.y;
    }

    return this;
  }

  public addX(n: number): this;
  public addX(p: Point): this;
  public addX(v: Vector2): this;
  public addX(p: PointLike): this;
  public addX(a: PointLike | number): this {
    if (typeof a === 'number') {
      this.x += a;
    } else if (Point.isPointLike(a) === true) {
      this.x += a.x;
    }

    return this;
  }

  public addY(n: number): this;
  public addY(p: Point): this;
  public addY(v: Vector2): this;
  public addY(p: PointLike): this;
  public addY(a: PointLike | number): this {
    if (typeof a === 'number') {
      this.y += a;
    } else if (Point.isPointLike(a) === true) {
      this.y += a.y;
    }

    return this;
  }

  public subtract(x: number, y: number): this;
  public subtract(n: number): this;
  public subtract(p: Point): this;
  public subtract(v: Vector2): this;
  public subtract(p: PointLike): this;
  public subtract(a: PointLike | number, b?: number): this {
    if (typeof a === 'number' && typeof b === 'number') {
      this.x -= a;
      this.y -= b;
    } else if (typeof a === 'number' && typeof b !== 'number') {
      this.x -= a;
      this.y -= a;
    } else if (Point.isPointLike(a) === true) {
      a = a as PointLike;

      this.x -= a.x;
      this.y -= a.y;
    }

    return this;
  }

  public subtractX(n: number): this;
  public subtractX(p: Point): this;
  public subtractX(v: Vector2): this;
  public subtractX(p: PointLike): this;
  public subtractX(a: PointLike | number): this {
    if (typeof a === 'number') {
      this.x -= a;
    } else if (Point.isPointLike(a) === true) {
      this.x -= a.x;
    }

    return this;
  }

  public subtractY(n: number): this;
  public subtractY(p: Point): this;
  public subtractY(v: Vector2): this;
  public subtractY(p: PointLike): this;
  public subtractY(a: PointLike | number): this {
    if (typeof a === 'number') {
      this.y -= a;
    } else if (Point.isPointLike(a) === true) {
      this.y -= a.y;
    }

    return this;
  }

  public multiply(x: number, y: number): this;
  public multiply(n: number): this;
  public multiply(p: Point): this;
  public multiply(v: Vector2): this;
  public multiply(p: PointLike): this;
  public multiply(a: PointLike | number, b?: number): this {
    if (typeof a === 'number' && typeof b === 'number') {
      this.x *= a;
      this.y *= b;
    } else if (typeof a === 'number' && typeof b !== 'number') {
      this.x *= a;
      this.y *= a;
    } else if (Point.isPointLike(a) === true) {
      a = a as PointLike;

      this.x *= a.x;
      this.y *= a.y;
    }

    return this;
  }

  public multiplyX(n: number): this;
  public multiplyX(p: Point): this;
  public multiplyX(v: Vector2): this;
  public multiplyX(p: PointLike): this;
  public multiplyX(a: PointLike | number): this {
    if (typeof a === 'number') {
      this.x *= a;
    } else if (Point.isPointLike(a) === true) {
      this.x *= a.x;
    }

    return this;
  }

  public multiplyY(n: number): this;
  public multiplyY(p: Point): this;
  public multiplyY(v: Vector2): this;
  public multiplyY(p: PointLike): this;
  public multiplyY(a: PointLike | number): this {
    if (typeof a === 'number') {
      this.y *= a;
    } else if (Point.isPointLike(a) === true) {
      this.y *= a.y;
    }

    return this;
  }

  public divide(x: number, y: number): this;
  public divide(n: number): this;
  public divide(p: Point): this;
  public divide(v: Vector2): this;
  public divide(p: PointLike): this;
  public divide(a: PointLike | number, b?: number): this {
    if (typeof a === 'number' && typeof b === 'number') {
      if (a === 0 || b === 0) {
        throw new Error('Point: Division by zero.');
      } else {
        this.x /= a;
        this.y /= b;
      }
    } else if (typeof a === 'number' && typeof b !== 'number') {
      if (a === 0) {
        throw new Error('Point: Division by zero.');
      } else {
        this.x /= a;
        this.y /= a;
      }
    } else if (Point.isPointLike(a) === true) {
      a = a as PointLike;

      if (a.x === 0 || a.y === 0) {
        throw new Error('Point: Division by zero.');
      } else {
        this.x /= a.x;
        this.y /= a.y;
      }
    }

    return this;
  }

  public divideX(n: number): this;
  public divideX(p: Point): this;
  public divideX(v: Vector2): this;
  public divideX(p: PointLike): this;
  public divideX(a: PointLike | number): this {
    if (typeof a === 'number') {
      if (a === 0) {
        throw new Error('Point: Division by zero.');
      } else {
        this.x /= a;
      }
    } else if (Point.isPointLike(a) === true) {
      if (a.x === 0) {
        throw new Error('Point: Division by zero.');
      } else {
        this.x /= a.x;
      }
    }

    return this;
  }

  public divideY(n: number): this;
  public divideY(p: Point): this;
  public divideY(v: Vector2): this;
  public divideY(p: PointLike): this;
  public divideY(a: PointLike | number): this {
    if (typeof a === 'number') {
      if (a === 0) {
        throw new Error('Point: Division by zero.');
      } else {
        this.y /= a;
      }
    } else if (Point.isPointLike(a) === true) {
      if (a.y === 0) {
        throw new Error('Point: Division by zero.');
      } else {
        this.y /= a.y;
      }
    }

    return this;
  }

  public static add(point1: PointLike, point2: PointLike, mutate: boolean = false): Point {
    const x = point1.x + point2.x;
    const y = point1.y + point2.y;

    if (mutate === true) {
      point1.x = x;
      point1.y = y;

      return new Point().equals(point1);
    }

    return new Point(x, y);
  }

  public static subtract(point: PointLike, by: PointLike, mutate: boolean = false): Point {
    const x = point.x - by.x;
    const y = point.y - by.y;

    if (mutate === true) {
      point.x = x;
      point.y = y;

      return new Point().equals(point);
    }

    return new Point(x, y);
  }

  public static multiply(point: PointLike, by: PointLike, mutate: boolean = false): Point {
    const x = point.x * by.x;
    const y = point.y * by.y;

    if (mutate === true) {
      point.x = x;
      point.y = y;

      return new Point().equals(point);
    }

    return new Point(x, y);
  }

  public static divide(point: PointLike, by: PointLike, mutate: boolean = false): Point | undefined {
    if (by.x === 0 || by.y === 0) {
      throw new Error('Point: Division by zero.');
    }

    const x = point.x / by.x;
    const y = point.y / by.y;

    if (mutate === true) {
      point.x = x;
      point.y = y;

      return new Point().equals(point);
    }

    return new Point(x, y);
  }

  public static getDistanceTo(from: PointLike, to: PointLike): number {
    const difference = Point.subtract(from, to, true);

    return difference.getLengthFromOrigin();
  }

  public static getMidPointBetween(a: PointLike, b: PointLike): Point {
    let x = a.x - b.x;
    let y = a.y - b.y;

    x /= 2;
    y /= 2;

    x += b.x;
    y += b.y;

    return new Point(x, y);
  }

  public static lerp(time: number, from: PointLike, to: PointLike, mutate: boolean = false): Point {
    const x = Num.transform(time, 1, [from.x, to.x]);
    const y = Num.transform(time, 1, [from.y, to.y]);

    if (mutate === true) {
      from.x = x;
      from.y = y;

      return new Point().equals(from);
    }

    return new Point(x, y);
  }

  // @zero

  public static zero(point?: Point, mutate: boolean = false): Point {
    if (typeof point !== 'undefined' && mutate === true) {
      point.x = 0;
      point.y = 0;

      return point;
    }

    return new Point(0, 0);
  }

  public static isPointLike(point): boolean {
    return (
      typeof point === 'object'
      && typeof point.x === 'number'
      && typeof point.y === 'number'
    )
  }
}
