import {
  DOMScroll,
  DOMUtil,
  Num,
  Point,
  Util,
} from '../rocket';

const VALID_REFERENCE_CORNER_NAMES = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const VALID_REFERENCE_EDGE_NAMES = ['top', 'bottom', 'left', 'right'];
const VALID_REFERENCE_POINT_NAMES = ['center', ...VALID_REFERENCE_CORNER_NAMES, ...VALID_REFERENCE_EDGE_NAMES];

export type referencePointCornerNames = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type referencePointEdgesNames = 'top' | 'left' | 'right' | 'bottom';
export type ReferencePointNames = 'center' | referencePointCornerNames | referencePointEdgesNames;


const REFERENCE_POINT_ROTATION: ReferencePointNames[] = ['top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left'];

export interface AlignmentOffset {
  left: number;
  top: number;
}
export type OffsetRelation = 'viewport' | 'document' | HTMLElement;

export class DOMAlign {

  public static getTargetAlignment(
    target: HTMLElement,
    targetReferencePoint: ReferencePointNames,
    anchor: HTMLElement,
    anchorReferencePoint: ReferencePointNames,
    relativeTo: OffsetRelation = 'viewport',
  ): AlignmentOffset {
    const targetRect = target.getBoundingClientRect();
    const targetOffset = this.getElementOffset(target, targetReferencePoint);
    const anchorOffset = this.getElementOffset(anchor, anchorReferencePoint);
    const left = targetRect.left + anchorOffset.left - targetOffset.left;
    const top = targetRect.top + anchorOffset.top - targetOffset.top;
    return this.transformOffsetRelation({ left, top }, relativeTo);
  }

  public static getTargetAlignmentToPoint(
    target: HTMLElement,
    targetReferencePoint: ReferencePointNames,
    point: Point,
    relativeTo: OffsetRelation = 'viewport',
  ): AlignmentOffset {
    const targetRect = target.getBoundingClientRect();
    const targetOffset = this.getElementOffset(target, targetReferencePoint);
    const left = targetRect.left + point.x - targetOffset.left;
    const top = targetRect.top + point.y - targetOffset.top;
    return this.transformOffsetRelation({ left, top }, relativeTo);
  }

  public static getTargetAlignmentToView(
    target: HTMLElement,
    targetReferencePoint: ReferencePointNames,
    viewReferencePoint: ReferencePointNames,
    relativeTo: OffsetRelation = 'viewport',
  ) {
    const targetRect = target.getBoundingClientRect();
  }

  public static getComplementaryReferencePoint(
    referencePoint: ReferencePointNames
  ): ReferencePointNames {
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

  public static getReferencePointFromRotation(from: ReferencePointNames, offset: number): ReferencePointNames {
    if (from === 'center') return 'center';
    const fromIndex = REFERENCE_POINT_ROTATION.indexOf(from);
    return Util.cycleArray<ReferencePointNames>(REFERENCE_POINT_ROTATION, fromIndex + offset);
  }

  // This returns an offset based on element reference point and relative to viewport.
  public static getElementOffset(
    element: HTMLElement,
    referencePoint: ReferencePointNames
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

  // This returns an offset from element reference point to origin (top-left).
  public static getOffsetFromTargeReferencePointToOrigin(
    target: HTMLElement,
    referencePoint: ReferencePointNames
  ): AlignmentOffset {
    const rect = target.getBoundingClientRect();
    const offset = this.getElementOffset(target, referencePoint);
    return {
      left: rect.left - offset.left,
      top: rect.top - offset.top,
    };
  }

  // Transform offset relation to either document, viewport, or an element.
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

  // Apply spacing to offset..
  public static applySpacingToOffset(
    offset: AlignmentOffset,
    referencePoint: ReferencePointNames,
    spacing: number,
  ): AlignmentOffset {
    let left = offset.left, top = offset.top;
    if (referencePoint === 'center') {
      return { left, top };
    } else if (VALID_REFERENCE_CORNER_NAMES.indexOf(referencePoint) !== -1) {
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
