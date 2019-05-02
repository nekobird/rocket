import {
  Num,
  Point,
} from '../rocket'

export class DOMHelper {

  public static onImageLoad(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img   = new Image()
      img.onerror = () => reject()
      img.onload  = () => resolve()
      img.src = src
    })
  }

  public static getOffsetFrom(target: HTMLElement, from: HTMLElement): Point {
    const targetRect: DOMRect | ClientRect = target.getBoundingClientRect()
    const fromRect  : DOMRect | ClientRect = from.getBoundingClientRect()
    const left: number = Num.getNumberLineDistance(targetRect.left, fromRect.left)
    const top : number = Num.getNumberLineDistance(targetRect.top , fromRect.top)
    return {
      left  : left,
      right : Num.getNumberLineDistance(targetRect.right, fromRect.right),
      top   : top,
      bottom: Num.getNumberLineDistance(targetRect.bottom, fromRect.bottom),
      x: left,
      y: top,
    }
  }

  public static getOffset(element: HTMLElement): Point {
    const rect = element.getBoundingClientRect()
    const scrollLeft: number = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop : number = window.pageYOffset || document.documentElement.scrollTop
    return {
      x: rect.left + scrollLeft,
      y: rect.top  + scrollTop,
    }
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
    const style: CSSStyleDeclaration = window.getComputedStyle(element)
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
    const style: CSSStyleDeclaration = window.getComputedStyle(element)
    const width: number =
      parseFloat(style['borderLeftWidth']) +
      parseFloat(style['borderRightWidth'])
    return width
  }

  public static getHorizontalPaddingWidth(element: HTMLElement): number {
    const style: CSSStyleDeclaration = window.getComputedStyle(element)
    const width: number =
      parseFloat(style['paddingLeft']) +
      parseFloat(style['paddingRight'])
    return width
  }

  public static getVerticalBorderHeight(element: HTMLElement): number {
    const style: CSSStyleDeclaration = window.getComputedStyle(element)
    const height: number =
      parseFloat(style['borderBottomWidth']) +
      parseFloat(style['borderTopWidth'])
    return height
  }

  public static getVerticalPaddingHeight(element: HTMLElement): number {
    const style: CSSStyleDeclaration = window.getComputedStyle(element)
    const height: number =
      parseFloat(style['paddingBottom']) +
      parseFloat(style['paddingTop'])
    return height
  }

  static getAnimationDuration(element: HTMLElement): number {
    const computedStyle: CSSStyleDeclaration = getComputedStyle(element)
    return parseFloat(
      computedStyle['animationDuration']
    ) * 1000
  }

  static getTransitionDuration(element: HTMLElement): number {
    const computedStyle: CSSStyleDeclaration = getComputedStyle(element)
    return parseFloat(
      computedStyle['transitionDuration']
    ) * 1000
  }

}