import {
  ViewportModel,
} from '../rocket';

export const DOMViewCornerNames = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
export const DOMViewEdgeNames = ['top', 'bottom', 'left', 'right'];
export const DOMViewEdgeAndCornerNames = [...DOMViewCornerNames, ...DOMViewEdgeNames];

export type DOMViewCornerNames = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type DOMViewEdgeNames = 'top' | 'bottom' | 'left' | 'right';
export type DOMViewEdgeAndCornerNames = DOMViewCornerNames | DOMViewEdgeNames;

export class DOMView {

  public static elementIsInView(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    if (rect.left < 0) return false;
    if (rect.top < 0) return false;
    if (rect.bottom > ViewportModel.height) return false;
    if (rect.right > ViewportModel.width) return false;
    return true;
  }

  public static elementIsClipping(
    element: HTMLElement,
    cornersOrEdges: DOMViewEdgeAndCornerNames | DOMViewEdgeAndCornerNames[]
  ): DOMViewEdgeAndCornerNames | false {
    if (Array.isArray(cornersOrEdges) === false) cornersOrEdges = [cornersOrEdges as DOMViewEdgeAndCornerNames];
    cornersOrEdges = cornersOrEdges as DOMViewEdgeAndCornerNames[];
    const result = this.elementIsClippingCornerOrEdge(element);
    if (result === false) return false;
    if (cornersOrEdges.indexOf(result) === -1) return false;
    return result;
  }

  public static elementIsClippingEdge(element: HTMLElement): DOMViewEdgeNames | false {
    const rect = element.getBoundingClientRect();
    if (rect.top < 0) {
      return 'top';
    } else if (rect.bottom > ViewportModel.height) {
      return 'bottom';
    } else if (rect.left < 0) {
      return 'left';
    } else if (rect.right > ViewportModel.width) {
      return 'right';
    }
    return false;
  }

  public static elementIsClippingCorner(element: HTMLElement): DOMViewCornerNames | false {
    const rect = element.getBoundingClientRect();
    if (rect.top < 0) {
      if (rect.left < 0) return 'top-left';
      if (rect.right > ViewportModel.width) return 'top-right';
    } else if (rect.bottom > ViewportModel.height) {
      if (rect.left < 0) return 'bottom-left';
      if (rect.right > ViewportModel.width) return 'bottom-right';
    }
    return false;
  }

  public static elementIsClippingCornerOrEdge(element: HTMLElement): DOMViewEdgeAndCornerNames | false {
    const rect = element.getBoundingClientRect();
    if (rect.top < 0) {
      if (rect.left < 0) return 'top-left';
      if (rect.right > ViewportModel.width) return 'top-right';
      return 'top';
    } else if (rect.bottom > ViewportModel.height) {
      if (rect.left < 0) return 'bottom-left';
      if (rect.right > ViewportModel.width) return 'bottom-right';
      return 'bottom';
    } else if (rect.left < 0) {
      return 'left';
    } else if (rect.right > ViewportModel.width) {
      return 'right';
    }
    return false;
  }
}
