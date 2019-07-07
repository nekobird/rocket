import {
  PolyTriggerMap,
} from './config';

import {
  PolyController,
} from './polyController';

export type PolyActionName =
  'activate' | 'activate-all' | 'deactivate' |
  'deactivate-all' | 'toggle' | 'toggle-all';

export interface PolyAction {
  name: PolyActionName;
  targetItem?: HTMLElement;
  targetId?: string;
  trigger?: HTMLElement;
}

export class ActionManager {
  private controller: PolyController;

  public isRunning: boolean = false;
  public isNested: boolean = false;

  constructor(controller: PolyController) {
    this.controller = controller;
  }

  private activateItem({ targetItem }: PolyAction) {
    if (typeof targetItem === 'object')
      this.controller.itemManager.activate(targetItem);
  }

  private deactivateItem({ targetItem }: PolyAction) {
    if (typeof targetItem === 'object')
      this.controller.itemManager.deactivate(targetItem);
  }

  private async handleActionActivate(action: PolyAction): Promise<void> {
    const { config } = this.controller;
    if (
      typeof action.targetItem === 'object'
      && config.itemIsActive(action.targetItem, this.controller) === false
      && config.conditionActivate(action, this.controller) === true
    ) {
      await config.beforeActivate(action, this.controller);
      this.activateItem(action);
      config.afterActivate(action, this.controller);
      return Promise.resolve();
    }
    return Promise.reject();
  }

  private async handleActionDeactivate(action: PolyAction): Promise<void> {
    const { config } = this.controller;
    if (
      typeof action.targetItem === 'object'
      && config.itemIsActive(action.targetItem, this.controller) === true
      && config.conditionDeactivate(action, this.controller) === true
    ) {
      await config.beforeDeactivate(action, this.controller);
      this.deactivateItem(action);
      config.afterDeactivate(action, this.controller);
      return Promise.resolve();
    }
    return Promise.reject();
  }

  private handleActionToggle(action: PolyAction): Promise<void> {
    const { config } = this.controller;
    if (config.conditionToggle(action, this.controller) === true) {
      if (
        typeof action.targetItem === 'object'
        && config.itemIsActive(action.targetItem, this.controller) === false
      ) {
        return this.handleActionActivate(action);
      } else {
        return this.handleActionDeactivate(action);
      }
    }
    return Promise.resolve();
  }

  private handleActionActivateAll(action: PolyAction): Promise<void> {
    const { config, itemManager } = this.controller;
    if (
      config.conditionActivateAll(action, this.controller) === true
      && itemManager.items.length > 0
    ) {
      const actionPromises: Promise<void>[] = [];
      itemManager.items.forEach(item => {
        if (config.itemIsActive(item, this.controller) === false) {
          const subAction: PolyAction = Object.assign({
            targetItem: item,
            targetId: config.getItemId(item),
          }, action);
          actionPromises.push(this.handleActionActivate(subAction));
        }
      });
      return Promise
        .all(actionPromises)
        .then(() => Promise.resolve());
    }
    return Promise.reject();
  }

  private handleActionDeactivateAll(action: PolyAction): Promise<void> {
    const { config, itemManager } = this.controller;
    if (
      config.conditionActivateAll(action, this.controller) === true
      && itemManager.items.length > 0
    ) {
      const actionPromises: Promise<void>[] = [];
      itemManager.items.forEach(item => {
        if (config.itemIsActive(item, this.controller) === true) {
          const subAction: PolyAction = Object.assign({
            targetItem: item,
            targetId: config.getItemId(item),
          }, action);
          actionPromises.push(
            this.handleActionDeactivate(subAction)
          );
        }
      });
      return Promise
        .all(actionPromises)
        .then(() => Promise.resolve());
    }
    return Promise.reject();
  }

  private handleActionToggleAll(action: PolyAction): Promise<void> {
    const { config, itemManager } = this.controller;
    if (
      config.conditionActivateAll(action, this.controller) === true
      && itemManager.items.length > 0
    ) {
      const actionPromises: Promise<void>[] = [];
      itemManager.items.forEach(item => {
        const subAction: PolyAction = Object.assign({
          targetItem: item,
          targetId: config.getItemId(item),
        }, action);
        actionPromises.push(
          this.handleActionToggle(subAction)
        );
      });
      return Promise
        .all(actionPromises)
        .then(() => Promise.resolve());
    }
    return Promise.reject();
  }

  private handleAction(action: PolyAction): Promise<void> {
    switch(action.name) {
      case 'activate':
        return this.handleActionActivate(action);
      case 'deactivate':
        return this.handleActionDeactivate(action);
      case 'toggle':
        return this.handleActionToggle(action);
      case 'activate-all':
        return this.handleActionActivateAll(action);
      case 'deactivate-all':
        return this.handleActionDeactivateAll(action);
      case 'toggle-all':
        return this.handleActionToggleAll(action);
    }
  }

  private createAction(actionName: PolyActionName): PolyAction {
    return { name: actionName };
  }

  public composeAction(actionName: PolyActionName, id?: string): PolyAction {
    const { itemManager } = this.controller;

    const action = this.createAction(actionName);

    if (typeof id === 'string') {
      const targetItem = itemManager.getItemFromId(id);

      if (targetItem !== false) {
        action.targetId = id;
        action.targetItem = targetItem;
      }
    }
    return action;
  }

  public composeActionFromTrigger(trigger: HTMLElement, triggerMap: PolyTriggerMap): PolyAction {
    const whitelist = ['activate', 'deactivate', 'toggle'];
    if (whitelist.indexOf(triggerMap.action) !== -1)
      return this.composeAction(triggerMap.action, triggerMap.payload);
    return this.composeAction(triggerMap.action);
  }

  public async actionHub(action: PolyAction, isNestedAction: boolean = false, callback?: Function): Promise<void> {
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
      });
    } else {
      preAction = Promise.resolve();
    }
    try {
      await preAction;
      await this.handleAction(action);
      await this.endAction(callback);
      if (isNestedAction === true && this.isNested === true)
        this.isNested = false;
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
