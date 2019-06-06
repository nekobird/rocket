import {
  DOMStyle,
} from '../../rocket';

import {
  SortableList,
} from './sortableList';
import { DOMUtil } from '../../dom/domUtil';

export interface ItemModel {
  item: HTMLElement;

  left: number;
  top: number;

  width: number;
  height: number;
}

export interface TargetModel extends ItemModel {

}

// TODO: Add support 
export class SortableListTransition {
  public sortable: SortableList;

  public group?: HTMLElement;
  public baseModel?: ItemModel[];

  public isActive: boolean = false;
  public isAnimating: boolean = false;

  public transitionTimeout?: number;

  constructor(sortable: SortableList) {
    this.sortable = sortable;
  }

  // 1) Everything starts from here.
  public go(group: HTMLElement, target: HTMLElement, callback: Function) {
    if (
      this.isActive === false
      || (
        this.isActive === true
        && this.group !== group
      )
    ) {
      this.group = group;
      this.create();
      this.prepare();
    }

    if (this.isAnimating === false) {
      clearTimeout(this.transitionTimeout);
      this.resizeGroup();
      const targetModel = this.createTargetModel(target);
      if (targetModel !== false) {
        this.prepareTargetModel(targetModel);
        this.transition(targetModel, callback);
      }
    }
  }

  // 2) Create initial base model.
  public create() {
    if (
      this.isActive === false
      && typeof this.group === 'object'
    ) {
      const { elementManager, dummy } = this.sortable;
      this.baseModel = [];
      const items = elementManager.getItemsFromGroup(this.group);
      items.forEach(item => {
        (this.baseModel as ItemModel[]).push(
          this.createModelFromElement(item)
        );
      });
      // Add dummy element to base model.
      this.baseModel.push(
        this.createModelFromElement(dummy.element as HTMLElement)
      );
      this.baseModel.sort((a, b) => a.top - b.top);
      this.isActive = true;
    }
  }

  public createModelFromElement(element: HTMLElement): ItemModel {
    return {
      item: element,
      left: element.offsetLeft,
      top: element.offsetTop,
      width: element.offsetWidth,
      height: element.offsetHeight,
    };
  }

  public resizeGroup() {
    if (typeof this.group === 'object') {
      const { dummy, elementManager } = this.sortable;
      const items = elementManager.getItemsFromGroup(this.group);
      let height = DOMStyle.getTotalVerticalInnerSpace(this.group);
      items.forEach(item => {
        height += DOMStyle.getTotalVerticalDimension(item);
      });
      if (typeof dummy.element === 'object') {
        height += DOMStyle.getTotalVerticalDimension(dummy.element as HTMLElement);
      }
      const width  = this.group.offsetWidth;
      this.group.style.boxSizing = 'border-box';
      this.group.style.width = `100%`;
      this.group.style.maxWidth = `${width}px`;
      this.group.style.height = `${height}px`;
    }
  }

  // 3) Prepare group and items for transition.
  public prepare() {
    if (
      this.isActive === true
      && typeof this.baseModel === 'object'
    ) {
      this.baseModel.forEach(({ item, left, top, width, height }) => {
        item.style.boxSizing = 'border-box';
        item.style.left = `${left}px`;
        item.style.top  = `${top}px`;
        item.style.width  = `${width}px`;
        item.style.height = `${height}px`;
        item.style.zIndex = '0';
        item.style.position = 'absolute';
      });
    }
  }

  // 4) Create targetModel.
  public createTargetModel(target: HTMLElement | 'last'): TargetModel[] | false {
    const { dummy } = this.sortable;

    if (
      this.isActive === true
      && typeof this.baseModel !== 'undefined'
    ) {
      // Make a copy from base model.
      const targetModel = this.baseModel.map(item => Object.assign({}, item));

      const targetIndex = targetModel.findIndex(model => model.item === target);
      const dummyIndex = targetModel.findIndex(model => model.item === dummy.element);
      const dummyModel = targetModel[dummyIndex];

      // Remove dummy from target model.
      targetModel.splice(dummyIndex, 1);

      if (target === 'last') {
        // Append dummy model to the end.
        targetModel.push(dummyModel);
      } else {
        if (dummyIndex < targetIndex) {
          // Append dummy model before target with missing dummy index into account.
          targetModel.splice(targetIndex - 1, 0, dummyModel);
        } else {
          // Append dummy model before target.
          targetModel.splice(targetIndex, 0, dummyModel);
        }
      }

      return targetModel;
    }
    return false;
  }

  // 5) Set correct values and sort targetModel.
  public prepareTargetModel(targetModel: TargetModel[]) {
    if (
      this.isActive === true
      && typeof this.baseModel !== 'undefined'
    ) {
      let left = this.baseModel[0].left;
      let top  = this.baseModel[0].top;
      let previousVertical = 0;
      targetModel.forEach(model => {
        const vertical = DOMStyle.getTotalVerticalDimension(model.item);
        top = top + previousVertical;
        model.left = left;
        model.top  = top;
        previousVertical = vertical;
      });
      targetModel.sort((a, b) => a.top - b.top);
    }
  }

  // 6) Begin transition.
  public transition(targetModel: TargetModel[], callback: Function) {
    const { config } = this.sortable;
    if (
      this.isActive === true
      && typeof targetModel !== 'undefined'
    ) {
      this.isAnimating = true;
      targetModel.forEach(model => {
        model.item.style.transitionDuration = `${config.transitionDuration}ms`;
        model.item.style.transitionTimingFunction = config.transitionTimingFunction;
        model.item.style.left = `${model.left}px`;
        model.item.style.top = `${model.top}px`;
      });
      this.transitionTimeout = setTimeout(
        () => {
          callback();
          this.isAnimating = false;
        },
        config.transitionDuration
      );
    }
  }

  public cleanup() {
    if (DOMUtil.isHTMLElement(this.group) === true) {
      DOMStyle.clearStyles(this.group as HTMLElement);
    }
    if (typeof this.baseModel !== 'undefined') {
      this.baseModel.forEach(item => {
        DOMStyle.clearStyles(item.item);
      });
    }
  }

  public destroy() {
    this.group = undefined;
    this.baseModel = undefined;
    this.isActive = false;
  }
}
