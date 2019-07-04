import {
  DOMUtil,
  Num,
} from '../rocket';

const validReferenceCornerNames = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const validReferenceEdgeNames = ['top', 'bottom', 'left', 'right'];
const validReferenceNames = ['center', ...validReferenceCornerNames, ...validReferenceEdgeNames];

export type referencePointCornerNames = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type referencePointEdgesNames = 'top' | 'left' | 'right' | 'bottom';
export type referencePointNames = 'center' | referencePointCornerNames | referencePointEdgesNames;

export interface AlignmentPosition {
  left: number;
  top: number;
}

export class DOMAlign {
  // This returns AlignmentPosition relative to viewport.
  public static getElementOffset(element: HTMLElement, referencePoint: referencePointNames): AlignmentPosition {
    const rect = element.getBoundingClientRect();
    let left = 0;
    let top  = 0;
    const leftCenter = rect.left + Num.getNumberLineDistance(rect.left, rect.right) / 2;
    const topCenter  = rect.top  + Num.getNumberLineDistance(rect.top, rect.bottom) / 2;
    switch(referencePoint) {
      case 'center': {
        left = leftCenter;
        top  = topCenter;
        break;
      }
      case 'top-left': {
        left = rect.left;
        top  = rect.top;
        break;
      }
      case 'top': {
        left = leftCenter;
        top  = rect.top;
        break;
      }
      case 'top-right': {
        left = rect.right;
        top  = rect.top;
        break;
      }
      case 'left': {
        left = rect.left;
        top  = topCenter;
        break;
      }
      case 'right': {
        left = rect.right;
        top  = topCenter;
        break;
      }
      case 'bottom-left': {
        left = rect.left;
        top  = rect.bottom;
        break;
      }
      case 'bottom': {
        left = leftCenter;
        top  = rect.bottom;
        break;
      }
      case 'bottom-right': {
        left = rect.right;
        top  = rect.bottom;
        break;
      }
    }
    return { left, top };
  }

  public static getTargetAlignmentPosition(
    target: HTMLElement,
    targetReferencePoint: referencePointNames,
    anchor: HTMLElement,
    anchorReferencePoint: referencePointNames,
    relativeTo: 'viewport' | 'document' | HTMLElement = 'viewport',
    spacing: number = 0,
  ) {
    const targetRect = target.getBoundingClientRect();
    const targetOffset = this.getElementOffset(target, targetReferencePoint);
    const anchorOffset = this.getElementOffset(anchor, anchorReferencePoint);
    const targetOriginOffset = this.getDeltaFromTargeReferencePointToOrigin(target, targetReferencePoint);
    let left = targetRect.left + anchorOffset.left - targetOffset.left;
    let top  = targetRect.top + anchorOffset.top - targetOffset.top;
    let offset = { left, top };
    offset = this.transformOffsetRelativeTo(offset, relativeTo);
    offset = this.applySpacingToOffset(offset, anchorReferencePoint, spacing);
    return offset;
  }

  public static getDeltaFromTargeReferencePointToOrigin(
    target: HTMLElement,
    referencePoint: referencePointNames
  ): AlignmentPosition {
    const rect = target.getBoundingClientRect();
    const offset = this.getElementOffset(target, referencePoint);
    return {
      left: rect.left - offset.left,
      top : rect.top  - offset.top,
    }
  }

  public static transformOffsetRelativeTo(
    offset: AlignmentPosition,
    to: 'viewport' | 'document' | HTMLElement
  ): AlignmentPosition {
    let left = offset.left;
    let top = offset.top;
    if (to === 'document') {
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop  = window.pageYOffset || document.documentElement.scrollTop;
      left = left + scrollLeft;
      top = top  + scrollTop;
    } else if (to === 'viewport') {
      left = left;
      top = top;
    } else if (DOMUtil.isHTMLElement(to) === true) {
      const target = to as HTMLElement;
      const rect = target.getBoundingClientRect();
      left = left - rect.left;
      top = top - rect.top;
    }
    return { left, top };
  }

  public static applySpacingToOffset(
    offset: AlignmentPosition,
    referencePoint: referencePointNames,
    spacing: number
  ): AlignmentPosition {
    let left = offset.left;
    let top = offset.top;
    if (referencePoint === 'center') {
      return { left, top };
    } else if (validReferenceCornerNames.indexOf(referencePoint) !== -1) {
      let cornerSpacing = this.calculateCornerSpacing(spacing);
      switch(referencePoint) {
        case 'top-left': {
          left = left - cornerSpacing;
          top = top - cornerSpacing;
          break;
        }
        case 'top-right': {
          left = left + cornerSpacing;
          top = top - cornerSpacing;
          break;
        }
        case 'bottom-left': {
          left = left - cornerSpacing;
          top = top + cornerSpacing;
          break;
        }
        case 'bottom-right': {
          left = left + cornerSpacing;
          top = top + cornerSpacing;
          break;
        }
      }
      return { left, top };
    } else {
      switch(referencePoint) {
        case 'top': {
          top = top - spacing;
          break;
        }
        case 'bottom': {
          top = top + spacing;
          break;
        }
        case 'left': {
          left = left - spacing;
          break;
        }
        case 'right': {
          left = left + spacing;
          break;
        }
      }
      return { left, top };
    }
  }

  public static calculateCornerSpacing(spacing: number): number {
    return Math.cos(Math.PI/4) * spacing;
  }
}