import {
  NumberOrRange,
  RangeArray,
  Util,
} from '../rocket';

export function average(...values: number[]): number {
  if (values.length < 2) {
    throw new Error ('Num.average: Expects at least two numbers.');
  }
  
  return sum(...values) / values.length;
}

export function clamp(value: number, min: number, max: number): number;
export function clamp(value: number, range: NumberOrRange): number;
export function clamp(value: number, a: NumberOrRange, b?: number): number {
  let range: RangeArray;

  if (typeof a === 'number' && typeof b === 'number') {
    range = orderRangeArray([a, b]);
  } else if (
    isNumberOrRange(a) === true
    && typeof b === 'undefined'
  ) {
    range = getRangeFromNumberOrRange(a);
  } else {
    return value;
  }

  let [min, max] = orderRangeArray(range);

  return Math.max(min, Math.min(value, max));
}

export function countDigits(value: number): number {
  const matches = value.toString().match(/([\d])/g);

  if (matches === null) {
    return 0;
  }

  return matches.length;
}

export function cubicBezier(t: number, p1: number, cp1: number, cp2: number, p2: number): number {
  return (
    Math.pow(1 - t, 3) * p1 +
    3 * t * Math.pow(1 - t, 2) * cp1 +
    3 * t * t * (1 - t) * cp2 +
    t * t * t * p2
  );
}

export function cycle(
  value: number,
  range: NumberOrRange,
): number {
  range = getRangeFromNumberOrRange(range);

  const [min, max] = orderRangeArray(range);

  if (min === 0 && max === 0) {
    return 0;
  }

  const da = getEuclideanDistance(min, max);

  if (value > max) {
    let db = getEuclideanDistance(value, max);

    let c = (db % da) + min;

    if (c === min) {
      return max;
    }

    return c;
  } else if (value < min) {
    let db = getEuclideanDistance(value, min);

    let c = max - (db % da);

    if (c === max) {
      return min;
    }

    return c;
  }

  return value;
}

// https://en.wikipedia.org/wiki/Euclidean_distance
export function getEuclideanDistance(a: number, b: number): number {
  if (a === b) {
    return 0;
  }

  return Math.sqrt(Math.abs((a - b) * (b - a)));
}

export function getSign(value: number): number {
  const sign = Math.sign(value);

  if (sign === 0) {
    return 1;
  }

  return sign;
}

export function hypotenuse(x: number, y: number): number {
  let max = Math.max(Math.abs(x), Math.abs(y));

  if (max === 0) {
    max = 1;
  }

  const min = Math.min(Math.abs(x), Math.abs(y));

  const n = min / max;

  return max * Math.sqrt(1 + n * n);
}

export function lerp(t: number, from: number, to: number): number {
  return (1 - t) * from + t * to;
}

export function random(
  range: NumberOrRange,
  whole: boolean = false,
  fixed: number = 2,
): number {
  range = getRangeFromNumberOrRange(range);

  if (range[0] === 0 && range[1] === 1) {
    if (whole === true) {
      return Math.floor(Math.random() * 2);
    } else {
      return parseFloat(Math.random().toFixed(fixed));
    }
  } else {
    const number = transform(Math.random(), 1, range, false);

    return parseInt(number.toFixed(0), 10);
  }
}

export function reciprocal(value: number): number {
  if (value != 0) {
    return 1 / value;
  } else {
    throw new Error('Num.reciprocal: Division by zero.');
  }
}

export function roundTo(value: number, to: number = 0): number {
  return parseFloat(value.toFixed(to));
}

export function sum(...values: number[]): number {
  return values.reduce((previous, current) => previous + current);
}

export function sumNumberArrays(...arrays: number[][]): number[] {
  const maxLength = Util.getMaxArraysLength(...arrays);

  const sum: number[] = [];

  for (let i = 0; i < maxLength; i++) {
    sum[i] = 0;

    arrays.forEach(array => {
      if (typeof array[i] === 'number') {
        sum[i] += array[i];
      }
    });
  }

  return sum;
}

// https://math.stackexchange.com/questions/377169/calculating-a-value-inside-one-range-to-a-value-of-another-range/377174
export function transform(
  value: number,
  from: NumberOrRange,
  to: NumberOrRange,
  clampResult: boolean = true,
): number {
  from = getRangeFromNumberOrRange(from);
  to = getRangeFromNumberOrRange(to);

  // Division by zero returns Infinite in JavaScript?
  let result = (value - from[0]) * ((to[1] - to[0]) / (from[1] - from[0])) + to[0];

  if (clampResult === true) {
    return clamp(result, to);
  }

  return result;
}

export function within(
  value: number,
  min: number,
  max: number,
  isExclusive?: boolean,
): boolean;

export function within(
  value: number,
  range: NumberOrRange,
  isExclusive?: boolean,
): boolean;

export function within(
  value: number,
  a: NumberOrRange,
  b?: number | boolean,
  c?: boolean,
): boolean {
  let range: RangeArray;

  let isExclusive = false;

  if (
    typeof a === 'number' && typeof b === 'number'
    && (typeof c === 'boolean' || typeof c === 'undefined')
  ) {
    if (typeof c === 'boolean') {
      isExclusive = c;
    }

    range = orderRangeArray([a, b]);
  } else if (
    isNumberOrRange(a) == true
    && (typeof b === 'boolean' || typeof b === 'undefined')
  ) {
    if (typeof b === 'boolean') {
      isExclusive = b;
    }

    range = getRangeFromNumberOrRange(a);
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

export function getRangeFromNumberOrRange(range: NumberOrRange): RangeArray {
  if (typeof range === 'number') {
    return [0, range];
  }

  return range;
}

function isNumberOrRange(thing: any): boolean {
  return typeof thing === 'number' || isRangeArray(thing);
}

function isRangeArray(thing: any): boolean {
  return (
    Array.isArray(thing) === true
    && thing.length === 2
    && thing.every(member => typeof member === 'number')
  );
}

function orderRangeArray(range: RangeArray): RangeArray {
  const min = Math.min(...range);
  const max = Math.max(...range);

  return [min, max];
}

/*
  * Below: Still in progress.
  */

// Snap value to an interval.
function snapToInterval(value: number, interval: number): number {
  return Math.round(value / interval) * interval;
}

export const Num = {
  average,
  clamp,
  cubicBezier,
  cycle,
  getEuclideanDistance,
  getSign,
  hypotenuse,
  lerp,
  random,
  reciprocal,
  roundTo,
  sum,
  sumNumberArrays,
  transform,
  within,
  getRangeFromNumberOrRange,
  isNumberOrRange,
  isRangeArray,
  orderRangeArray,
  snapToInterval,
}

export default Num;