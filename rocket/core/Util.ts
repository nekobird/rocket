import {
  Num
} from '../Rocket'

export class Util {

  static cycle(array: any[]): Function {
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

    return function (...args) {
      clearTimeout(timeout)
      let context = this
      timeout = setTimeout(() => {
        fn.apply(context, args)
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

  static repeat(interval, fn) {
    return setInterval(fn, interval * 1000)
  }

  static stopRepeat(id) {
    clearInterval(id)
  }

  static match(string: string, _with: RegExp): string | RegExpMatchArray | false {
    let value = String(string).match(_with)
    if (value === null) {
      return false
    } else if (value.length === 1) {
      return value[0]
    }
    return value
  }

  static randomChoice(array) {
    let index = Num.random(array.length - 1, true)
    return array[index]
  }

  static throttle(threshold, fn) {
    let timeout
    let last

    threshold = 1000 * threshold

    return function () {
      let context = this
      let args = arguments
      let now = +new Date

      if (last && now < last + threshold) {
        clearTimeout(timeout)

        timeout = setTimeout(() => {
          last = now
          fn.apply(context, args)
        }, threshold)
      } else {
        last = now
        fn.apply(context, args)
      }
    }
  }

  static toHex(n) {
    return parseInt(n).toString(16).toUpperCase()
  }

}