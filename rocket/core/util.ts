import {
  Num,
} from '../rocket';

export class Util {
  public static cycleArray<A>(array: A[], offset: number): A {
    let index = offset % array.length;

    if (offset < 0) {
      let remainder = Math.abs(offset) % array.length;

      if (remainder === 0) {
        index = 0;
      } else {
        index = array.length + remainder * -1;
      }
    }

    return array[index];
  }

  public static cycleArrayNext<A>(array: A[]): Function {
    let index = -1;

    return function () {
      index++;

      if (index > array.length - 1) {
        index = 0;
      }

      return array[index];
    };
  }

  // Returns a debouncer function that no matter the frequency of calls
  // will only be invoked after the given delay times out (in seconds).
  public static debounce(func: Function, delayInSeconds: number): Function {
    let timeout;

    const delay = delayInSeconds * 1000;

    return function() {
      clearTimeout(timeout);

      timeout = setTimeout(
        () => func.apply(this, arguments),
        delay
      );
    };
  }

  public static isEmptyObject(object: any): boolean {
    return (
      this.isObject(object)
      && Object.keys(object).length < 1
    );
  }

  public static isObject(object: any): boolean {
    return (
      object !== null
      && typeof object === 'object'
    );
  }

  public static isPromise(...things: any[]): boolean {
    if (things.length === 0) {
      return false;
    }

    const isPromise = thing => {
      return (
        typeof thing === 'object'
        && typeof thing.then === 'function'
        && thing instanceof Promise
        && Promise.resolve(thing) === thing
      );
    }

    for (let i = 0; i < things.length; i++) {
      const thing = things[i];

      if (isPromise(thing) === false) {
        return false;
      }
    };

    return true;
  }
 
  public static promiseChain(...funcs: (() => Promise<void>)[]): Promise<void> {
    return new Promise((resolve, reject) => {
      let currentIndex = -1;

      const loop = () => {
        currentIndex++;

        if (typeof funcs[currentIndex] !== 'undefined') {
          funcs[currentIndex]()
            .then(() => loop())
            .catch(error => reject(error));
        } else {
          resolve();
        }
      }

      loop();
    });
  }

  public static promiseEach<A>(array: A[], func: (value: A) => Promise<void>): Promise<void> {
    if (array.length === 0) {
      return Promise.resolve();
    }

    return array.reduce(
      (previous: Promise<void>, current: A) => {
        return previous.then(() => func(current));
      },
      Promise.resolve(),
    );
  }

  public static randomChoice<A>(...choices: A[]): A {
    const index = Num.random(choices.length - 1, true);

    return choices[index];
  }

  public static throttle(func: Function, thresholdInSeconds: number): Function {
    let timeout;
    let last;

    const threshold = thresholdInSeconds * 1000;

    return function() {
      const now = Date.now();

      if (
        typeof last === 'number'
        && now < last + threshold
      ) {
        clearTimeout(timeout);

        timeout = setTimeout(
          () => {
            last = now;
            func.apply(this, arguments);
          },
          threshold
        );
      } else {
        last = now;

        func.apply(this, arguments);
      }
    };
  }

  public static truthChain(...funcs: (() => boolean)[]): boolean {
    let result = true;

    for (let i = 0; i < funcs.length; i++) {
      if (funcs[i]() === false) {
        result = false;

        break;
      }
    }

    return result;
  }

  // TODO: Rename this.
  public static fillArraysToLongestArray(filler: any, ...arrays: any[][]): number {
    const maxLength = this.getMaxArraysLength(arrays);

    arrays.forEach(array => {
      while (array.length < maxLength) {
        array.push(filler);
      }
    });

    return maxLength;
  }

  public static getMaxArraysLength(...arrays: any[][]): number {
    const lengths = arrays.map(array => array.length);

    return Math.max(...lengths);
  }

  public static getMinArraysLength(...arrays: any[][]): number {
    const lengths = arrays.map(array => array.length);

    return Math.min(...lengths);
  }

  public static sumArrays(...arrays: number[][]): number[] {
    const maxLength = this.fillArraysToLongestArray(0, ...arrays);

    const sum: number[] = [];

    for (let i = 0; i < maxLength; i++) {
      sum[i] = 0;

      arrays.forEach(array => {
        sum[i] = sum[i] + array[i];
      });
    }

    return sum;
  }
}
