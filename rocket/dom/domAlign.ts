import {
  Num,
  PointHelper,
} from '../rocket';

const validReferenceCornerNames = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const validReferenceEdgeNames = ['top', 'bottom', 'left', 'right'];
const validReferenceNames = ['center', ...validReferenceCornerNames, ...validReferenceEdgeNames];

export type referencePointCornerNames = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type referencePointEdgesNames = 'top' | 'left' | 'right' | 'bottom';
export type referencePointNames = 'center' | referencePointCornerNames | referencePointEdgesNames;

export interface AlignmentOffset {
  left: number;
  top: number;
}

export class DOMAlign {

  public static getElementOffset(element: HTMLElement, referencePoint: referencePointNames): AlignmentOffset {
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

  public static getOffsetFromTargeReferencePointToOrigin(
    target: HTMLElement,
    referencePoint: referencePointNames
  ) {
    const rect = target.getBoundingClientRect();
    const offset = this.getElementOffset(target, referencePoint);
    return {
      left: rect.left - offset.left,
      top : rect.top  - offset.top,
    }
  }

  public static getTargetAlignmentOffset(
    target: HTMLElement,
    targetReferencePoint: referencePointNames,
    anchor: HTMLElement,
    anchorReferencePoint: referencePointNames,
    relativeTo: 'viewport' | 'document' | HTMLElement | Window,
    offset: number = 0,
  ) {
    const targetOffset = this.getElementOffset(target, targetReferencePoint);
    const anchorOffset = this.getElementOffset(anchor, anchorReferencePoint);
    const targetOriginOffset = this.getOffsetFromTargeReferencePointToOrigin(target, targetReferencePoint);
    let left = targetOffset.left - anchorOffset.left + targetOriginOffset.left;
    let top  = targetOffset.top  - anchorOffset.top  + targetOriginOffset.top;
  }

  public static applyOffsetToAlignment(offset: number) {

  }

  public static transformOffsetRelativeTo(to: 'viewport' | 'document' | HTMLElement | Window) {
    
  }

  public static calculateCornerOffset(offset: number): number {
    return Math.cos(Math.PI/4) * offset;
  }
}