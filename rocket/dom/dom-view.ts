import {
  Viewport,
} from '@/rocket';

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

  public static getElementWidthInView(element: HTMLElement): number {  
    const rect = element.getBoundingClientRect();
    
    let { width } = rect;
  
    if (width === 0) {
      return 0;
    }
  
    if (rect.left < 0) {
      width = width + rect.left;
    }
  
    if (rect.right > Viewport.width) {
      width = width - (rect.right - Viewport.width);
    }
  
    return width;
  }
  
  public static getElementHeightInView(element: HTMLElement): number {  
    const rect = element.getBoundingClientRect();
    
    let { height } = rect;
  
    if (height === 0) {
      return 0;
    }

    if (rect.top < 0) {
      height = height + rect.top;
    }
  
    if (rect.bottom > Viewport.height) {
      height = height - (rect.bottom - Viewport.height);
    }
  
    return height;
  }

  public static getProportionOfElementWidthInView(element: HTMLElement): number {  
    const rect = element.getBoundingClientRect();
    
    const width = this.getElementWidthInView(element);
  
    return width / rect.width;
  }

  public static getProportionOfElementHeightInView(element: HTMLElement): number {
    const rect = element.getBoundingClientRect();
    
    const height = this.getElementHeightInView(element);
  
    return height / rect.height;
  }

  public static getProportionOfElementInView(element: HTMLElement): number {
    if (this.elementIsInView(element) === false) {
      return 0;
    }
  
    const rect = element.getBoundingClientRect();

    const width = this.getElementWidthInView(element);
    const height = this.getElementHeightInView(element);

    return (width * height) / (rect.width * rect.height);
  }

  public static elementIsClipping(
    element: HTMLElement,
    cornersOrEdges?: DOMViewEdgeAndCornerNames | DOMViewEdgeAndCornerNames[],
  ): DOMViewEdgeAndCornerNames | null {
    let _cornersOrEdges: DOMViewEdgeAndCornerNames[] = [];

    if (!cornersOrEdges) {
      _cornersOrEdges = [...DOMViewEdgeAndCornerNames];
    }

    if (Array.isArray(cornersOrEdges) === true) {
      _cornersOrEdges = cornersOrEdges as DOMViewEdgeAndCornerNames[];
    } else if (typeof cornersOrEdges === 'string') {
      _cornersOrEdges = [cornersOrEdges];
    }

    const result = this.elementIsClippingCornerOrEdge(element);

    if (
      result === null
      || _cornersOrEdges.indexOf(result) === -1
    ) {
      return null;
    }

    return result;
  }

  public static elementIsClippingEdge(element: HTMLElement): DOMViewEdgeNames | null {
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

    return null;
  }

  public static elementIsClippingCorner(element: HTMLElement): DOMViewCornerNames | null {
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

    return null;
  }

  public static elementIsClippingCornerOrEdge(
    element: HTMLElement,
  ): DOMViewEdgeAndCornerNames | null {
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

    return null;
  }
}
