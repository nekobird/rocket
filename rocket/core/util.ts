import {
  Num
} from '../rocket'

interface UtilPromiseEachFn<A> {
  (value: A): Promise<void>
}

export class Util {

  static promiseEach<A>(array: A[], fn: UtilPromiseEachFn<A>): Promise<void> {
    if (array.length === 0) {
      return Promise.resolve()
    }
    return array.reduce(
      (previous: Promise<void>, current: A) => { 
        return previous.then(() => fn(current))
      },
      Promise.resolve()
    )
  }

  static cycle<A>(array: A[]): Function {
    let index: number = -1
    return () => {
      index++
      if (index > array.length - 1) {
        index = 0
      }
      return array[index]
    }
  }

  // Returns a debouncer function that no matter the frequency of calls
  // will only be invoked after the given delay timeout (in seconds).
  static debounce(delay: number, fn: Function): Function {
    let timeout: number
    return function() {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        fn.apply(this, arguments)
      }, 1000 * delay)
    }
  }

  // Delay given function call given number of second(s).
  static delay(time: number, fn: Function) {
    return setTimeout(fn, time * 1000)
  }

  static cancelDelay(id) {
    clearTimeout(id)
  }

  static repeat(interval: number, fn: Function) {
    return setInterval(fn, interval * 1000)
  }

  static stopRepeat(id) {
    clearInterval(id)
  }

  static match(string: string, _with: RegExp): string | RegExpMatchArray | false {
    const value = String(string).match(_with)
    if (value === null) {
      return false
    } else if (value.length === 1) {
      return value[0]
    }
    return value
  }

  static randomChoice<A>(array: A[]): any {
    const index = Num.random(array.length - 1, true)
    return array[index]
  }

  static throttle(threshold: number, fn: Function): Function {
    let timeout: number
    let last: number
    
    threshold = 1000 * threshold

    return function() {
      const now = Date.now()
      if (
        typeof last === 'number' &&
        now < last + threshold
      ) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          last = now
          fn.apply(this, arguments)
        }, threshold)
      } else {
        last = now
        fn.apply(this, arguments)
      }
    }
  }

  static toHex(n: string): string {
    return parseInt(n).toString(16).toUpperCase()
  }

}