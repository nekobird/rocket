import {
  Num,
  Point,
  PointHelper,
} from '../rocket'

export interface StyleList {
  [key: string]: string | number   
}

export class DOMHelper {

  public static onImageLoad(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onerror = () => reject()
      img.onload = () => resolve()
      img.src = src
    })
  }

  public static getOffsetFrom(target: HTMLElement, from: HTMLElement): Point {
    const targetRect: DOMRect | ClientRect = target.getBoundingClientRect()
    const fromRect: DOMRect | ClientRect = from.getBoundingClientRect()
    const left: number = Num.getNumberLineDistance(targetRect.left, fromRect.left)
    const top: number = Num.getNumberLineDistance(targetRect.top , fromRect.top)
    return {
      left, top,
      right: Num.getNumberLineDistance(targetRect.right, fromRect.right),
      bottom: Num.getNumberLineDistance(targetRect.bottom, fromRect.bottom),
      x: left,
      y: top,
    }
  }

  // Get element offset relative to the document.
  public static getOffsetFromDocument(element: HTMLElement): Point {
    const rect = element.getBoundingClientRect()
    const scrollLeft: number = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop: number = window.pageYOffset || document.documentElement.scrollTop
    const left: number = rect.left + scrollLeft
    const top: number = rect.top + scrollTop
    return {
      left, top,
      right : rect.right + scrollLeft,
      bottom: rect.bottom + scrollTop,
      x: left,
      y: top,
    }
  }

  // Point is relative to viewport. (clientX, clientY)
  // Offset is relative to Point.
  public static getOffsetFromPoint(element: HTMLElement, { x, y }: Point): Point {
    const rect = element.getBoundingClientRect()
    return {
      x: Num.getNumberLineDistance(rect.left, x),
      y: Num.getNumberLineDistance(rect.top, y),
    }
  }

  public static elementIsBelowPoint(element: HTMLElement, { y }: Point, offset: number = 0) {
    const rect = element.getBoundingClientRect()
    return rect.top + offset < y
  }

  public static getDistanceFromPoint(element: HTMLElement, point: Point, fromCenter: boolean = false): number {
    const rect = element.getBoundingClientRect()
    if (fromCenter === true) {
      return PointHelper.getDistanceTo(
        {
          x: rect.left + (rect.width  / 2),
          y: rect.top  + (rect.height / 2)
        },
        point
      )
    }
    return PointHelper.getDistanceTo({ x: rect.left, y: rect.top }, point)
  }

  // @style

  public static applyStyle(element: HTMLElement, styles: StyleList) {
    Object.keys(styles).forEach(key => {
      const value: string = (typeof styles[key] === 'number') ? styles[key].toString() : <string>styles[key]      
      element.style[key] = value
    })
  }

  public static clearStyle(element: HTMLElement) {
    element.removeAttribute('style')
  }

  public static getStyleValue(element: HTMLElement, propertyName: string, isNumber: boolean = false): string | number {
    const style: CSSStyleDeclaration = window.getComputedStyle(element)
    const value = style[propertyName]
    return isNumber === true ? parseFloat(value) : value
  }

  public static getFontSize(element: HTMLElement): number {
    return <number>this.getStyleValue(element, 'fontSize', true)
  }

  public static setFontSize(element: HTMLElement, fontSize: number) {
    element.style.fontSize = `${fontSize}px`
  }

  public static getLineHeight(element: HTMLElement): number {
    const style: CSSStyleDeclaration = window.getComputedStyle(element)
    if (style.lineHeight !== null) {
      return parseFloat(style.lineHeight)
    }
    return 0
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
    if (element.textContent !== null) {
      return element.textContent
    }
    return ''
  }

  public static getHorizontalBorderWidths(element: HTMLElement) {
    const style: CSSStyleDeclaration = window.getComputedStyle(element)
    let { borderLeftWidth, borderRightWidth } = style
    const left  = borderLeftWidth  === null? 0 : parseFloat(borderLeftWidth)
    const right = borderRightWidth === null? 0 : parseFloat(borderRightWidth)
    return left + right
  }

  public static getHorizontalPaddings(element: HTMLElement): number {
    const style: CSSStyleDeclaration = window.getComputedStyle(element)
    let { paddingLeft, paddingRight } = style
    const left  = paddingLeft  === null? 0 : parseFloat(paddingLeft)
    const right = paddingRight === null? 0 : parseFloat(paddingRight)
    return left + right
  }

  public static getVerticalBorderWidths(element: HTMLElement): number {
    const style: CSSStyleDeclaration = window.getComputedStyle(element)
    const { borderTopWidth, borderBottomWidth } = style
    const top    = borderTopWidth    === null? 0 : parseFloat(borderTopWidth)
    const bottom = borderBottomWidth === null? 0 : parseFloat(borderBottomWidth)
    return top + bottom
  }

  public static getVerticalPaddings(element: HTMLElement): number {
    const style: CSSStyleDeclaration = window.getComputedStyle(element)
    const { paddingTop, paddingBottom } = style
    const top    = paddingTop    === null? 0 : parseFloat(paddingTop)
    const bottom = paddingBottom === null? 0 : parseFloat(paddingBottom)
    return top + bottom
  }

  public static getAnimationDuration(element: HTMLElement): number {
    const computedStyle: CSSStyleDeclaration = getComputedStyle(element)
    return parseFloat(computedStyle.animationDuration) * 1000
  }

  public static getTransitionDuration(element: HTMLElement): number {
    const computedStyle: CSSStyleDeclaration = getComputedStyle(element)
    return parseFloat(computedStyle.transitionDuration) * 1000
  }
}