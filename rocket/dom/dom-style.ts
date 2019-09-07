import {
  DOMTraverse,
  DOMUtil,
  Num,
  StringUtil,
} from '../rocket';

export interface StyleObject {
  [key: string]: string | number;
}

// NOTE:
// You can remove style by setting it to null
// For example element.style.backgroundColor = null;

export class DOMStyle {
  public static getLineHeight(element: HTMLElement): number {
    const temp = document.createElement('div');

    temp.style.padding = '0';
    temp.style.visibility = 'none';

    temp.textContent = 'abcd';

    this.copyStylesFrom(
      element,
      [
        'font-family',
        'font-size',
        'line-height',
      ],
      temp,
    );

    let result;

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

  // @styles
  public static applyStyle(
    element: HTMLElement,
    styleObject: StyleObject,
  ): void

  public static applyStyle(
    styleObject: StyleObject,
    ...elements: HTMLElement[]
  ): void

  public static applyStyle(
    a: HTMLElement | StyleObject,
    b: HTMLElement | StyleObject,
    ...c: HTMLElement[]
  ): void {
    let elements = c;
    let styleObject;

    if (DOMUtil.isHTMLElement(a) === true) {
      elements.push(a as HTMLElement);
      styleObject = b as StyleObject;
    } else if (DOMUtil.isHTMLElement(b) === true) {
      styleObject = a as StyleObject;
      elements.push(b as HTMLElement);
    }

    Object.keys(styleObject).forEach(property => {
      let value = styleObject[property];

      const propertyName = StringUtil.kebabCaseToCamelCase(property);

      if (typeof value === 'number') {
        value = value.toString();
      }

      if (typeof value === 'string') {
        elements.forEach(element => element.style[propertyName] = value);
      }
    });
  }

  public static copyStylesFrom(
    from: HTMLElement,
    properties: string | string[],
    ...to: HTMLElement[]
  ): void {
    if (typeof properties === 'string') {
      properties = [properties];
    }

    const style = window.getComputedStyle(from);

    properties.forEach(property => {
      to.forEach(element => {
        property = StringUtil.kebabCaseToCamelCase(property);

        element.style[property] = style[property];
      });
    });
  }

  public static clearStyles(element: HTMLElement) {
    element.removeAttribute('style');
  }

  public static removeStyles(
    element: HTMLElement,
    properties: string | string[],
  ) {
    if (typeof properties === 'string') {
      properties = [properties];
    }

    properties.forEach(property => {
      property = StringUtil.kebabCaseToCamelCase(property);

      element.style.removeProperty(property);
    });
  }

  public static getStyleValue(
    element: HTMLElement,
    property: string,
    stringOnly: boolean = false,
  ): string | number {
    const style = window.getComputedStyle(element);

    property = StringUtil.kebabCaseToCamelCase(property);

    const value = style[property];

    if (stringOnly === false && value.match(/^[0-9]+/g) !== null) {
      return parseFloat(value);
    }

    return value;
  }

  public static getStyleValues(
    element: HTMLElement,
    properties: string | string[],
    stringOnly: boolean = false,
  ): StyleObject {
    if (typeof properties === 'string') {
      properties = [properties];
    }

    const style = window.getComputedStyle(element);

    const result = {};

    properties.forEach(property => {
      property = StringUtil.kebabCaseToCamelCase(property);

      const value = style[property];

      if (stringOnly === false && value.match(/^[0-9]+/g) !== null) {
        result[property] = parseFloat(value);
      } else {
        result[property] = value
      }
    });

    return result;
  }

  public static getBoxSizing(element: HTMLElement): string {
    return this.getStyleValue(element, 'box-sizing') as string;
  }

  // @font-size
  public static getFontSize(element: HTMLElement): number {
    return this.getStyleValue(element, 'font-size') as number;
  }

  public static setFontSize(
    element: HTMLElement,
    fontSize: number,
    unit: string = 'px',
  ): void {
    element.style.fontSize = `${fontSize}${unit}`;
  }

  public static getBaseFontSize(): number {
    const fontSize = window.getComputedStyle(document.documentElement).fontSize;

    if (
      typeof fontSize === 'string'
      && fontSize.match(/^[0-9]+/g) !== null
    ) {
      return parseFloat(fontSize);
    }

    return 16;
  }

  public static RemToPx(rem: number): number {
    return rem * this.getBaseFontSize();
  }

  public static getParentsMaxAnimationDuration(
    from: HTMLElement,
    withDelay: boolean = false,
  ): number {
    let durations: number[] = [];

    DOMTraverse.ascendFrom(
      from,
      element => {
        if (DOMUtil.isHTMLElement(element) === true) {
          const _element = element as HTMLElement;

          let duration;

          if (withDelay === true) {
            duration = this.getMaxAnimationDurationWithDelayInSeconds(_element);
          } else {
            duration = this.getMaxAnimationDurationInSeconds(_element);
          }

          durations.push(duration);
        }
      }
    );

    return Math.max(...durations);
  }

  public static getChildrenMaxAnimationDuration(
    from: HTMLElement,
    withDelay: boolean = false,
  ): number {
    let durations: number[] = [];

    DOMTraverse.descendFrom(
      from,
      element => {
        if (DOMUtil.isHTMLElement(element) === true) {
          const _element = element as HTMLElement;

          let duration;

          if (withDelay === true) {
            duration = this.getMaxAnimationDurationInSeconds(_element);
          } else {
            duration = this.getMaxAnimationDurationWithDelayInSeconds(_element);
          }

          durations.push(duration);
        }
      }
    );

    return Math.max(...durations);
  }

  public static getAnimationDurationsInSeconds(element: HTMLElement): number[] {
    const computedStyle = getComputedStyle(element);

    const value = computedStyle.animationDuration;

    if (!value) {
      return [0];
    }

    return value.split(',').map(duration => parseFloat(duration) * 1000);
  }

  public static getAnimationDelaysInSeconds(element: HTMLElement): number[] {
    const computedStyle = getComputedStyle(element);

    const value = computedStyle.animationDelay;

    if (!value) {
      return [0];
    }

    return value.split(',').map(delay => parseFloat(delay) * 1000);
  }

  public static getMaxAnimationDurationInSeconds(element: HTMLElement): number {
    return Math.max(...this.getAnimationDurationsInSeconds(element));
  }

  public static getMaxAnimationDelayInSeconds(element: HTMLElement): number {
    return Math.max(...this.getAnimationDelaysInSeconds(element));
  }

  public static getMaxAnimationDurationWithDelayInSeconds(element: HTMLElement): number {
    const delays = this.getAnimationDelaysInSeconds(element);
    const durations = this.getAnimationDurationsInSeconds(element);

    return Math.max(...Num.sumNumberArrays(delays, durations));
  }

  public static getTransitionDurationsInSeconds(element: HTMLElement): number[] {
    const computedStyle = getComputedStyle(element);

    const value = computedStyle.transitionDuration;

    if (!value) {
      return [0];
    }

    return value.split(',').map(duration => parseFloat(duration) * 1000);
  }

  public static getTransitionDelaysInSeconds(element: HTMLElement): number[] {
    const computedStyle = getComputedStyle(element);

    const value = computedStyle.transitionDelay;

    if (!value) {
      return [0];
    }

    return value.split(',').map(delay => parseFloat(delay) * 1000);
  }

  public static getMaxTransitionDurationInSeconds(element: HTMLElement): number {
    return Math.max(...this.getTransitionDurationsInSeconds(element));
  }

  public static getMaxTransitionDelayInSeconds(element: HTMLElement): number {
    return Math.max(...this.getTransitionDelaysInSeconds(element));
  }

  public static getMaxTransitionDurationWithDelayInSeconds(element: HTMLElement): number {
    const delays = this.getTransitionDelaysInSeconds(element);
    const durations = this.getTransitionDurationsInSeconds(element);

    return Math.max(...Num.sumNumberArrays(delays, durations));
  }
}
