import {
  StringUtil,
} from '../../rocket'

import {
  PolyController
} from './polyController';

import {
  Config
} from './config'

import {
  Group
} from './groupManager'

export type ActionName = 'activate' | 'activateAll' | 'deactivate' | 'deactivateAll' | 'toggle' | 'toggleAll'

export interface Action {
  name?: ActionName,

  groupName: string,
  group?: Group,

  targetId?: string,
  targetItem?: HTMLElement,

  trigger?: HTMLElement,
}

export class ActionManager {

  public isRunning: boolean = false
  public isNested: boolean = false

  private controller: PolyController

  constructor(controller: PolyController) {
    this.controller = controller
  }

  public hubAction(action: Action, callback?: Function) {
    let preAction: Promise<void>
    let config: Config = this.controller.config

    if (this.isNested === false) {
      preAction = new Promise(resolve => {
        this.isNested = true
        config
          .beforeAction(action, this.controller)
          .then(() => {
            this.isNested = false
            resolve()
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
          this.handleActionActivation(action.name, action, callback)
        } else if (action.name === 'toggle') {
          this.handleActionToggle(action, callback)
        } else {
          this.handleActionActivationAll(action, callback)
        }
      })
      .catch(() => {
        this.endAction(callback)
      })
    return this
  }

  private itemActivate(action: Action) {
    const config: Config = this.controller.config
    action.targetItem.classList.add(config.classNameItemActive)
    action.group.activeItems.push(action.targetItem)
    action.group.isActive = true
    return this
  }

  private itemDeactivate(action: Action) {
    action.targetItem.classList.remove(this.controller.config.classNameItemActive)
    const index: number = action.group.activeItems.indexOf(action.targetItem)
    action.group.activeItems.slice(index, 1)
    if (action.group.activeItems.length === 0) {
      action.group.isActive = false
    }
    return this
  }

  // 5) HANDLE ACTIONS

  private handleActionActivation(actionName: 'activate' | 'deactivate', action: Action, callback?: Function) {
    let actionNameString: string = StringUtil.upperCaseFirstLetter(actionName)
    let config: Config = this.controller.config
    if (config[`condition${actionNameString}`](action, this) === true) {
      config[`before${actionNameString}`](action, this)
        .then(() => {
          this[`item${actionNameString}`](action)
          return config[`after${actionNameString}`](action, this)
        })
        .then(() => {
          this.endAction(callback)
          if (this.isNested === false) {
            config.afterAction(action, this.controller)
          }
        })
    } else {
      this.endAction(callback)
    }
    return this
  }

  private handleActionToggle(action: Action, callback?: Function) {
    if (this.controller.config.conditionToggle(action, this.controller) === true) {
      if (action.targetItem.classList.contains(this.controller.config.classNameItemActive) === true) {
        this.handleActionActivation('deactivate', action, callback)
      } else {
        this.handleActionActivation('activate', action, callback)
      }
    } else {
      this.endAction(callback)
    }
    return this
  }

  private handleActionActivationAll(action: Action, callback?: Function) {
    let actionNameString: string = StringUtil.upperCaseFirstLetter(action.name)
    let config: Config = this.controller.config
    if (
      config[`condition${actionNameString}`](action, this) === true &&
      action.group.items.length > 0
    ) {
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
            this.handleActionActivation('activate', individualAction, callback)
          }
        } else if (action.name === 'deactivateAll') {
          if (item.classList.contains(config.classNameItemActive) === true) {
            this.handleActionActivation('deactivate', individualAction, callback)
          }
        } else if (action.name === 'toggleAll') {
          this.handleActionToggle(individualAction, callback)
        }
      }
    } else {
      this.endAction(callback)
    }
    return this
  }

  // HELPER METHODS FOR CREATING AND COMPOSING ACTIONS

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

  public endAction(callback?: Function): ActionManager {
    if (this.isNested === false) {
      this.isRunning = false
    }
    if (typeof callback === 'function') {
      callback()
    }
    return this
  }

}