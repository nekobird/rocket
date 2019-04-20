import {
  StringUtil,
} from '../../rocket'

import {
  Action,
  ActionName,
  ActionManager,
  PolyConfig,
  PolyGroup,
  PolyController,
} from '../index'

export type PolyActionName = 'activate' | 'activateAll' | 'deactivate' | 'deactivateAll' | 'toggle' | 'toggleAll'

export interface PolyAction {
  name?: PolyActionName,
  groupName: string,
  group?: PolyGroup,
  targetId?: string,
  targetItem?: HTMLElement,
  trigger?: HTMLElement,
}

export const POLY_ACTIONS: string[] = ['activateAll', 'deactivateAll', 'toggleAll']

export class PolyActionManager implements ActionManager {

  public isRunning: boolean = false
  public isNested: boolean = false

  private controller: PolyController

  constructor(controller: PolyController) {
    this.controller = controller
  }

  public isPolyAction(actionName: PolyActionName): boolean {
    return POLY_ACTIONS.indexOf(actionName) === -1 ? false : true
  }

  private itemActivate(action: PolyAction): this {
    const config: PolyConfig = this.controller.config
    action.targetItem.classList.add(config.classNameItemActive)
    action.group.activeItems.push(action.targetItem)
    action.group.isActive = true
    return this
  }

  private itemDeactivate(action: PolyAction): this {
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
    actionName: 'activate' | 'deactivate', action: PolyAction, callback?: Function
  ): Promise<void> {

    const actionNameString: string = StringUtil.upperCaseFirstLetter(actionName)
    const config: PolyConfig = this.controller.config

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
    const config: PolyConfig = this.controller.config
    const actionNameString: string = StringUtil.upperCaseFirstLetter(action.name)

    if (
      config[`condition${actionNameString}`](action, this) === true &&
      action.group.items.length > 0
    ) {

      let actionPromises: Promise<void>[] = []
      for (let i: number = 0; i < action.group.items.length; i++) {
        let item = action.group.items[i]
        // Action Creation
        let individualAction: PolyAction = Object.assign({
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

  public endAction(callback?: Function): this {
    if (this.isNested === false) {
      this.isRunning = false
    }
    if (typeof callback === 'function') {
      callback()
    }
    return this
  }

  // ACTION CREATOR AND COMPOSER

  private createAction(actionName: PolyActionName, groupName: string): PolyAction {
    return {
      name: actionName,
      groupName: groupName,
      group: this.controller.groupManager.groups[groupName],
    }
  }

  public composeAction(actionName: PolyActionName, groupName: string, id?: string): PolyAction {
    const action: PolyAction = this.createAction(actionName, groupName)
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
    const whitelist: string[] = ['activate', 'deactivate', 'toggle']
    if (whitelist.indexOf(actionName) !== -1) {
      return this.composeAction(<PolyActionName>actionName, groupName, trigger.dataset.target)
    }
    return this.composeAction(<PolyActionName>actionName, groupName)
  }

  // 1) ACTION HUB

  public actionHub(action: Action, callback?: Function): this {
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
          return this.handleActionActivationAll(<PolyAction>action, callback)
        }
      })
      .then(() => {
        this.endAction(callback)
        if (this.isNested === false) {
          config.afterAction(<PolyAction>action, this.controller)
        }
      })
      .catch(() => {
        this.endAction(callback)
      })
    return this
  }

}