import {
  DOMStyle,
} from '../../rocket';

import {
  Sortable,
} from './sortable';

export interface ItemModel {
  item: HTMLElement;

  left: number;
  top: number;

  width: number;
  height: number;

  requireMove: boolean;
}

export class SortableTransition {
  public sortable: Sortable;

  public model?: ItemModel[];

  public isActive: boolean = false;

  public isMoving: boolean = false;
  public timeoutId
  public moveTarget;

  constructor(sortable: Sortable) {
    this.sortable = sortable;
  }

  // 1) Create initial model.
  public create(group: HTMLElement) {
    if (this.isActive === false) {
      const { elementManager, dummy } = this.sortable;
      const items = elementManager.getItemsFromGroup(group);
      this.model = [];
      items.forEach(item => {
        (this.model as ItemModel[]).push(
          this.createModelFromElement(item)
        );
      });
      const dummyElement = dummy.element;
      this.model.push(
        this.createModelFromElement(dummyElement as HTMLElement)
      );
      this.model.sort((a, b) => a.top - b.top);
      this.isActive = true;
    }
  }

  // 2) Everthing starts from here.
  public go(group: HTMLElement, target: HTMLElement, callback: Function) {
    if (this.isActive === false) {
      this.create(group);
      this.prepare();
    }
    clearTimeout(this.timeoutId);
    const targetModel = this.createTargetModelFromTarget(target);
    this.prepareTargetModel(targetModel);
    this.animate(group, targetModel, callback);
  }

  public createModelFromElement(element: HTMLElement) {
    return {
      item: element,

      left: element.offsetLeft,
      top: element.offsetTop,

      width: element.offsetWidth,
      height: element.offsetHeight,

      requireMove: false,
    };
  }

  // 3) Create targetModel
  public createTargetModelFromTarget(target: HTMLElement) {
    const { dummy } = this.sortable;
    if (typeof this.model !== 'undefined') {
      const targetModel = this.model.map(item => Object.assign({}, item));
      let targetIndex
      let dummyIndex
      targetModel.forEach((model, index) => {
        if (model.item === dummy.element) {
          dummyIndex = index;
        } else if (model.item === target) {
          targetIndex = index;
        }
      });
      const dummyModel = targetModel[dummyIndex];
      targetModel.splice(dummyIndex, 1);
      if (dummyIndex < targetIndex) {
        targetModel.splice(targetIndex - 1, 0, dummyModel);
      } else {
        targetModel.splice(targetIndex + 1, 0, dummyModel);
      }
      return targetModel;
    }
    return false;
  }

  public prepareTargetModel(targetModel) {
    if (
      this.isActive === true
      && typeof this.model !== 'undefined'
    ) {
      let left = this.model[0].left;
      let top  = this.model[0].top;
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

  // 2.5) Bake
  public bake(targetModel, group, callback) {
    console.log('bake');
    console.log(targetModel);
    targetModel.forEach(model => {
      if (group === model.item.parentElement) {
        group.removeChild(model.item);
      }
      group.appendChild(model.item);
    });
    console.log(group.children.length);
    // callback();
  }

  // 3) Prepare
  public prepare() {
    if (
      this.isActive === true
      && typeof this.model !== 'undefined'
    ) {
      this.model.forEach(item => {
        item.item.style.left   = `${item.left}px`;
        item.item.style.top    = `${item.top}px`;
        item.item.style.width  = `${item.width}px`;
        item.item.style.height = `${item.height}px`;
        item.item.style.zIndex = '0';
        item.item.style.position = 'absolute';
      });
    }
  }

  public animate(group, targetModel, callback) {
    if (
      this.isActive === true
      && typeof targetModel !== 'undefined'
    ) {
      callback();
      targetModel.forEach(model => {
        model.item.style.transitionDuration = '150ms';
        model.item.style.transitionTimingFunction = 'ease-out';
        model.item.style.left = `${model.left}px`;
        model.item.style.top  = `${model.top}px`;
      });
    }
  }

  public cleanup() {
    if (typeof this.model !== 'undefined') {
      this.model.forEach(item => {
        DOMStyle.clearStyles(item.item);
      });
    }
  }

  public destroy() {
    this.model = undefined;
    this.isActive = false;
  }
}
