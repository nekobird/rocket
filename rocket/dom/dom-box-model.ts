// DOMBoxModel is helper function to get data on element box-model.
// Similar to: https://github.com/InlineManual/dom-box

import {
  DOMStyle,
} from '../rocket';

export class DOMBoxModel {
  public static getTotalHorizontalMargins(element: HTMLElement): number {
    const style = window.getComputedStyle(element);

    const { marginLeft, marginRight } = style;

    let left;
    let right;

    if (marginLeft === null || marginLeft === '' ) {
      left = 0;
    } else {
      left = parseFloat(marginLeft);
    }

    if (marginRight === null || marginRight === '' ) {
      right = 0;
    } else {
      right = parseFloat(marginRight);
    }

    return left + right;
  }

  public static getTotalVerticalMargins(element: HTMLElement): number {
    const style = window.getComputedStyle(element);

    const { marginTop, marginBottom } = style;

    let top;
    let bottom;

    if (marginTop === null || marginTop === '' ) {
      top = 0;
    } else {
      top = parseFloat(marginTop);
    }

    if (marginBottom === null || marginBottom === '' ) {
      bottom = 0;
    } else {
      bottom = parseFloat(marginBottom);
    }
  
    return top + bottom;
  }

  public static getTotalHorizontalBorderWidths(element: HTMLElement): number {
    const style = window.getComputedStyle(element);

    let { borderLeftWidth, borderRightWidth } = style;

    let left;
    let right;

    if (borderLeftWidth === null || borderLeftWidth === '' ) {
      left = 0;
    } else {
      left = parseFloat(borderLeftWidth);
    }

    if (borderRightWidth === null || borderRightWidth === '' ) {
      right = 0;
    } else {
      right = parseFloat(borderRightWidth);
    }

    return left + right;
  }

  public static getTotalVerticalBorderWidths(element: HTMLElement): number {
    const style = window.getComputedStyle(element);

    const { borderTopWidth, borderBottomWidth } = style;

    let top;
    let bottom;

    if (borderTopWidth === null || borderTopWidth === '' ) {
      top = 0;
    } else {
      top = parseFloat(borderTopWidth);
    }

    if (borderBottomWidth === null || borderBottomWidth === '' ) {
      bottom = 0;
    } else {
      bottom = parseFloat(borderBottomWidth);
    }

    return top + bottom;
  }

  public static getTotalHorizontalPaddings(element: HTMLElement): number {
    const style = window.getComputedStyle(element);

    let { paddingLeft, paddingRight } = style;

    let left;
    let right;

    if (paddingLeft === null || paddingLeft === '') {
      left = 0;
    } else {
      left = parseFloat(paddingLeft);
    }

    if (paddingRight === null || paddingRight === '') {
      right = 0;
    } else {
      right = parseFloat(paddingRight);
    }

    return left + right;
  }

  public static getTotalVerticalPaddings(element: HTMLElement): number {
    const style = window.getComputedStyle(element);

    const { paddingTop, paddingBottom } = style;

    let top;
    let bottom;

    if (paddingTop === null || paddingTop === '' ) {
      top = 0;
    } else {
      top = parseFloat(paddingTop);
    }

    if (paddingBottom === null || paddingBottom === '' ) {
      bottom = 0;
    } else {
      bottom = parseFloat(paddingBottom);
    }

    return top + bottom;
  }

  public static getTotalHorizontalInnerSpace(element: HTMLElement): number {
    if (DOMStyle.getBoxSizing(element) === 'border-box') {
      return this.getTotalHorizontalPaddings(element) + this.getTotalHorizontalBorderWidths(element);
    }

    return this.getTotalHorizontalPaddings(element);
  }

  public static getTotalVerticalInnerSpace(element: HTMLElement): number {
    if (DOMStyle.getBoxSizing(element) === 'border-box') {
      return this.getTotalVerticalPaddings(element) + this.getTotalVerticalBorderWidths(element);
    }

    return this.getTotalVerticalPaddings(element);
  }

  public static getTotalHorizontalOuterSpace(element: HTMLElement): number {
    if (DOMStyle.getBoxSizing(element) === 'content-box') {
      return this.getTotalHorizontalMargins(element) + this.getTotalHorizontalBorderWidths(element);
    }

    return this.getTotalHorizontalMargins(element);
  }

  public static getTotalVerticalOuterSpace(element: HTMLElement): number {
    if (DOMStyle.getBoxSizing(element) === 'content-box') {
      return this.getTotalVerticalMargins(element) + this.getTotalVerticalBorderWidths(element);
    }

    return this.getTotalVerticalMargins(element);
  }

  public static getTotalHorizontalDimension(
    element: HTMLElement,
    includeTransform: boolean = false,
  ): number {
    let width = element.offsetWidth;

    if (includeTransform === true) {
      width = element.getBoundingClientRect().width;
    }

    return width + this.getTotalHorizontalOuterSpace(element);
  }

  public static getTotalVerticalDimension(
    element: HTMLElement,
    includeTransform: boolean = false,
  ): number {
    let height = element.offsetHeight;
    
    if (includeTransform === true) {
      height = element.getBoundingClientRect().height;
    }

    return height + this.getTotalVerticalOuterSpace(element);
  }

  public static getContentWidth(element: HTMLElement): number {
    return element.offsetWidth - DOMBoxModel.getTotalHorizontalInnerSpace(element);
  }

  public static getContentHeight(element: HTMLElement): number {
    return element.offsetHeight - DOMBoxModel.getTotalVerticalInnerSpace(element);
  }
}
