export interface StyleList {
  [key: string]: string | number;
}

export interface StyleValue {
  [key: string]: string;
}

export class DOMStyle {

  public static getLineHeight(element: HTMLElement): number {
    const temp = document.createElement('div')
    temp.style.padding = '0';
    temp.style.visibility = 'none';
    temp.textContent = 'abcd';
    this.copyStylesFrom(
      element,
      ['fontSize', 'fontFamily', 'lineHeight'],
      temp,
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
    return result;
  }

  public static applyStyle(element: HTMLElement, styles: StyleList) {
    Object.keys(styles).forEach(key => {
      const value = (typeof styles[key] === 'number') ? styles[key].toString() : <string>styles[key];
      element.style[key] = value;
    });
  }

  public static copyStylesFrom(from: HTMLElement, propertyNames: string | string[], ...to: HTMLElement[]): void {
    if (typeof propertyNames === 'string') {
      propertyNames = [propertyNames];
    }
    const style = window.getComputedStyle(from);
    propertyNames.forEach(property => {
      to.forEach(element => element.style[property] = style[property])
    });
  }

  public static removeStyles(element: HTMLElement, propertyNames: string | string[]) {
    if (typeof propertyNames === 'string') {
      propertyNames = [propertyNames];
    }
    propertyNames.forEach(propertyName => {
      element.style.removeProperty(propertyName);
    });
  }

  public static clearStyles(element: HTMLElement) {
    element.removeAttribute('style');
  }

  public static getStyleValues(element: HTMLElement, propertyNames: string | string[]): StyleValue {
    if (typeof propertyNames === 'string') {
      propertyNames = [propertyNames]
    }

    const style = window.getComputedStyle(element);
    const result = {};

    propertyNames.forEach(propertyName => {
      result[propertyName] = style[propertyName];
    });

    return result;
  }

  public static getStyleValue(element: HTMLElement, propertyName: string, isNumber: boolean = false): string | number {
    const style = window.getComputedStyle(element);
    const value = style[propertyName];

    return isNumber === true ? parseFloat(value) : value;
  }

  public static getFontSize(element: HTMLElement): number {
    return <number>this.getStyleValue(element, 'fontSize', true);
  }

  public static setFontSize(element: HTMLElement, fontSize: number) {
    element.style.fontSize = `${fontSize}px`;
  }

  public static getHorizontalBorderWidths(element: HTMLElement) {
    const style = window.getComputedStyle(element);

    let { borderLeftWidth, borderRightWidth } = style;

    const left = borderLeftWidth  === null? 0 : parseFloat(borderLeftWidth);
    const right = borderRightWidth === null? 0 : parseFloat(borderRightWidth);

    return left + right;
  }

  public static getHorizontalPaddings(element: HTMLElement): number {
    const style = window.getComputedStyle(element);

    let { paddingLeft, paddingRight } = style;

    const left = paddingLeft  === null? 0 : parseFloat(paddingLeft);
    const right = paddingRight === null? 0 : parseFloat(paddingRight);

    return left + right;
  }

  public static getVerticalBorderWidths(element: HTMLElement): number {
    const style = window.getComputedStyle(element);

    const { borderTopWidth, borderBottomWidth } = style;

    const top = borderTopWidth === null? 0 : parseFloat(borderTopWidth);
    const bottom = borderBottomWidth === null? 0 : parseFloat(borderBottomWidth);

    return top + bottom;
  }

  public static getVerticalPaddings(element: HTMLElement): number {
    const style = window.getComputedStyle(element);

    const { paddingTop, paddingBottom } = style;

    const top = paddingTop === null? 0 : parseFloat(paddingTop);
    const bottom = paddingBottom === null? 0 : parseFloat(paddingBottom);

    return top + bottom;
  }

  public static getAnimationDuration(element: HTMLElement): number {
    const computedStyle = getComputedStyle(element);
    return parseFloat(computedStyle.animationDuration) * 1000;
  }

  public static getTransitionDuration(element: HTMLElement): number {
    const computedStyle = getComputedStyle(element);
    return parseFloat(computedStyle.transitionDuration) * 1000;
  }
}