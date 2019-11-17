import {
  Num,
} from '@/rocket';

export class Angle {
  public static toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  public static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  public static deltaClockwise(from: number, to: number, direction: boolean = false): number {
    let sign = 1;

    const range = from - Math.PI;

    if (range < 0) {
      const offset = Num.cycle(range, Math.PI * 2);

      if (to < from || to >= offset) {
        sign = -1;
      }
    } else if (to < from && to >= range) {
      sign = -1;
    }

    if (direction === false) {
      sign = 1;
    }

    let result = 0;

    if (from > to) {
      result = from - to;
    } else if (to > from) {
      result = to - from;
    }

    return result * sign;
  }

  public static deltaCounterclockwise(from: number, to: number, direction: boolean = false): number {
    let sign = 1;

    const range = from + Math.PI;

    if (range > Math.PI * 2) {
      const offset = Num.cycle(range, Math.PI * 2);

      if (to > from || to <= offset) {
        sign = -1;
      }
    } else if (to > from && to <= range) {
      sign = -1;
    }

    if (direction === false) {
      sign = 1;
    }

    let result = 0;

    if (from > to) {
      result = from - to;
    } else if (to > from) {
      result = to - from;
    }

    return result * sign;
  }

  public static differenceClockwise(from: number, to: number) {
    let result = 0;

    if (from > to) {
      result = Math.PI * 2 - from + to;
    } else if (to > from) {
      result = to - from;
    }

    return result;
  }

  public static differenceCounterclockwise(from: number, to: number) {
    let result = 0;

    if (from > to) {
      result = from - to;
    } else if (to > from) {
      result = from + Math.PI * 2 - to;
    }

    return result;
  }
}
