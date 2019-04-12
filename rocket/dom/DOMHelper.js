export class DOMHelper {

  static getAnimationDuration(element) {
    let computedStyle = getComputedStyle(element)
    return parseInt(parseFloat(computedStyle.getPropertyValue('animation-duration')) * 1000)
  }

}