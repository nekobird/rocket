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

  public static average(...numbers): number {
    if (numbers.length < 2) {
      throw new Error ('Num.average: Expects at least two numbers.');
    }

    return this.sum(...numbers) / numbers.length;
  }

  public static constrain(value: number, range: NumberOrRange): number {
    range = this.getRangeFromNumberOrRange(range);

    const [min, max] = this.orderRangeArray(range);

    if (value <= min) {
      return min;
    }

    if (value >= max) {
      return max;
    }

    return value;
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

  // Get number-line distance between two integers.
  // For example (-4, -2) = 6, (-4, 5) = 9
  // https://en.wikipedia.org/wiki/Euclidean_distance
  public static getEuclideanDistance(a: number, b: number): number {
    if (a === b) {
      return 0;
    }

    return Math.sqrt(Math.abs((a - b) * (b - a)));
  }

  // A more efficient way to calculate hypotenuse.
  public static hypotenuse(x: number, y: number): number {
    // http://www.johndcook.com/blog/2010/06/02/whats-so-hard-about-finding-a-hypotenuse/
    let max = Math.max(Math.abs(x), Math.abs(y));

    if (max === 0) {
      max = 1;
    }

    const min = Math.min(Math.abs(x), Math.abs(y));

    const n = min / max;

    return max * Math.sqrt(1 + n * n);
  }

  // Get reciprocal of a number.
  public static reciprocal(number: number): number {
    if (number != 0) {
      return 1 / number;
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

  // Simple linear interpolation.
  public static lerp(t: number, from: number, to: number): number {
    return (1 - t) * from + t * to;
  }

  // Cubic Bezier interpolation.
  public static cubicBezier(t: number, p1: number, cp1: number, cp2: number, p2: number): number {
    return (
      Math.pow(1 - t, 3) * p1 +
      3 * t * Math.pow(1 - t, 2) * cp1 +
      3 * t * t * (1 - t) * cp2 +
      t * t * t * p2
    );
  }

  public static modulate(number: number, from: NumberOrRange, to: NumberOrRange, constrain: boolean = true): number {
    from = this.getRangeFromNumberOrRange(from);
    to = this.getRangeFromNumberOrRange(to);

    const percent = (number - from[0]) / (from[1] - from[0]);

    let result;

    if (to[1] > to[0]) {
      result = percent * (to[1] - to[0]) + to[0];
    } else {
      result = to[0] - percent * (to[0] - to[1]);
    }

    if (constrain === true) {
      return this.constrain(result, to);
    }

    return result;
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

  public static sum(...numbers: number[]): number {
    return numbers.reduce((previous, current) => previous + current);
  }

  // Check to see if given number is within given range.
  public static within(number: number, range: NumberOrRange): boolean {
    range = this.getRangeFromNumberOrRange(range);

    return number >= range[0] && number <= range[1];
  }

  public static getSign(n: number): number {
    const sign = Math.sign(n);

    if (sign === 0) {
      return 1;
    }

    return sign;
  }
}
