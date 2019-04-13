export class DOMHelper {

  static getAnimationDuration(element: HTMLElement): number {
    let computedStyle: CSSStyleDeclaration = getComputedStyle(element)
    return parseFloat(
      computedStyle.getPropertyValue('animation-duration')
    ) * 1000
  }

}