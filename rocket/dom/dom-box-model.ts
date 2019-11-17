// DOMBoxModel is helper function to get data on element box-model.
// Similar to: https://github.com/InlineManual/dom-box

import {
  DOMStyle,
} from '@/rocket';

export class DOMBoxModel {
  public static getTotalHorizontalMargins(element: HTMLElement): number {
    const style = window.getComputedStyle(element);

    const { marginLeft, marginRight } = style;

    const left = marginLeft ? parseFloat(marginLeft) : 0;
    const right = marginRight ? parseFloat(marginRight) : 0;

    return left + right;
  }

  public static getTotalVerticalMargins(element: HTMLElement): number {
    const style = window.getComputedStyle(element);

    const { marginTop, marginBottom } = style;

    const top = marginTop ? parseFloat(marginTop) : 0;
    const bottom = marginBottom ? parseFloat(marginBottom) : 0;

    return top + bottom;
  }

  public static getTotalHorizontalBorderWidths(element: HTMLElement): number {
    const style = window.getComputedStyle(element);

    const { borderLeftWidth, borderRightWidth } = style;

    const left = borderLeftWidth ? parseFloat(borderLeftWidth) : 0;
    const right = borderRightWidth ? parseFloat(borderRightWidth) : 0;

    return left + right;
  }

  public static getTotalVerticalBorderWidths(element: HTMLElement): number {
    const style = window.getComputedStyle(element);

    const { borderTopWidth, borderBottomWidth } = style;

    const top = borderTopWidth ? parseFloat(borderTopWidth) : 0;
    const bottom = borderBottomWidth ? parseFloat(borderBottomWidth) : 0;

    return top + bottom;
  }

  public static getTotalHorizontalPaddings(element: HTMLElement): number {
    const style = window.getComputedStyle(element);

    const { paddingLeft, paddingRight } = style;

    const left = paddingLeft ? parseFloat(paddingLeft) : 0;
    const right = paddingRight ? parseFloat(paddingRight) : 0;

    return left + right;
  }

  public static getTotalVerticalPaddings(element: HTMLElement): number {
    const style = window.getComputedStyle(element);

    const { paddingTop, paddingBottom } = style;

    const top = paddingTop ? parseFloat(paddingTop) : 0;
    const bottom = paddingBottom ? parseFloat(paddingBottom) : 0;

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
