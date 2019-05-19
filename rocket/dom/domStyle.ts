export interface StyleList {
  [key: string]: string | number   
}

export class DOMStyle {
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