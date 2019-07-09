import {
  MonoTriggerMap,
} from './config';

import {
  MonoController,  
} from './monoController';

export type MonoActionName = 'activate' | 'deactivate' | 'toggle';

export interface MonoAction {
  name: MonoActionName;
  currentItem?: HTMLElement;
  currentItemId?: string;
  nextItem?: HTMLElement;
  nextItemId?: string;
  targetId?: string;
  trigger?: HTMLElement;
}

export class ActionManager {
  private controller: MonoController;

  public isRunning: boolean = false;
  public isNested: boolean = false;

  constructor(controller: MonoController) {
    this.controller = controller;
  }

  private async activate(action: MonoAction): Promise<void> {
    const { config, itemManager } = this.controller;
    if (
      itemManager.isActive === false
      && itemManager.activeItem !== action.nextItem
      && config.conditionActivate(action, this.controller) === true
    ) {
      await config.beforeActivate(action, this.controller);
      itemManager.activate(<HTMLElement>action.nextItem);
      config.afterActivate(action, this.controller);
      return Promise.resolve();
    }
    return Promise.reject();
  }

  private async deactivate(action: MonoAction): Promise<void> {
    const { config, itemManager } = this.controller;
    if (itemManager.isActive === false) return Promise.resolve();
    if (
      action.name === 'deactivate'
      && typeof action.targetId === 'string'
      && itemManager.activeItemId !== action.targetId
    ) return Promise.resolve();

    if (config.conditionDeactivate(action, this.controller) === true) {
      await config.beforeDeactivate(action, this.controller);
      itemManager.deactivate();
      config.afterDeactivate(action, this.controller);
      return Promise.resolve();
    }
    return Promise.reject();
  }

  private async completeAction(action: MonoAction): Promise<void> {
    const { itemManager } = this.controller;
    if (
      action.name === 'activate'
      && itemManager.activeItemId !== action.targetId
    ) {
      await this.deactivate(action);
      return this.activate(action);
    } else if (action.name === 'deactivate') {
      return this.deactivate(action);
    } else if (action.name === 'toggle') {
      if (itemManager.activeItemId === action.targetId) {
        return this.deactivate(action);
      } else {
        await this.deactivate(action);
        return this.activate(action);
      }
    }
    return Promise.reject();
  }

  public createAction(actionName: MonoActionName): MonoAction {
    const { itemManager } = this.controller;
    return {
      name: actionName,
      currentItem: itemManager.activeItem,
      currentItemId: itemManager.activeItemId,
      nextItem: undefined,
      nextItemId: undefined,
      targetId: undefined,
      trigger: undefined,
    };
  }

  public composeAction(actionName: MonoActionName, id?: string): MonoAction {
    const { itemManager } = this.controller;

    const action = this.createAction(actionName);

    if (typeof id === 'string') {
      const nextItem = itemManager.getItemFromId(id);
      if (typeof nextItem === 'object') {
        action.nextItem = nextItem;
        action.nextItemId = id;
      }
      action.targetId = id;
    }
    return action;
  }

  public composeActionFromTrigger(trigger: HTMLElement, triggerMap: MonoTriggerMap): MonoAction {
    const action = this.composeAction(triggerMap.action, triggerMap.payload);
    action.trigger = trigger;
    return action;
  }

  public async actionHub(action: MonoAction, isNestedAction: boolean = false, callback?: Function): Promise<void> {
    if (this.isRunning === true && isNestedAction === true)
      this.isNested = true;

    this.isRunning = true;

    const { config } = this.controller;

    let preAction: Promise<void>;
    if (this.isNested === false) {
      preAction = new Promise(resolve => {
        this.isNested = true;
        config
          .beforeAction(action, this.controller)
          .then(() => {
            this.isNested = false;
            resolve();
          })
          .catch(() => this.isNested = false);
      })
    } else {
      preAction = Promise.resolve();
    }

    try {
      await preAction;
      await this.completeAction(action);
      await this.endAction(callback);
      if (
        isNestedAction === true
        && this.isNested === true
      ) this.isNested = false;
      if (this.isNested === false)
        config.afterAction(action, this.controller);
    } catch {
      await this.endAction(callback);
      return Promise.reject();
    }
  }

  public endAction(callback?: Function): Promise<void> {
    if (this.isNested === false)
      return new Promise(resolve => {
        setTimeout(
          () => {
            this.isRunning = false;
            resolve();
          }, this.controller.config.cooldown
        );
      });

    if (this.isRunning === false && this.isNested === true)
      this.isNested = false;

    if (typeof callback === 'function') callback();

    return Promise.resolve();
  }
}
