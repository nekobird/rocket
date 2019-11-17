import {
  DOMScroll,
  DOMUtil,
  Num,
  Offset,
  Point,
  Util,
  Viewport,
} from '@/rocket';

export type DOMAlignOffsetReferenceCornerNames = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type DOMAlignOffsetReferenceEdgeNames = 'top' | 'left' | 'right' | 'bottom';

export type DOMAlignOffsetReferencePointNames = 'center' | DOMAlignOffsetReferenceCornerNames | DOMAlignOffsetReferenceEdgeNames;

export const DOMAlignOffsetReferenceCornerNames: DOMAlignOffsetReferenceCornerNames[] = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];

export const DOMAlignOffsetReferenceEdgeNames: DOMAlignOffsetReferenceEdgeNames[] = [
  'top',
  'bottom',
  'left',
  'right',
];

export const DOMAlignOffsetReferencePointNames: DOMAlignOffsetReferencePointNames[] = [
  'center',
  ...DOMAlignOffsetReferenceCornerNames,
  ...DOMAlignOffsetReferenceEdgeNames,
];

export const DOMAlignOffsetReferencePointRotation: DOMAlignOffsetReferencePointNames[] = [
  'top-left',
  'top',
  'top-right',
  'right',
  'bottom-right',
  'bottom',
  'bottom-left',
];

export type OffsetRelation = 'viewport' | 'document' | HTMLElement;

export class DOMAlignOffset {
  public static getTargetAlignment(
    target: HTMLElement,
    targetReferencePoint: DOMAlignOffsetReferencePointNames,
    anchor: HTMLElement,
    anchorReferencePoint: DOMAlignOffsetReferencePointNames,
    relativeTo: OffsetRelation = 'viewport',
  ): Offset {
    const targetRect = target.getBoundingClientRect();

    const targetOffset = this.getElementOffset(target, targetReferencePoint);
    const anchorOffset = this.getElementOffset(anchor, anchorReferencePoint);

    const left = targetRect.left + anchorOffset.left - targetOffset.left;
    const top = targetRect.top + anchorOffset.top - targetOffset.top;

    return this.transformOffsetRelativeTo({ left, top }, relativeTo);
  }

  public static getTargetAlignmentToPoint(
    target: HTMLElement,
    targetReferencePoint: DOMAlignOffsetReferencePointNames,
    point: Point,
    relativeTo: OffsetRelation = 'viewport',
  ): Offset {
    const targetRect = target.getBoundingClientRect();

    const targetOffset = this.getElementOffset(target, targetReferencePoint);

    const left = targetRect.left + point.x - targetOffset.left;
    const top = targetRect.top + point.y - targetOffset.top;

    return this.transformOffsetRelativeTo({ left, top }, relativeTo);
  }

  public static getTargetAlignmentToView(
    target: HTMLElement,
    targetReferencePoint: DOMAlignOffsetReferencePointNames,
    viewReferencePoint: DOMAlignOffsetReferencePointNames,
    relativeTo: OffsetRelation = 'viewport',
  ) {
    const targetRect = target.getBoundingClientRect();

    const targetOffset = this.getElementOffset(target, targetReferencePoint);

    const viewOffset = this.getViewOffset(viewReferencePoint);

    const left = targetRect.left + viewOffset.left - targetOffset.left;
    const top = targetRect.top + viewOffset.top - targetOffset.top;

    return this.transformOffsetRelativeTo({ left, top }, relativeTo);
  }

  public static getComplementaryReferencePoint(
    referencePoint: DOMAlignOffsetReferencePointNames,
  ): DOMAlignOffsetReferencePointNames {
    if (referencePoint === 'center') {
      return 'center';
    }

    switch (referencePoint) {
      case 'top-left': {
        return 'bottom-right';
      }

      case 'top': {
        return 'bottom';
      }

      case 'top-right': {
        return 'bottom-left';
      }

      case 'left': {
        return 'right';
      }

      case 'right': {
        return 'left';
      }

      case 'bottom-left': {
        return 'top-right';
      }

      case 'bottom': {
        return 'top';
      }

      case 'bottom-right': {
        return 'top-left';
      }
    }
  }

  public static getReferencePointFromRotation(
    from: DOMAlignOffsetReferencePointNames,
    offset: number,
  ): DOMAlignOffsetReferencePointNames {
    if (from === 'center') {
      return 'center';
    }

    const fromIndex = DOMAlignOffsetReferencePointRotation.indexOf(from);

    return Util.cycleArray<DOMAlignOffsetReferencePointNames>(
      DOMAlignOffsetReferencePointRotation,
      fromIndex + offset,
    );
  }

  // This returns an offset based on element reference point and relative to viewport.
  public static getElementOffset(
    element: HTMLElement,
    referencePoint: DOMAlignOffsetReferencePointNames,
  ): Offset {
    const rect = element.getBoundingClientRect();

    let left;
    let top;

    left = top = 0;

    const leftCenter = rect.left + Num.getEuclideanDistance(rect.left, rect.right) / 2;
    const topCenter = rect.top + Num.getEuclideanDistance(rect.top, rect.bottom) / 2;

    switch (referencePoint) {
      case 'center': {
        left = leftCenter;
        top = topCenter;

        break;
      }

      case 'top-left': {
        left = rect.left;
        top = rect.top;

        break;
      }

      case 'top': {
        left = leftCenter;
        top = rect.top;

        break;
      }

      case 'top-right': {
        left = rect.right;
        top = rect.top;

        break;
      }

      case 'left': {
        left = rect.left;
        top = topCenter;

        break;
      }

      case 'right': {
        left = rect.right;
        top = topCenter;

        break;
      }

      case 'bottom-left': {
        left = rect.left;
        top = rect.bottom;

        break;
      }

      case 'bottom': {
        left = leftCenter;
        top = rect.bottom;

        break;
      }

      case 'bottom-right': {
        left = rect.right;
        top = rect.bottom;

        break;
      }
    }

    return { left, top };
  }

  public static getViewOffset(referencePoint: DOMAlignOffsetReferencePointNames): Offset {
    let left = 0, top = 0;

    const leftCenter = Viewport.width / 2;
    const topCenter = Viewport.height / 2;

    switch (referencePoint) {
      case 'center': {
        left = leftCenter;
        top = topCenter;

        break;
      }

      case 'top-left': {
        break;
      }

      case 'top': {
        left = leftCenter;

        break;
      }

      case 'top-right': {
        left = Viewport.width;

        break;
      }

      case 'left': {
        top = topCenter;

        break;
      }

      case 'right': {
        left = Viewport.width;
        top = topCenter;

        break;
      }

      case 'bottom-left': {
        top = Viewport.height;

        break;
      }

      case 'bottom': {
        left = leftCenter;
        top = Viewport.height;

        break;
      }

      case 'bottom-right': {
        left = Viewport.width;
        top = Viewport.height;

        break;
      }
    }

    return { left, top };
  }

  // This returns an offset from element reference point to origin (top-left).
  public static getOffsetFromTargeReferencePointToOrigin(
    target: HTMLElement,
    referencePoint: DOMAlignOffsetReferencePointNames,
  ): Offset {
    const { left, top } = target.getBoundingClientRect();

    const offset = this.getElementOffset(target, referencePoint);

    return {
      left: left - offset.left,
      top: top - offset.top,
    };
  }

  // Transform offset relation to either document, viewport, or an element.
  public static transformOffsetRelativeTo(offset: Offset, to: OffsetRelation): Offset {
    let { left, top } = offset;

    if (to === 'document') {
      left = left + DOMScroll.scrollLeft;
      top = top + DOMScroll.scrollTop;
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
    offset: Offset,
    referencePoint: DOMAlignOffsetReferencePointNames,
    spacing: number,
  ): Offset {
    let { left, top } = offset;

    if (referencePoint === 'center') {
      return { left, top };
    } else if (
      DOMAlignOffsetReferenceCornerNames.indexOf(
        referencePoint as DOMAlignOffsetReferenceCornerNames,
      ) !== -1
    ) {
      let cornerSpacing = this.calculateCornerSpacing(spacing);

      switch (referencePoint) {
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
      switch (referencePoint) {
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
    return Math.cos(Math.PI / 4) * spacing;
  }
}
