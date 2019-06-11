import {
  DOMPoint,
  DOMRect,
  DOMUtil,
  Point,
  PointHelper,
} from '../../rocket';

import {
  SortableList
} from './sortableList';

export class ActiveItem {
  public sortable: SortableList;

  public element?: HTMLElement;
  public pointToItemOffset?: Point;

  public currentGroup?: HTMLElement;
  public isActive: boolean = false;

  constructor(sortable: SortableList) {
    this.sortable = sortable;
  }

  public create(item: HTMLElement) {
    if (
      this.isActive === false
      && DOMUtil.isHTMLElement(item) === true
    ) {
      this.element = item;
      this.currentGroup = this.element.parentElement as HTMLElement;
      this.isActive = true;
    }
  }

  public setInitialPointToItemOffset({ x, y }: Point) {
    if (
      this.isActive === true
      && DOMUtil.isHTMLElement(this.element) === true
    ) {
      this.pointToItemOffset = DOMPoint.getElementOffsetFromPoint(
        this.element as HTMLElement, { x, y }
      );
    }
  }

  public move(pointer: Point) {
    if (this.isActive === true) {
      const { config } = this.sortable;
      this.updateCurrentGroup();
      const pointerToGroupOffset = DOMPoint.getElementOffsetFromPoint(
        this.currentGroup as HTMLElement,
        pointer,
      );

      const to = PointHelper.subtract(
        pointerToGroupOffset,
        this.pointToItemOffset as Point,
      );

      config.moveItem(this.element as HTMLElement, to, this.sortable);
    }
  }

  public updateCurrentGroup() {
    if (this.isActive === true) {
      const group = this.activeGroup;
      if (
        group !== false
        && group !== this.currentGroup
      ) {
        group.appendChild(this.element as HTMLElement);
        this.currentGroup = group;
      }
    }
  }

  public destroy() {
    if (
      this.isActive === true
      && DOMUtil.isHTMLElement(this.element)
    ) {
      this.element = undefined;
      this.isActive = false;
    }
  }

  public get activeGroup(): HTMLElement | false {
    const { isActive, elementManager } = this.sortable;
    const { groups } = elementManager;
    if (
      isActive === true
      && this.isActive === true
      && typeof groups === 'object'
      && Array.isArray(groups) === true
    ) {
      const areas: number[] = [];
      groups.forEach(group => {
        const area = DOMRect.getOverlappingAreaFromElements(
          this.element as HTMLElement,
          group
        );
        areas.push(area);
      });
      const index = areas.indexOf(Math.max(...areas))
      if (DOMUtil.isHTMLElement(groups[index]) == true) {
        return groups[index];
      }
    }
    return false;
  }
}
