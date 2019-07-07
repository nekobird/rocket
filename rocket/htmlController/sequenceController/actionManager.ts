import {
  StringUtil,
} from '../../rocket';

import {
  SequenceTriggerMap,
} from './config';

import {
  SequenceController,
} from './sequenceController';

export type SequenceActionName = 'previous' | 'next' | 'jump';

export interface SequenceAction {
  name: SequenceActionName;
  currentItem?: HTMLElement;
  nextItem?: HTMLElement;
  nextItemIndex?: number;
  nextItemId?: string;
  trigger?: HTMLElement;
}

export class ActionManager {
  private controller: SequenceController;

  public isRunning: boolean = false;
  public isNested: boolean = false;

  constructor(controller: SequenceController) {
    this.controller = controller;
  }

  private async completeAction(action: SequenceAction): Promise<void> {
    const { config, itemManager } = this.controller;
    const actionNameString = StringUtil.upperCaseFirstLetter(action.name);
    if (
      itemManager.activeItem !== action.nextItem
      && config[`condition${actionNameString}`](action, this) === true
    ) {
      await config.beforeDeactivate(action, this.controller);
      this.deactivate();
      await config.afterDeactivate(action, this.controller);
      await config.beforeActivate(action, this.controller);
      this.activate(action);
      await config.afterActivate(action, this.controller);
    }
    return Promise.resolve();
  }

  private deactivate(): this {
    const { config, itemManager } = this.controller;
    itemManager.items.forEach(item => config.deactivateItem(item, this.controller));
    itemManager.activeItem = undefined;
    itemManager.activeIndex = undefined;
    itemManager.isActive = false;
    return this;
  }

  private activate({nextItem, nextItemIndex}: SequenceAction): this {
    const { config, itemManager } = this.controller;
    if (typeof nextItem === 'object') {
      config.activateItem(nextItem, this.controller);
      itemManager.activeItem = nextItem;
      itemManager.activeIndex = nextItemIndex;
      itemManager.isActive = true;
    }
    return this;
  }

  private setActionTargetPrevious(action: SequenceAction): SequenceAction {
    const { itemManager } = this.controller;
    if (typeof itemManager.activeIndex === 'number') {
      let index: number;
      if (itemManager.activeIndex - 1 >= 0) {
        index = itemManager.activeIndex - 1;
      } else {
        index = itemManager.items.length - 1;
      }
      action.nextItem = itemManager.items[index];
      action.nextItemIndex = index;
    }
    return action;
  }

  private setActionTargetNext(action: SequenceAction): SequenceAction {
    const { itemManager } = this.controller;
    if (typeof itemManager.activeIndex === 'number') {
      let index: number;
      if (itemManager.activeIndex + 1 >= itemManager.items.length) {
        index = 0;
      } else {
        index = itemManager.activeIndex + 1;
      }
      action.nextItem = itemManager.items[index];
      action.nextItemIndex = index;
    }
    return action;
  }

  private setActionTargetJump(action: SequenceAction): SequenceAction {
    const { itemManager } = this.controller;
    if (typeof action.nextItemId === 'string') {
      const item = itemManager.getItemFromId(action.nextItemId);
      if (item !== false) {
        action.nextItem = item;
        action.nextItemIndex = itemManager.items.indexOf(action.nextItem);
      }
    }
    return action;
  }

  public createAction(actionName: SequenceActionName): SequenceAction {
    const { itemManager } = this.controller;
    return {
      name: actionName,
      currentItem: itemManager.activeItem,
    };
  }

  public composeAction(actionName: SequenceActionName, id?: string): SequenceAction {
    const action = this.createAction(actionName);
    if (typeof id === 'string')
      action.nextItemId = id;
    return action;
  }

  public composeActionFromTrigger(trigger: HTMLElement, triggerMap: SequenceTriggerMap): SequenceAction {
    const action = this.createAction(triggerMap.action);
    action.nextItemId = triggerMap.payload;
    action.trigger = trigger;
    return action;
  }

  public async actionHub(action: SequenceAction, isNestedAction: boolean = false): Promise<void> {
    if (this.isRunning === true && isNestedAction === true)
      this.isNested = true;

    this.isRunning = true;

    const actionNameString: string = StringUtil.upperCaseFirstLetter(action.name);
    this[`setActionTarget${actionNameString}`](action);

    const { config } = this.controller;

    let preAction: Promise<void>;
    if (this.isNested === false) {
      preAction = new Promise(resolve => {
        this.isNested = true;
        config.beforeAction(action, this.controller)
          .then(() => {
            this.isNested = false;
            resolve();
          })
          .catch(() => this.isNested = false);
      });
    } else {
      preAction = Promise.resolve();
    }

    try {
      await preAction;
      await this.completeAction(action);
      await this.endAction();
      if (isNestedAction === true && this.isNested === true)
        this.isNested = false;
      if (this.isNested === false)
        config.afterAction(action, this.controller);
    } catch {
      await this.endAction();
      return Promise.reject();
    }
  }

  public endAction(): Promise<void> {
    if (this.isNested === false) {
      return new Promise(resolve => {
        setTimeout(
          () => {
            this.isRunning = false;
            resolve();
          }, this.controller.config.cooldown
        );
      });
    }
    if (this.isRunning === false && this.isNested === true)
      this.isNested = false;
    return Promise.resolve();
  }
}
