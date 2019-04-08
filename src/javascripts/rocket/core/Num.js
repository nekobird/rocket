export class Num {

  static average(numbers) {
    if (numbers.length < 2) {
      throw new Error('num.average expects at least 2 numbers')
    }

    return this.sum(numbers) / numbers.length
  }

  static constrain(number, range) {
    if (typeof range === 'number') {
      range = [0, range]
    }

    if (range[0] === range[1]) {
      return 0
    }

    let max = Math.max(range[0], range[1])
    let min = Math.min(range[0], range[1])

    if (number > max) {
      return max
    } else if (number < min) {
      return min
    } else {
      return number
    }
  }

  // Range can be a number or an array with two numbers [0, 10].
  static cycle(number, range) {
    if (typeof range === 'number') {
      range = [0, range]
    }

    let max = Math.max(range[0], range[1])
    let min = Math.min(range[0], range[1])

    if (max === 0 && min === 0) {
      return 0
    }

    let da = this.getNumberLineDistance(min, max)
    let db
    let c

    if (number > max) {
      db = this.getNumberLineDistance(number, max)
      c = db % da + min
      return c === min ? max : c
    } else if (number < min) {
      db = this.getNumberLineDistance(number, min)
      c = max - db % da
      return c === max ? min : c
    } else {
      return number
    }
  }

  // Get number-line distance between two numbers
  // For example (-4, -2) = 2, (-4, 5) = 9
  static getNumberLineDistance(a, b) {
    let min = Math.min(a, b)
    let max = Math.max(a, b)

    if (min < 0 && max < 0) {
      return Math.abs(min) - Math.abs(max)
    } else if (min < 0 && max >= 0) {
      return Math.abs(min) + max
    } else if (min >= 0 && max >= 0) {
      return max - min
    }
  }

  // A more efficient way to calculate hypotenuse.
  static hypotenuse(x, y) {
    // http://www.johndcook.com/blog/2010/06/02/whats-so-hard-about-finding-a-hypotenuse/
    let max = Math.max(Math.abs(x), Math.abs(y))
    let min = Math.min(Math.abs(x), Math.abs(y))

    if (max === 0) {
      max = 1
    }

    let n = min / max

    return max * Math.sqrt(1 + n * n)
  }

  // Get reciprocal of a number.
  static reciprocal(number) {
    return number != 0 ? 1 / number : undefined
  }

  static round(number, to) {
    to = typeof to === 'undefined' ? 0 : to
    return parseFloat(number.toFixed(to))
  }

  // Simple linear interpolation
  static lerp(from, to, t) {
    return (1 - t) * from + t * to
  }

  static modulate(number, from, to, constrain) {
    if (typeof from === 'number') {
      from = [0, from]
    }

    if (typeof to === 'number') {
      to = [0, to]
    }

    let percent = (number - from[0]) / (from[1] - from[0])
    let result

    if (to[1] > to[0]) {
      result = percent * (to[1] - to[0]) + to[0]
    } else {
      result = to[0] - (percent * (to[0] - to[1]))
    }

    return constrain === true ? Num.constrain(result, to) : result
  }

  static random(range, whole = false, fixed = 2) {
    if (typeof range === 'number') {
      range = [0, range]
    }

    if (
      range[0] === 0 &&
      range[1] === 1
    ) {
      if (whole === true) {
        return Math.random() > 0.5 ? 1 : 0
      } else {
        return parseFloat(Math.random().toFixed(fixed))
      }
    } else {
      let number = this.modulate(Math.random(), 1, range, false)

      return parseInt((number).toFixed(0))
    }
  }

  // Numbers are array
  static sum(numbers) {
    let sum = 0

    for (let number of numbers) {
      sum += number
    }

    return sum
  }

  static within(number, range) {
    if (typeof range === 'number') {
      range = [0, range]
    }

    return number >= range[0] && number <= range[1] ? true : false
  }

}