import {
  StringUtil,
} from '../../rocket'

import {
  PolyConfig,
} from './config'

import {
  PolyController,
} from './polyController'

import {
  ItemManager,
} from './itemManager'

export type PolyActionName = 'activate' | 'activateAll' | 'deactivate' | 'deactivateAll' | 'toggle' | 'toggleAll'

export interface PolyAction {
  name?: PolyActionName,

  targetItem?: HTMLElement,

  targetId?: string,  
  trigger?: HTMLElement,
}

export class ActionManager {

  private controller: PolyController

  public isRunning: boolean = false
  public isNested : boolean = false

  constructor(controller: PolyController) {
    this.controller = controller
  }

  // 5) HANDLE ACTIONS

  private handleActionActivation(
    actionName: 'activate' | 'deactivate', action: PolyAction, callback?: Function
  ): Promise<void> {

    const config: PolyConfig = this.controller.config

    const actionNameString: string = StringUtil.upperCaseFirstLetter(actionName)

    // Only proceed if item is not yet activated or deactivated
    let proceed: boolean = true
    if (
      actionName === 'activate' &&
      action.targetItem.classList.contains(config.classNameItemActive) === true
    ) {
      proceed = false
    } else if (
      actionName === 'deactivate' &&
      action.targetItem.classList.contains(config.classNameItemActive) === false
    ) {
      proceed = false
    }

    // Order Of Operation
    // Condition[ActionName]
    // Before[ActionName]
    // Action
    // After[ActionName]
    if (
      proceed === true &&
      config[`condition${actionNameString}`](action, this.controller) === true
    ) {
      return config[`before${actionNameString}`](action, this.controller)
        .then(() => {
          this[`item${actionNameString}`](action)
          return config[`after${actionNameString}`](action, this)
        })
    }
    return Promise.resolve()
  }

  private handleActionToggle(action: PolyAction, callback?: Function): Promise<void> {
    const config: PolyConfig = this.controller.config

    if (config.conditionToggle(action, this.controller) === true) {
      if (action.targetItem.classList.contains(config.classNameItemActive) === false) {
        return this.handleActionActivation('activate', action, callback)
      } else {
        return this.handleActionActivation('deactivate', action, callback)
      }
    }
    return Promise.resolve()
  }

  private handleActionActivationAll(action: PolyAction, callback?: Function): Promise<void> {
    const config     : PolyConfig  = this.controller.config
    const itemManager: ItemManager = this.controller.itemManager

    const actionNameString: string = StringUtil.upperCaseFirstLetter(action.name)

    if (
      config[`condition${actionNameString}`](action, this) === true &&
      itemManager.items.length > 0
    ) {

      let actionPromises: Promise<void>[] = []

      itemManager.items.forEach(item => {
        // Action Creation
        let individualAction: PolyAction = Object.assign({
          targetItem: item,
          targetId  : item.dataset.id,          
        }, action)

        // Handle action
        if (action.name === 'activateAll') {
          if (item.classList.contains(config.classNameItemActive) === false) {
            actionPromises.push(
              this.handleActionActivation('activate', individualAction, callback)
            )
          }
        } else if (action.name === 'deactivateAll') {
          if (item.classList.contains(config.classNameItemActive) === true) {
            actionPromises.push(
              this.handleActionActivation('deactivate', individualAction, callback)
            )
          }
        } else if (action.name === 'toggleAll') {
          actionPromises.push(
            this.handleActionToggle(individualAction, callback)
          )
        }
      })

      return Promise
        .all(actionPromises)
        .then(() => {
          return Promise.resolve()
        })
    }
    Promise.resolve()
  }

  // Compose & Create Action

  private createAction(actionName: PolyActionName): PolyAction {
    return {
      name: actionName,
    }
  }

  public composeAction(actionName: PolyActionName, id?: string): PolyAction {
    const itemManager: ItemManager = this.controller.itemManager

    const action: PolyAction = this.createAction(actionName)

    if (typeof id === 'string') {
      const targetItem: HTMLElement | false = itemManager.getItemFromId(id)

      if (targetItem !== false) {
        action.targetId   = id
        action.targetItem = targetItem
      }
    }
    return action
  }

  public composeActionFromEvent(actionName: PolyActionName, trigger: HTMLElement): PolyAction {
    const whitelist: string[] = ['activate', 'deactivate', 'toggle']

    if (whitelist.indexOf(actionName) !== -1) {
      return this.composeAction(actionName, trigger.dataset.target)
    }

    return this.composeAction(actionName)
  }

  // 1) Action Hub

  public actionHub(action: PolyAction, isNestedAction: boolean = false, callback?: Function): Promise<void> {
    if (
      this.isRunning === true &&
      isNestedAction === true
    ) {
      this.isNested = true
    }
    this.isRunning = true

    const config: PolyConfig = this.controller.config

    let preAction: Promise<void>

    if (this.isNested === false) {
      preAction = new Promise(resolve => {
        this.isNested = true
        config
          .beforeAction(<PolyAction>action, this.controller)
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
        if (
          action.name === 'activate' ||
          action.name === 'deactivate'
        ) {
          return this.handleActionActivation(action.name, action, callback)
        } else if (action.name === 'toggle') {
          return this.handleActionToggle(action, callback)
        } else {
          return this.handleActionActivationAll(<PolyAction>action, callback)
        }
      })
      .then(() => {
        return this.endAction(callback)
      })
      .then(() => {
        if (
          isNestedAction === true &&
          this.isNested === true
        ) {
          this.isNested = false
        }
        if (this.isNested === false) {
          config.afterAction(<PolyAction>action, this.controller)
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
      this.isNested = false;
    }
    if (typeof callback === 'function') {
      callback()
    }
    return Promise.resolve()
  }
}