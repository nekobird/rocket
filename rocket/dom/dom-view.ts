import {
  Viewport,
} from '../rocket';

export type DOMViewCornerNames = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type DOMViewEdgeNames = 'top' | 'bottom' | 'left' | 'right';

export type DOMViewEdgeAndCornerNames = DOMViewCornerNames | DOMViewEdgeNames;

export const DOMViewCornerNames: DOMViewCornerNames[] = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];

export const DOMViewEdgeNames: DOMViewEdgeNames[] = [
  'top',
  'bottom',
  'left',
  'right',
];

export const DOMViewEdgeAndCornerNames: DOMViewEdgeAndCornerNames[] = [
  ...DOMViewCornerNames,
  ...DOMViewEdgeNames,
];

export class DOMView {
  public static elementIsInView(element: HTMLElement): boolean {
    const { top, bottom, left, right } = element.getBoundingClientRect();

    if (
      left < 0
      || top  < 0
      || right  > Viewport.width
      || bottom > Viewport.height
    ) {
      return false;
    }

    return true;
  }

  public static elementIsClipping(
    element: HTMLElement,
    cornersOrEdges?: DOMViewEdgeAndCornerNames | DOMViewEdgeAndCornerNames[],
  ): DOMViewEdgeAndCornerNames | false {
    if (typeof cornersOrEdges === 'undefined') {
      cornersOrEdges = [...DOMViewEdgeAndCornerNames];
    }

    if (Array.isArray(cornersOrEdges) === false) {
      cornersOrEdges = [cornersOrEdges as DOMViewEdgeAndCornerNames];
    }

    cornersOrEdges = cornersOrEdges as DOMViewEdgeAndCornerNames[];

    const result = this.elementIsClippingCornerOrEdge(element);

    if (result === false) {
      return false;
    }

    if (cornersOrEdges.indexOf(result) === -1) {
      return false;
    }

    return result;
  }

  public static elementIsClippingEdge(element: HTMLElement): DOMViewEdgeNames | false {
    const { top, bottom, left, right } = element.getBoundingClientRect();

    if (left < 0) {
      return 'left';
    } else if (top < 0) {
      return 'top';
    } else if (right > Viewport.width) {
      return 'right';
    } else if (bottom > Viewport.height) {
      return 'bottom';
    }

    return false;
  }

  public static elementIsClippingCorner(element: HTMLElement): DOMViewCornerNames | false {
    const { top, bottom, left, right } = element.getBoundingClientRect();

    if (top < 0) {
      if (left < 0) {
        return 'top-left';
      }

      if (right > Viewport.width) {
        return 'top-right';
      }
    } else if (bottom > Viewport.height) {
      if (left < 0) {
        return 'bottom-left';
      }

      if (right > Viewport.width) {
        return 'bottom-right';
      }
    }

    return false;
  }

  public static elementIsClippingCornerOrEdge(
    element: HTMLElement,
  ): DOMViewEdgeAndCornerNames | false {
    const { top, bottom, left, right } = element.getBoundingClientRect();

    if (top < 0) {
      if (left < 0) {
        return 'top-left';
      }

      if (right > Viewport.width) {
        return 'top-right';
      }

      return 'top';
    } else if (bottom > Viewport.height) {
      if (left < 0) {
        return 'bottom-left';
      }

      if (right > Viewport.width) {
        return 'bottom-right';
      }

      return 'bottom';
    } else if (left < 0) {
      return 'left';
    } else if (right > Viewport.width) {
      return 'right';
    }

    return false;
  }
}
