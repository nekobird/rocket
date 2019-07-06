import {
  DOMScroll,
  DOMUtil,
  Num,
  Point,
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
export type OffsetRelation = 'viewport' | 'document' | HTMLElement;

export class DOMAlign {

  public static getTargetAlignment(
    target: HTMLElement,
    targetReferencePoint: referencePointNames,
    anchor: HTMLElement,
    anchorReferencePoint: referencePointNames,
    relativeTo: OffsetRelation = 'viewport',
    spacing: number = 0,
  ): AlignmentOffset {
    const targetRect = target.getBoundingClientRect();
    const targetOffset = this.getElementOffset(target, targetReferencePoint);
    const anchorOffset = this.getElementOffset(anchor, anchorReferencePoint);
    const left = targetRect.left + anchorOffset.left - targetOffset.left;
    const top = targetRect.top + anchorOffset.top - targetOffset.top;
    let offset = { left, top };
    offset = this.transformOffsetRelation(offset, relativeTo);
    if (spacing !== 0)
      offset = this.applySpacingToOffset(offset, anchorReferencePoint, spacing);
    return offset;
  }

  public static getTargetAlignmentToPoint(
    target: HTMLElement,
    targetReferencePoint: referencePointNames,
    point: Point,
    relativeTo: OffsetRelation = 'viewport',
    spacing: number = 0,
  ): AlignmentOffset {
    const targetRect = target.getBoundingClientRect();
    const targetOffset = this.getElementOffset(target, targetReferencePoint);
    const left = targetRect.left + point.x - targetOffset.left;
    const top = targetRect.top + point.y - targetOffset.top;
    let offset = { left, top };
    offset = this.transformOffsetRelation(offset, relativeTo);
    if (spacing !== 0) {
      const complementaryReferencePoint = this.getComplementaryReferencePoint(targetReferencePoint);
      offset = this.applySpacingToOffset(offset, complementaryReferencePoint, spacing);
    }
    return offset;
  }

  public static getComplementaryReferencePoint(
    referencePoint: referencePointNames
  ): referencePointNames {
    if (referencePoint === 'center') return 'center';
    switch(referencePoint) {
      case 'top-left':
        return 'bottom-right';
      case 'top':
        return 'bottom';
      case 'top-right':
        return 'bottom-left';
      case 'left':
        return 'right';
      case 'right':
        return 'left';
      case 'bottom-left':
        return 'top-right';
      case 'bottom':
        return 'top';
      case 'bottom-right':
        return 'top-left';
    }
  }

  // This returns AlignmentOffset relative to viewport.
  public static getElementOffset(
    element: HTMLElement,
    referencePoint: referencePointNames
  ): AlignmentOffset {
    const rect = element.getBoundingClientRect();
    let left = 0, top  = 0;
    const leftCenter = rect.left + Num.getEuclideanDistance(rect.left, rect.right) / 2;
    const topCenter  = rect.top  + Num.getEuclideanDistance(rect.top, rect.bottom) / 2;
    switch(referencePoint) {
      case 'center':
        left = leftCenter;
        top  = topCenter;
        break;
      case 'top-left':
        left = rect.left;
        top  = rect.top;
        break;
      case 'top':
        left = leftCenter;
        top  = rect.top;
        break;
      case 'top-right':
        left = rect.right;
        top  = rect.top;
        break;
      case 'left':
        left = rect.left;
        top  = topCenter;
        break;
      case 'right':
        left = rect.right;
        top  = topCenter;
        break;
      case 'bottom-left':
        left = rect.left;
        top  = rect.bottom;
        break;
      case 'bottom':
        left = leftCenter;
        top  = rect.bottom;
        break;
      case 'bottom-right':
        left = rect.right;
        top  = rect.bottom;
        break;
    }
    return { left, top };
  }

  public static getOffsetFromTargeReferencePointToOrigin(
    target: HTMLElement,
    referencePoint: referencePointNames
  ): AlignmentOffset {
    const rect = target.getBoundingClientRect();
    const offset = this.getElementOffset(target, referencePoint);
    return {
      left: rect.left - offset.left,
      top: rect.top - offset.top,
    };
  }

  public static transformOffsetRelation(
    offset: AlignmentOffset,
    to: OffsetRelation
  ): AlignmentOffset {
    let left = offset.left, top = offset.top;
    if (to === 'document') {
      left = left + DOMScroll.scrollLeft;
      top = top  + DOMScroll.scrollTop;
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
    offset: AlignmentOffset,
    referencePoint: referencePointNames,
    spacing: number,
  ): AlignmentOffset {
    let left = offset.left, top = offset.top;
    if (referencePoint === 'center') {
      return { left, top };
    } else if (validReferenceCornerNames.indexOf(referencePoint) !== -1) {
      let cornerSpacing = this.calculateCornerSpacing(spacing);
      switch(referencePoint) {
        case 'top-left':
          left = left - cornerSpacing;
          top = top - cornerSpacing;
          break;
        case 'top-right':
          left = left + cornerSpacing;
          top = top - cornerSpacing;
          break;
        case 'bottom-left':
          left = left - cornerSpacing;
          top = top + cornerSpacing;
          break;
        case 'bottom-right':
          left = left + cornerSpacing;
          top = top + cornerSpacing;
          break;
      }
      return { left, top };
    } else {
      switch(referencePoint) {
        case 'top':
          top = top - spacing;
          break;
        case 'bottom':
          top = top + spacing;
          break;
        case 'left':
          left = left - spacing;
          break;
        case 'right':
          left = left + spacing;
          break;
      }
      return { left, top };
    }
  }

  public static calculateCornerSpacing(spacing: number): number {
    return Math.cos(Math.PI/4) * spacing;
  }
}
