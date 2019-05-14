import {
  MonoConfig,
} from './config'

import {
  MonoController,  
} from './monoController'

export type MonoActionName = 'activate' | 'deactivate' | 'toggle'

export interface MonoAction {
  name?: MonoActionName

  currentItem?  : HTMLElement,
  currentItemId?: string,

  nextItem?  : HTMLElement,
  nextItemId?: string,

  targetId?: string,
  trigger? : HTMLElement,
}

export class ActionManager {

  private controller: MonoController

  public isRunning: boolean = false
  public isNested : boolean = false

  constructor(controller: MonoController) {
    this.controller = controller
  }

  // 2) Complete Action

  private async activate(action: MonoAction): Promise<void> {
    const {config, itemManager}: MonoController = this.controller
    if (
      itemManager.isActive   === false &&
      itemManager.activeItem !== action.nextItem &&
      config.conditionActivate(action, this.controller) === true
    ) {
      await config.beforeActivate(action, this.controller)
      itemManager.activate(action.nextItem)
      config.afterActivate(action, this.controller)
      return Promise.resolve()
    }

    return Promise.reject()
  }

  private async deactivate(action: MonoAction): Promise<void> {
    const {config, itemManager}: MonoController = this.controller

    if (itemManager.isActive === false) {
      return Promise.resolve()
    }

    if (
      action.name              === 'deactivate' &&
      typeof action.targetId   === 'string'     &&
      itemManager.activeItemId !== action.targetId
    ) {
      return Promise.resolve()
    }

    if (config.conditionDeactivate(action, this.controller) === true) {
      await config.beforeDeactivate(action, this.controller)
      itemManager.deactivate()
      config.afterDeactivate(action, this.controller)
      return Promise.resolve()
    }

    return Promise.reject()
  }

  private async completeAction(action: MonoAction): Promise<void> {
    const {itemManager}: MonoController = this.controller

    if (
      action.name === 'activate' &&
      itemManager.activeItemId !== action.targetId
    ) {
      await this.deactivate(action)
      return this.activate(action)
    } else if (action.name === 'deactivate') {
      return this.deactivate(action)
    } else if (action.name === 'toggle') {
      if (itemManager.activeItemId === action.targetId) {
        return this.deactivate(action)
      }else {
        await this.deactivate(action)
        return this.activate(action)
      }
    }
    return Promise.reject()
  }

  // Create & Compose Action

  public createAction(actionName: MonoActionName): MonoAction {
    const {itemManager}: MonoController = this.controller

    return {
      name: actionName,

      currentItem  : itemManager.activeItem,
      currentItemId: itemManager.activeItemId,

      nextItem  : undefined,
      nextItemId: undefined,

      targetId: undefined,
      trigger : undefined,
    }
  }

  public composeAction(actionName: MonoActionName, id?: string): MonoAction {
    const {itemManager}: MonoController = this.controller

    const action: MonoAction = this.createAction(actionName)

    if (typeof id === 'string') {
      const nextItem: HTMLElement | false = itemManager.getItemFromId(id)
      if (typeof nextItem === 'object') {
        action.nextItem   = nextItem
        action.nextItemId = id
      }
      action.targetId = id
    }
    return action
  }

  public composeActionFromEvent(actionName: MonoActionName, trigger: HTMLElement): MonoAction {
    const action: MonoAction = this.composeAction(actionName, trigger.dataset.target)
    action.trigger = trigger
    return action
  }

  // 1) Action Hub

  public actionHub(action: MonoAction, isNestedAction: boolean = false, callback?: Function): Promise<void> {
    if (
      this.isRunning === true &&
      isNestedAction === true
    ) {
      this.isNested = true
    }
    this.isRunning = true

    const config: MonoConfig = this.controller.config

    let preAction: Promise<void>
    if (this.isNested === false) {
      preAction = new Promise(resolve => {
        this.isNested = true
        config
          .beforeAction(action, this.controller)
          .then(() => {
            this.isNested = false
            resolve()
          })
          .catch(() => {
            this.isNested = false
          })
      })
    } else {
      preAction = Promise.resolve()
    }

    return preAction
      .then(() => {
        return this.completeAction(action)
      })
      .then(() => {
        return this.endAction(callback)
      })
      .then(() => {
        if (
          isNestedAction === true &&
          this.isNested  === true
        ) {
          this.isNested = false
        }
        if (this.isNested === false) {
          config.afterAction(action, this.controller)
        }
      })
      .catch(() => {
        return this.endAction(callback)
      })
  }

  public endAction(callback?: Function): Promise<void> {
    if (this.isNested === false) {
      return new Promise(resolve => {
        setTimeout(() => {
          this.isRunning = false
          resolve()
        }, this.controller.config.cooldown)
      })
    }

    if (
      this.isRunning === false &&
      this.isNested  === true
    ) {
      this.isNested = false
    }

    if (typeof callback === 'function') {
      callback()
    }
    return Promise.resolve()
  }
}