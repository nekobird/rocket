export class Num {

  // @pure
  static average(numbers: number[]): number {
    if (numbers.length < 2)
      throw new Error('Num.average expects at least 2 numbers');
    return this.sum(numbers) / numbers.length;
  }

  // @pure
  static constrain(number: number, range: number | [number, number]): number {
    if (typeof range === 'number') range = [0, range];

    const max = Math.max(range[0], range[1]);
    const min = Math.min(range[0], range[1]);

    if (number >= max) {
      return max;
    } else if (number <= min) {
      return min;
    }
    return number;
  }

  // @pure
  static cycle(number: number, range: number | [number, number]): number {
    if (typeof range === 'number') range = [0, range];

    const max = Math.max(range[0], range[1]);
    const min = Math.min(range[0], range[1]);

    if (max === 0 && min === 0) return 0;

    const da = this.getEuclideanDistance(min, max);
    let db: number;
    let c: number;

    if (number > max) {
      db = this.getEuclideanDistance(number, max);
      c = db % da + min;
      return c === min ? max : c;
    } else if (number < min) {
      db = this.getEuclideanDistance(number, min);
      c = max - db % da;
      return c === max ? min : c;
    }
    return number;
  }

  // Get number-line distance between two integers.
  // For example (-4, -2) = 6, (-4, 5) = 9
  // https://en.wikipedia.org/wiki/Euclidean_distance
  // @pure
  static getEuclideanDistance(a: number, b: number): number {
    if (a === b) return 0;
    return Math.sqrt(Math.abs((a - b) * (b - a)));
  }

  // A more efficient way to calculate hypotenuse.
  // @pure
  static hypotenuse(x: number, y: number): number {
    // http://www.johndcook.com/blog/2010/06/02/whats-so-hard-about-finding-a-hypotenuse/
    let max = Math.max(Math.abs(x), Math.abs(y));
    if (max === 0) max = 1;

    const min = Math.min(Math.abs(x), Math.abs(y));    
    const n = min / max;
    return max * Math.sqrt(1 + n * n);
  }

  // Get reciprocal of a number.
  // @pure
  static reciprocal(number: number): number | undefined {
    return number != 0 ? 1 / number : undefined;
  }

  // @pure
  static round(number: number, to?: number): number {
    to = typeof to === 'undefined' ? 0 : to;
    return parseFloat(number.toFixed(to));
  }

  // Simple linear interpolation.
  // @pure
  static lerp(t: number, from: number, to: number): number {
    return (1 - t) * from + t * to;
  }

  // Cubic Bezier interpolation.
  // @pure
  static cubicBezier(t: number, p1: number, cp1: number, cp2: number, p2: number): number {
    return Math.pow(1 - t, 3) * p1 + 3 * t * Math.pow(1 - t, 2) * cp1 + 3 * t * t * (1 - t) * cp2 + t * t * t * p2;
  }

  // @pure
  static modulate(number: number, from: number | [number, number], to: number | [number, number], constrain: boolean): number {
    if (typeof from === 'number') from = [0, from];
    if (typeof to === 'number') to = [0, to];
    const percent = (number - from[0]) / (from[1] - from[0]);
    let result: number;
    if (to[1] > to[0]) {
      result = percent * (to[1] - to[0]) + to[0];
    } else {
      result = to[0] - (percent * (to[0] - to[1]));
    }
    return constrain === true ? Num.constrain(result, to) : result;
  }

  // @pure
  static random(range: number | [number, number], whole: boolean = false, fixed: number = 2): number {
    if (typeof range === 'number') range = [0, range];
    if (
      range[0] === 0
      && range[1] === 1
    ) {
      if (whole === true) {
        return Math.random() > 0.5 ? 1 : 0;
      } else {
        return parseFloat(Math.random().toFixed(fixed));
      }
    } else {
      let number = this.modulate(Math.random(), 1, range, false);
      return parseInt((number).toFixed(0));
    }
  }

  // @pure
  static sum(numbers: number[]): number {
    return numbers.reduce((previous, current) => previous + current);
  }

  // @pure
  static within(number: number, range: number | [number, number]): boolean {
    if (typeof range === 'number') range = [0, range];

    return (
      number >= range[0]
      && number <= range[1]
    );
  }
}
