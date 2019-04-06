import {
  Num,
} from '../Rocket'

export class Angle {

  static toDegrees(radians) {
    return radians * (180 / Math.PI)
  }

  static toRadians(degrees) {
    return degrees * (Math.PI / 180)
  }

  static deltaClockwise(from, to, direction = false) {
    let sign = 1
    let range = from - Math.PI

    if (range < 0) {
      let offset = Num.cycle(range, Math.PI * 2)
      if (
        to < from ||
        to >= offset
      ) {
        sign = -1
      }
    }
    else if (
      to < from &&
      to >= range
    ) {
      sign = -1
    }

    if (direction === false) {
      sign = 1
    }

    let result = 0

    if (from > to) {
      result = from - to
    }
    else if (to > from) {
      result = to - from
    }

    return result * sign
  }

  static deltaCounterclockwise(from, to, direction = false) {
    let sign = 1
    let range = from + Math.PI

    if (range > Math.PI * 2) {
      let offset = Num.cycle(range, Math.PI * 2)

      if (
        to > from ||
        to <= offset
      ) {
        sign = -1
      }
    }
    else if (
      to > from &&
      to <= range
    ) {
      sign = -1
    }

    if (direction === false) {
      sign = 1
    }

    let result = 0

    if (from > to) {
      result = from - to
    }
    else if (to > from) {
      result = to - from
    }

    return result * sign
  }

  static differenceClockwise(from, to) {
    let result = 0

    if (from > to) {
      result = (Math.PI * 2) - from + to
    }
    else if (to > from) {
      result = to - from
    }

    return result
  }


  static differenceCounterclockwise(from, to) {
    let result = 0

    if (from > to) {
      result = from - to
    }
    else if (to > from) {
      result = from + (Math.PI * 2) - to
    }

    return result
  }

}