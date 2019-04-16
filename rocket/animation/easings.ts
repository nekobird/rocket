export class Easings {

  static QuadEaseIn(t: number): number {
    return t * t
  }

  static QuadEaseOut(t: number): number {
    return -1 * t * (t - 2)
  }

  static QuadEaseInEaseOut(t: number): number {
    t /= 0.5
    if (t < 1) {
      return 0.5 * t * t
    }
    t--
    return -0.5 * (t * (t - 2) - 1)
  }

  static CubicEaseIn(t: number): number {
    return t * t * t
  }

  static CubicEaseOut(t: number): number {
    t--
    return t * t * t + 1
  }

  static CubicEaseInEaseOut(t: number): number {
    t /= 0.5
    if (t < 1) {
      return 0.5 * t * t * t
    }
    t -= 2
    return 0.5 * (t * t * t + 2)
  }

  static QuarticEaseIn(t: number): number {
    return t * t * t * t
  }

  static QuarticEaseOut(t: number): number {
    t--
    return -1 * (t * t * t * t - 1)
  }

  static QuarticEaseInEaseOut(t: number): number {
    t /= 0.5
    if (t < 1) {
      return 0.5 * t * t * t * t
    }
    t -= 2
    return -0.5 * (t * t * t * t - 2)
  }

  static EaseOutElastic(t: number, p: number = 0.3): number {
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1
  }

}