import {
  getRandomInteger,
} from '~/global';

export function cycleArray<A>(array: A[], offset: number): A {
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

export function cycleArrayNext<A>(array: A[]): Function {
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
export function debounce(func: Function, delayInSeconds: number): Function {
  let timeout: number;

  const delay = delayInSeconds * 1000;

  return function() {
    clearTimeout(timeout);

    timeout = window.setTimeout(
      () => func.apply(this, arguments),
      delay
    );
  };
}

export function delay(callback: Function, delayInSeconds: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(
      () => {
        callback();
        resolve();
      },
      delayInSeconds * 1000
    );
  });
}

export function fillArraysToLargestLength(filler: unknown, ...arrays: unknown[][]): number {
  const maxLength = this.getMaxArraysLength(...arrays);

  arrays.forEach(array => {
    while (array.length < maxLength) {
      array.push(filler);
    }
  });

  return maxLength;
}

export function getMaxArraysLength(...arrays: unknown[][]): number {
  const lengths = arrays.map(array => array.length);

  return Math.max(...lengths);
}

export function getMinArraysLength(...arrays: unknown[][]): number {
  const lengths = arrays.map(array => array.length);

  return Math.min(...lengths);
}

export function isEmptyObject(object: any): boolean {
  return (
    this.isObject(object)
    && Object.keys(object).length < 1
  );
}

export function isObject(object: any): boolean {
  return (
    object !== null
    && typeof object === 'object'
  );
}

export function isPromise(...things: any[]): boolean {
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

export function promiseChain(...funcs: (() => Promise<void>)[]): Promise<void> {
  return new Promise((resolve, reject) => {
    let currentIndex = -1;

    const loop = () => {
      currentIndex++;

      if (typeof funcs[currentIndex] === 'function') {
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

export function promiseEach<A>(array: A[], func: (value: A) => Promise<void>): Promise<void> {
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

export function randomChoice<A>(...choices: A[]): A {
  const index = getRandomInteger(0, choices.length - 1);
  return choices[index];
}

export function sleep(timeInSeconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), timeInSeconds * 1000));
}

export function throttle(func: Function, thresholdInSeconds: number): Function {
  let timeout: number;
  let last: number;

  const threshold = thresholdInSeconds * 1000;

  return function() {
    const now = Date.now();

    if (typeof last === 'number' && now < last + threshold) {
      clearTimeout(timeout);

      timeout = window.setTimeout(
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

export function truthChain(...funcs: (() => boolean)[]): boolean {
  let result = true;

  for (let i = 0; i < funcs.length; i++) {
    if (funcs[i]() === false) {
      result = false;

      break;
    }
  }

  return result;
}

export const Util = {
  cycleArray,
  cycleArrayNext,
  debounce,
  delay,
  fillArraysToLargestLength,
  getMaxArraysLength,
  getMinArraysLength,
  isEmptyObject,
  isObject,
  isPromise,
  promiseChain,
  promiseEach,
  randomChoice,
  sleep,
  throttle,
  truthChain,
}

export default Util;