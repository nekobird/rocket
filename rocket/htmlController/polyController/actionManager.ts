import {
  StringUtil,
} from '../../rocket'

import {
  Config,
  Group,
  PolyController,
} from './index'

export type ActionName = 'activate' | 'activateAll' | 'deactivate' | 'deactivateAll' | 'toggle' | 'toggleAll'

export interface Action {
  name?: ActionName,

  groupName: string,
  group?: Group,

  targetId?: string,
  targetItem?: HTMLElement,

  trigger?: HTMLElement,
}

export const POLY_ACTIONS: string[] = ['activateAll', 'deactivateAll', 'toggleAll']

export class ActionManager {

  public isRunning: boolean = false
  public isNested: boolean = false

  private controller: PolyController

  constructor(controller: PolyController) {
    this.controller = controller
  }

  public isPolyAction(actionName: ActionName): boolean {
    return POLY_ACTIONS.indexOf(actionName) === -1 ? false : true
  }

  public hubAction(action: Action, callback?: Function): ActionManager {
    let config: Config = this.controller.config

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

    preAction
      .then(() => {
        if (
          action.name === 'activate' ||
          action.name === 'deactivate'
        ) {
          return this.handleActionActivation(action.name, action, callback)
        } else if (action.name === 'toggle') {
          return this.handleActionToggle(action, callback)
        } else {
          return this.handleActionActivationAll(action, callback)
        }
      })
      .then(() => {
        this.endAction(callback)
        if (this.isNested === false) {
          config.afterAction(action, this.controller)
        }
      })
      .catch(() => {
        this.endAction(callback)
      })
    return this
  }

  private itemActivate(action: Action): ActionManager {
    const config: Config = this.controller.config
    action.targetItem.classList.add(config.classNameItemActive)
    action.group.activeItems.push(action.targetItem)
    action.group.isActive = true
    return this
  }

  private itemDeactivate(action: Action): ActionManager {
    action.targetItem.classList.remove(this.controller.config.classNameItemActive)
    const index: number = action.group.activeItems.indexOf(action.targetItem)
    action.group.activeItems.slice(index, 1)
    if (action.group.activeItems.length === 0) {
      action.group.isActive = false
    }
    return this
  }

  // 5) HANDLE ACTIONS

  private handleActionActivation(
    actionName: 'activate' | 'deactivate', action: Action, callback?: Function
  ): Promise<void> {

    const actionNameString: string = StringUtil.upperCaseFirstLetter(actionName)
    const config: Config = this.controller.config

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
    } else {
      return Promise.resolve()
    }
  }

  private handleActionToggle(action: Action, callback?: Function): Promise<void> {
    const config: Config = this.controller.config

    if (config.conditionToggle(action, this.controller) === true) {
      if (action.targetItem.classList.contains(config.classNameItemActive) === false) {
        return this.handleActionActivation('activate', action, callback)
      } else {
        return this.handleActionActivation('deactivate', action, callback)
      }
    } else {
      return Promise.resolve()
    }
  }

  private handleActionActivationAll(action: Action, callback?: Function): Promise<void> {
    let config: Config = this.controller.config
    let actionNameString: string = StringUtil.upperCaseFirstLetter(action.name)

    if (
      config[`condition${actionNameString}`](action, this) === true &&
      action.group.items.length > 0
    ) {

      let actionPromises: Promise<void>[] = []
      for (let i: number = 0; i < action.group.items.length; i++) {
        let item = action.group.items[i]
        // Action Creation
        let individualAction: Action = Object.assign({
          targetId: item.dataset.id,
          targetItem: item,
        }, action)
        // Handle Action
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
      }
      return Promise
        .all(actionPromises)
        .then(() => { return Promise.resolve() })

    } else {
      Promise.resolve()
    }
  }

  public endAction(callback?: Function): ActionManager {
    if (this.isNested === false) {
      this.isRunning = false
    }
    if (typeof callback === 'function') {
      callback()
    }
    return this
  }

  // ACTION CREATOR AND COMPOSER

  private createAction(actionName: ActionName, groupName: string): Action {
    return {
      name: actionName,
      groupName: groupName,
      group: this.controller.groupManager.groups[groupName],
    }
  }

  public composeAction(actionName: ActionName, groupName: string, id?: string): Action {
    let action: Action = this.createAction(actionName, groupName)
    if (typeof id === 'string') {
      action.targetId = id
      action.targetItem = document.querySelector(
        `${this.controller.config.selectorItems}[data-group="${groupName}"][data-id="${id}"]`
      )
    }
    return action
  }

  public composeActionFromEvent(actionName: ActionName, trigger: HTMLElement): Action {
    const groupName: string = trigger.dataset.group
    let whitelist: string[] = ['activate', 'deactivate', 'toggle']
    if (whitelist.indexOf(actionName) !== -1) {
      return this.composeAction(actionName, groupName, trigger.dataset.target)
    } else {
      return this.composeAction(actionName, groupName)
    }
  }

}