import {
  Group
} from './groupManager'

import {
  Config
} from './config'

import {
  PolyController
} from './polyController';

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
        config.beforeAction(action, this.controller)
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
          this.handleAction_activation(action.name, action, callback)
        } else if (action.name === 'toggle') {
          this.handleAction_toggle(action, callback)
        } else {
          this.handleAction_activationAll(action, callback)
        }
      })
      .catch(() => {
        this.endAction(callback)
      })
    return this
  }

  private item_activate(action: Action) {
    let config: Config = this.controller.config
    action.targetItem.classList.add(config.className.itemActive)
    action.group.activeItems.push(action.targetItem)
    action.group.isActive = true
    return this
  }

  private item_deactivate(action: Action) {
    action.targetItem.classList.remove(this.controller.config.className.itemActive)
    const index: number = action.group.activeItems.indexOf(action.targetItem)
    action.group.activeItems.slice(index, 1)
    if (action.group.activeItems.length === 0) {
      action.group.isActive = false
    }
    return this
  }

  // 5) HANDLE ACTIONS

  private handleAction_activation(actionName: 'activate' | 'deactivate', action: Action, callback?: Function) {
    if (this[`condition_${actionName}`](action, this) === true) {
      this[`before_${actionName}`](action, this)
        .then(() => {
          this[`item_${actionName}`](action)
          return this[`after_${actionName}`](action, this)
        })
        .then(() => {
          this.endAction(callback)
          if (this.isNested === false) {
            this.controller.config.afterAction(action, this.controller)
          }
        })
    } else {
      this.endAction(callback)
    }
    return this
  }

  private handleAction_toggle(action: Action, callback?: Function) {
    if (this.controller.config.conditionToggle(action, this.controller) === true) {
      if (action.targetItem.classList.contains(this.controller.config.className.itemActive) === true) {
        this.handleAction_activation('deactivate', action, callback)
      } else {
        this.handleAction_activation('activate', action, callback)
      }
    } else {
      this.endAction(callback)
    }
    return this
  }

  private handleAction_activationAll(action: Action, callback?: Function) {
    if (
      this[`condition_${action.name}`](action, this) === true &&
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
          if (item.classList.contains(this.controller.config.className.itemActive) === false) {
            this.handleAction_activation('activate', individualAction, callback)
          }
        } else if (action.name === 'deactivateAll') {
          if (item.classList.contains(this.controller.config.className.itemActive) === true) {
            this.handleAction_activation('deactivate', individualAction, callback)
          }
        } else if (action.name === 'toggleAll') {
          this.handleAction_toggle(individualAction, callback)
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
    let config = this.controller.config.selector.items
    let action: Action = this.createAction(actionName, groupName)
    if (typeof id === 'string') {
      action.targetId = id
      action.targetItem = document.querySelector(
        `${this.controller.config.selector.items}[data-group="${groupName}"][data-id="${id}"]`
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