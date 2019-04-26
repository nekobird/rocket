import {
  Vector2,
} from '../rocket'

export class DOMHelper {

  public static elementOffset(element: HTMLElement): Vector2 {
    const rect = element.getBoundingClientRect()
    const scrollLeft: number = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop: number = window.pageYOffset || document.documentElement.scrollTop
    return new Vector2(
      rect.left + scrollLeft,
      rect.top + scrollTop
    )
  }

  // ELEMENT

  public static getStyleValue(element: HTMLElement, propertyName: string, isNumber: boolean = false): number | string {
    const style: CSSStyleDeclaration = window.getComputedStyle(element)
    const value = style[propertyName]
    return isNumber === true ? parseFloat(value) : value
  }

  public static getFontSize(element: HTMLElement): number {
    return <number>this.getStyleValue(element, 'fontSize', true)
  }

  public setFontSize(element: HTMLElement, fontSize: number): DOMHelper {
    element.style.fontSize = `${fontSize}px`
    return this
  }

  public static getLineHeight(element: HTMLElement): number {
    let style: CSSStyleDeclaration = window.getComputedStyle(element)
    return parseFloat(style['lineHeight'])
  }

  public static getText(element: HTMLElement): string {
    if (
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLInputElement ||
      element.nodeName === 'INPUT' ||
      element.nodeName === 'TEXTAREA'
    ) {
      return (<HTMLTextAreaElement | HTMLInputElement>element).value
    }
    return element.textContent
  }

  public static getHorizontalBorderWidth(element: HTMLElement) {
    let style: CSSStyleDeclaration = window.getComputedStyle(element)
    let width: number =
      parseFloat(style['borderLeftWidth']) +
      parseFloat(style['borderRightWidth'])
    return width
  }

  public static getHorizontalPaddingWidth(element: HTMLElement): number {
    let style: CSSStyleDeclaration = window.getComputedStyle(element)
    let width: number =
      parseFloat(style['paddingLeft']) +
      parseFloat(style['paddingRight'])
    return width
  }

  public static getVerticalBorderHeight(element: HTMLElement): number {
    let style: CSSStyleDeclaration = window.getComputedStyle(element)
    let height: number =
      parseFloat(style['borderBottomWidth']) +
      parseFloat(style['borderTopWidth'])
    return height
  }

  public static getVerticalPaddingHeight(element: HTMLElement): number {
    let style: CSSStyleDeclaration = window.getComputedStyle(element)
    let height: number =
      parseFloat(style['paddingBottom']) +
      parseFloat(style['paddingTop'])
    return height
  }

  static getAnimationDuration(element: HTMLElement): number {
    let computedStyle: CSSStyleDeclaration = getComputedStyle(element)
    return parseFloat(
      computedStyle['animationDuration']
    ) * 1000
  }

}