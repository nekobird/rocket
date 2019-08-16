import {
  DOMTraverse,
} from '../rocket';

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

    temp.style.padding = '0';
    temp.style.visibility = 'none';

    temp.textContent = 'abcd';

    this.copyStylesFrom(element, ['fontSize', 'fontFamily', 'lineHeight'], temp);

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
  public static applyStyle(element: HTMLElement, styles: StyleList) {
    Object.keys(styles).forEach(property => {
      let value = styles[property]

      if (typeof value === 'number') {
        value = value.toString();
      }

      if (typeof value === 'string') {
        element.style[property] = value;
      }
    });
  }

  public static copyStylesFrom(
    from: HTMLElement,
    styleProperties: string | string[],
    ...to: HTMLElement[]
  ): void {
    if (typeof styleProperties === 'string') {
      styleProperties = [styleProperties];
    }

    const style = window.getComputedStyle(from);

    styleProperties.forEach(property => {
      to.forEach(element => {
        element.style[property] = style[property];
      });
    });
  }

  public static clearStyles(element: HTMLElement) {
    element.removeAttribute('style');
  }

  public static removeStyles(element: HTMLElement, styleProperties: string | string[]) {
    if (typeof styleProperties === 'string') {
      styleProperties = [styleProperties];
    }

    styleProperties.forEach(property => {
      element.style.removeProperty(property);
    });
  }

  public static getStyleValue(
    element: HTMLElement,
    styleProperty: string,
    isNumber: boolean = false,
  ): string | number {
    const style = window.getComputedStyle(element);

    const value = style[styleProperty];

    return isNumber === true ? parseFloat(value) : value;
  }

  public static getStyleValues(
    element: HTMLElement,
    styleProperties: string | string[],
  ): StyleValue {
    if (typeof styleProperties === 'string') {
      styleProperties = [styleProperties];
    }

    const style = window.getComputedStyle(element);

    const result = {};

    styleProperties.forEach(property => {
      result[property] = style[property];
    });

    return result;
  }

  // @font-size
  public static getFontSize(element: HTMLElement): number {
    return this.getStyleValue(element, 'fontSize', true) as number;
  }

  public static setFontSize(element: HTMLElement, fontSize: number) {
    element.style.fontSize = `${fontSize}px`;
  }

  public static getBaseFontSize(): number {
    const fontSize = window.getComputedStyle(document.documentElement).fontSize;

    if (
      typeof fontSize === 'string'
      && fontSize !== ''
    ) {
      return parseFloat(fontSize);
    }

    return 16;
  }

  public static RemToPx(rem: number): number {
    return rem * this.getBaseFontSize();
  }

  // @animation

  public static getAnimationDelay(element: HTMLElement): number {
    const computedStyle = getComputedStyle(element);

    const delay = computedStyle.animationDelay;

    if (delay === null || delay === '') {
      return 0;
    } else {
      return parseFloat(delay) * 1000;
    }
  }

  public static getAnimationDuration(element: HTMLElement): number {
    const computedStyle = getComputedStyle(element);

    const duration = computedStyle.animationDuration;

    if (duration === null || duration === '') {
      return 0;
    } else {
      return parseFloat(duration) * 1000;
    }
  }

  public static getParentsMaxAnimationDuration(
    from: HTMLElement,
    withDelay: boolean = false,
  ): number {
    let durations: number[] = [];

    DOMTraverse.ascendFrom(
      from,
      element => {
        let duration = this.getAnimationDuration(element);

        if (withDelay === true) {
          duration += this.getAnimationDelay(element);
        }

        durations.push(duration);
      },
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
        let duration = this.getAnimationDuration(element);

        if (withDelay === true) {
          duration += this.getAnimationDelay(element);
        }

        durations.push(duration);
      }
    );

    return Math.max(...durations);
  }

  public static getTransitionDuration(element: HTMLElement): number {
    const computedStyle = getComputedStyle(element);

    const duration = computedStyle.transitionDuration;

    if (duration === null || duration === '') {
      return 0;
    } else {
      return parseFloat(duration) * 1000;
    }
  }
}
