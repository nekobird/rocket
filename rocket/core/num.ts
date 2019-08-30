import {
  NumberOrRange,
  RangeArray,
} from '../rocket';

export class Num {
  private static getRangeFromNumberOrRange(range: NumberOrRange): RangeArray {
    if (typeof range === 'number') {
      return [0, range];
    }

    return range;
  }

  private static orderRangeArray(range: RangeArray): RangeArray {
    const min = Math.min(...range);
    const max = Math.max(...range);

    return [min, max];
  }

  private static isRangeArray(thing: any): boolean {
    return (
      Array.isArray(thing) === true
      && thing.length === 2
      && thing.every(member => typeof member === 'number')
    );
  }

  private static isNumberOrRange(thing: any): boolean {
    return (
      typeof thing === 'number'
      || this.isRangeArray(thing)
    )
  }

  public static constrain(value: number, min: number, max: number): number;
  public static constrain(value: number, range: NumberOrRange): number;
  public static constrain(value: number, a: NumberOrRange, b?: number): number {
    let range: RangeArray;

    if (typeof a === 'number' && typeof b === 'number') {
      range = this.orderRangeArray([a, b]);
    } else if (
      this.isNumberOrRange(a) === true
      && typeof b === 'undefined'
    ) {
      range = this.getRangeFromNumberOrRange(a);
    } else {
      return value;
    }

    let [min, max] = this.orderRangeArray(range);

    return Math.max(min, Math.min(value, max));
  }

  public static clamp(value: number, min: number, max: number): number;
  public static clamp(value: number, range: NumberOrRange): number;
  public static clamp(value: number, a: NumberOrRange, b?: number): number {
    let range: RangeArray;

    if (typeof a === 'number' && typeof b === 'number') {
      range = this.orderRangeArray([a, b]);
    } else if (
      this.isNumberOrRange(a) === true
      && typeof b === 'undefined'
    ) {
      range = this.getRangeFromNumberOrRange(a);
    } else {
      return value;
    }

    let [min, max] = this.orderRangeArray(range);

    return Math.max(min, Math.min(value, max));
  }

  public static within(value: number, min: number, max: number, isExclusive?: boolean): boolean;
  public static within(value: number, range: NumberOrRange, isExclusive?: boolean): boolean;
  public static within(
    value: number,
    a: NumberOrRange,
    b?: number | boolean,
    c?: boolean,
  ): boolean {
    let range: RangeArray;

    let isExclusive = false;

    if (
      typeof a === 'number'
      && typeof b === 'number'
      && (typeof c === 'boolean' || typeof c === 'undefined')
    ) {
      if (typeof c === 'boolean') {
        isExclusive = c;
      }

      range = this.orderRangeArray([a, b]);
    } else if (
      this.isNumberOrRange(a) == true
      && (typeof b === 'boolean' || typeof b === 'undefined')
    ) {
      if (typeof b === 'boolean') {
        isExclusive = b;
      }

      range = this.getRangeFromNumberOrRange(a);
    } else {
      throw new Error('Num.within: Invalid input.');
    }

    let [min, max] = range;

    if (isExclusive === true) {
      return value > min && value < max;
    } else {
      return value >= min && value <= max;
    }
  }

  public static cycle(value: number, range: NumberOrRange): number {
    range = this.getRangeFromNumberOrRange(range);

    const [min, max] = this.orderRangeArray(range);

    if (min === 0 && max === 0) {
      return 0;
    }

    const da = this.getEuclideanDistance(min, max);

    if (value > max) {
      let db = this.getEuclideanDistance(value, max);

      let c = (db % da) + min;

      if (c === min) {
        return max;
      }

      return c;
    } else if (value < min) {
      let db = this.getEuclideanDistance(value, min);

      let c = max - (db % da);

      if (c === max) {
        return min;
      }

      return c;
    }

    return value;
  }

  // https://en.wikipedia.org/wiki/Euclidean_distance
  public static getEuclideanDistance(a: number, b: number): number {
    if (a === b) {
      return 0;
    }

    return Math.sqrt(Math.abs((a - b) * (b - a)));
  }

  public static hypotenuse(x: number, y: number): number {
    let max = Math.max(Math.abs(x), Math.abs(y));

    if (max === 0) {
      max = 1;
    }

    const min = Math.min(Math.abs(x), Math.abs(y));

    const n = min / max;

    return max * Math.sqrt(1 + n * n);
  }

  public static modulate(
    value: number,
    from: NumberOrRange,
    to: NumberOrRange,
    clamp: boolean = true,
  ): number {
    from = this.getRangeFromNumberOrRange(from);
    to = this.getRangeFromNumberOrRange(to);

    const percent = (value - from[0]) / (from[1] - from[0]);

    let result;

    if (to[1] > to[0]) {
      result = percent * (to[1] - to[0]) + to[0];
    } else {
      result = to[0] - percent * (to[0] - to[1]);
    }

    if (clamp === true) {
      return this.clamp(result, to);
    }

    return result;
  }

  // https://math.stackexchange.com/questions/377169/calculating-a-value-inside-one-range-to-a-value-of-another-range/377174
  public static transform(
    value: number,
    from: NumberOrRange,
    to: NumberOrRange,
    clamp: boolean = true,
  ): number {
    from = this.getRangeFromNumberOrRange(from);
    to = this.getRangeFromNumberOrRange(to);

    // Division by zero returns Infinite in JavaScript?
    let result = (value - from[0]) * ((to[1] - to[0]) / (from[1] - from[0])) + to[0];

    if (clamp === true) {
      return this.clamp(result, to);
    }

    return result;
  }

  public static lerp(t: number, from: number, to: number): number {
    return (1 - t) * from + t * to;
  }

  public static cubicBezier(t: number, p1: number, cp1: number, cp2: number, p2: number): number {
    return (
      Math.pow(1 - t, 3) * p1 +
      3 * t * Math.pow(1 - t, 2) * cp1 +
      3 * t * t * (1 - t) * cp2 +
      t * t * t * p2
    );
  }

  public static reciprocal(value: number): number {
    if (value != 0) {
      return 1 / value;
    } else {
      throw new Error('Num.reciprocal: Division by zero.');
    }
  }

  public static roundTo(number: number, to?: number): number {
    if (typeof to !== 'number') {
      to = 0;
    }

    return parseFloat(number.toFixed(to));
  }

  public static average(...numbers): number {
    if (numbers.length < 2) {
      throw new Error ('Num.average: Expects at least two numbers.');
    }

    return this.sum(...numbers) / numbers.length;
  }

  public static sum(...numbers: number[]): number {
    return numbers.reduce((previous, current) => previous + current);
  }

  public static random(range: NumberOrRange, whole: boolean = false, fixed: number = 2): number {
    range = this.getRangeFromNumberOrRange(range);

    if (range[0] === 0 && range[1] === 1) {
      if (whole === true) {
        return Math.floor(Math.random() * 2);
      } else {
        return parseFloat(Math.random().toFixed(fixed));
      }
    } else {
      const number = this.modulate(Math.random(), 1, range, false);

      return parseInt(number.toFixed(0), 10);
    }
  }

  public static getSign(n: number): number {
    const sign = Math.sign(n);

    if (sign === 0) {
      return 1;
    }

    return sign;
  }
}
