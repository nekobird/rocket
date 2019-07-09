export interface StyleList {
  [key: string]: string | number;
}

export interface StyleValue {
  [key: string]: string;
}

// NOTE:
// You can remove style by setting it to null
// For example element.style.backgroundColor = null;

export class DOMStyle {

  public static getLineHeight(element: HTMLElement): number {
    const temp = document.createElement('div');
    temp.style.padding    = '0';
    temp.style.visibility = 'none';
    temp.textContent      = 'abcd';
    this.copyStylesFrom(
      element, ['fontSize', 'fontFamily', 'lineHeight'], temp
    );
    let result: number;
    if (element.parentNode !== null) {
      element.parentNode.appendChild(temp);
      result = temp.clientHeight;
      element.parentNode.removeChild(temp);
    } else {
      document.appendChild(temp);
      result = temp.clientHeight;
      document.removeChild(temp);
    }
    temp.remove();
    return result;
  }

  // @style
  public static applyStyle(element: HTMLElement, styles: StyleList) {
    Object.keys(styles).forEach(property => {
      const value = (typeof styles[property] === 'number') ? styles[property].toString() : styles[property] as string;
      element.style[property] = value;
    });
  }

  public static copyStylesFrom(from: HTMLElement, styleProperties: string | string[], ...to: HTMLElement[]): void {
    if (typeof styleProperties === 'string') styleProperties = [styleProperties];
    const style = window.getComputedStyle(from);
    styleProperties.forEach(property => {
      to.forEach(element => element.style[property] = style[property])
    });
  }

  public static clearStyles(element: HTMLElement) {
    element.removeAttribute('style');
  }

  public static removeStyles(element: HTMLElement, styleProperties: string | string[]) {
    if (typeof styleProperties === 'string') styleProperties = [styleProperties];
    styleProperties.forEach(property => element.style.removeProperty(property));
  }

  public static getStyleValue(element: HTMLElement, styleProperty: string, isNumber: boolean = false): string | number {
    const style = window.getComputedStyle(element);
    const value = style[styleProperty];
    return isNumber === true ? parseFloat(value) : value;
  }

  public static getStyleValues(element: HTMLElement, styleProperties: string | string[]): StyleValue {
    if (typeof styleProperties === 'string') styleProperties = [styleProperties]
    const style = window.getComputedStyle(element);
    const result = {};
    styleProperties.forEach(property => result[property] = style[property]);
    return result;
  }

  // @fonts
  public static getFontSize(element: HTMLElement): number {
    return this.getStyleValue(element, 'fontSize', true) as number;
  }

  public static setFontSize(element: HTMLElement, fontSize: number) {
    element.style.fontSize = `${fontSize}px`;
  }

  // @border_widths
  public static getHorizontalBorderWidths(element: HTMLElement) {
    const style = window.getComputedStyle(element);
    let { borderLeftWidth, borderRightWidth } = style;
    const left  = (borderLeftWidth  === null || borderLeftWidth  === '') ? 0 : parseFloat(borderLeftWidth);
    const right = (borderRightWidth === null || borderRightWidth === '') ? 0 : parseFloat(borderRightWidth);
    return left + right;
  }

  public static getVerticalBorderWidths(element: HTMLElement): number {
    const style = window.getComputedStyle(element);
    const { borderTopWidth, borderBottomWidth } = style;
    const top    = (borderTopWidth    === null || borderTopWidth    === '') ? 0 : parseFloat(borderTopWidth);
    const bottom = (borderBottomWidth === null || borderBottomWidth === '') ? 0 : parseFloat(borderBottomWidth);
    return top + bottom;
  }

  // @paddings
  public static getHorizontalPaddings(element: HTMLElement): number {
    const style = window.getComputedStyle(element);
    let { paddingLeft, paddingRight } = style;
    const left  = (paddingLeft  === null || paddingLeft  === '') ? 0 : parseFloat(paddingLeft);
    const right = (paddingRight === null || paddingRight === '') ? 0 : parseFloat(paddingRight);
    return left + right;
  }

  public static getVerticalPaddings(element: HTMLElement): number {
    const style = window.getComputedStyle(element);
    const { paddingTop, paddingBottom } = style;
    const top    = (paddingTop    === null || paddingTop    === '') ? 0 : parseFloat(paddingTop);
    const bottom = (paddingBottom === null || paddingBottom === '') ? 0 : parseFloat(paddingBottom);
    return top + bottom;
  }

  // @margins
  public static getHorizontalMargins(element: HTMLElement): number {
    const style = window.getComputedStyle(element);
    const { marginLeft, marginRight } = style;
    const left  = (marginLeft  === null || marginLeft  === '') ? 0 : parseFloat(marginLeft);
    const right = (marginRight === null || marginRight === '') ? 0 : parseFloat(marginRight);
    return left + right;
  }

  public static getVerticalMargins(element: HTMLElement): number {
    const style = window.getComputedStyle(element);
    const { marginTop, marginBottom } = style;
    const top    = (marginTop    === null || marginTop    === '') ? 0 : parseFloat(marginTop);
    const bottom = (marginBottom === null || marginBottom === '') ? 0 : parseFloat(marginBottom);
    return top + bottom;
  }

  // @inner_area
  public static getTotalHorizontalInnerSpace(element: HTMLElement): number {
    if (this.getStyleValue(element, 'box-sizing') === 'border-box')
      return this.getHorizontalPaddings(element) + this.getHorizontalBorderWidths(element);
    return this.getHorizontalPaddings(element);
  }

  public static getTotalVerticalInnerSpace(element: HTMLElement): number {
    if (this.getStyleValue(element, 'box-sizing') === 'border-box')
      return this.getVerticalPaddings(element) + this.getVerticalBorderWidths(element);
    return this.getVerticalPaddings(element);
  }

  // @outer_area
  public static getTotalHorizontalOuterSpace(element: HTMLElement): number {
    if (this.getStyleValue(element, 'box-sizing') !== 'border-box')
      return this.getHorizontalMargins(element) + this.getHorizontalBorderWidths(element);
    return this.getHorizontalMargins(element);
  }

  public static getTotalVerticalOuterSpace(element: HTMLElement): number {
    if (this.getStyleValue(element, 'box-sizing') !== 'border-box')
      return this.getVerticalMargins(element) + this.getVerticalBorderWidths(element);
    return this.getVerticalMargins(element);
  }

  // @dimension
  public static getTotalHorizontalDimension(element: HTMLElement): number {
    return element.offsetWidth + this.getTotalHorizontalOuterSpace(element);
  }

  public static getTotalVerticalDimension(element: HTMLElement): number {
    return element.offsetHeight + this.getTotalVerticalOuterSpace(element);
  }

  // @animation
  public static getAnimationDuration(element: HTMLElement): number {
    const computedStyle = getComputedStyle(element);
    const duration = computedStyle.animationDuration;
    return (duration === null || duration === '') ? 0 : parseFloat(duration) * 1000;
  }

  public static getTransitionDuration(element: HTMLElement): number {
    const computedStyle = getComputedStyle(element);
    const duration = computedStyle.transitionDuration;
    return (duration === null || duration === '') ? 0 : parseFloat(duration) * 1000;
  }
}
