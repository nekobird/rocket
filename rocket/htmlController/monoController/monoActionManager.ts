import {
  StringUtil,
} from '../../rocket'

import {
  ActionManager,
  MonoConfig,
  MonoGroup,
  MonoController,
} from '../index'

export type MonoActionName = 'activate' | 'deactivate'

export interface MonoAction {
  name?: MonoActionName
  groupName: string,
  group?: MonoGroup,
  currentItem?: HTMLElement,
  currentItemId?: string,
  nextItem?: HTMLElement,
  nextItemId?: string,
  trigger?: HTMLElement,
}

export class MonoActionManager implements ActionManager<MonoAction> {

  private controller: MonoController

  public isRunning: boolean = false
  public isNested: boolean = false

  constructor(controller: MonoController) {
    this.controller = controller
  }

  // 2) COMPLETE ACTION

  private activate(action: MonoAction): Promise<void> {
    const config: MonoConfig = this.controller.config
    if (
      action.group.isActive === false &&
      action.group.activeItem !== action.nextItem &&
      config.conditionActivate(action, this.controller) === true
    ) {
      return config
        .beforeActivate(action, this.controller)
        .then(() => {
          this.controller.groupManager.activateItem(action.nextItem)
          return Promise.resolve()
        })
        .then(() => {
          config.afterActivate(action, this.controller)
          return Promise.resolve()
        })
    }
    return Promise.reject()
  }

  private deactivate(action: MonoAction): Promise<void> {
    const config: MonoConfig = this.controller.config
    if (
      action.group.isActive === true &&
      config.conditionDeactivate(action, this.controller) === true
    ) {
      return config
        .beforeDeactivate(action, this.controller)
        .then(() => {
          this.controller.groupManager.deactivateItems()
          return Promise.resolve()
        })
        .then(() => {
          config.afterDeactivate(action, this.controller)
          return Promise.resolve()
        })
    }
    return Promise.reject()
  }

  private completeAction(action: MonoAction): Promise<void> {
    if (action.name === 'activate') {
      return this
        .deactivate(action)
        .then(() => { return this.activate(action) })
    }
    return this.deactivate(action)
  }

  public endAction(callback?: Function): this {
    this.isRunning = false
    if (typeof callback === 'function') {
      callback()
    }
    return this
  }

  // CREATE & COMPOSE ACTION

  public createAction(actionName: MonoActionName, groupName: string): MonoAction {
    const group: MonoGroup = this.controller.groupManager.groups[groupName]
    return {
      name: actionName,
      groupName: groupName,
      group: group,
      currentItem: group.activeItem,
      currentItemId: group.activeItemId,
    }
  }

  public composeAction(actionName: MonoActionName, groupName: string, id?: string): MonoAction {
    const action: MonoAction = this.createAction(actionName, groupName)
    if (typeof id === 'string') {
      let nextItem: HTMLElement | false = this.getItemFromId(groupName, id)
      if (nextItem) {
        action.nextItem = nextItem
        action.nextItemId = id
      }
    }
    return action
  }

  public composeActionFromEvent(actionName: MonoActionName, trigger: HTMLElement): MonoAction {
    const groupName: string = trigger.dataset.group
    const action: MonoAction = this.composeAction(
      actionName, groupName, trigger.dataset.target
    )
    action.trigger = trigger
    return action
  }

  // HELPER

  private getItemFromId(groupName: string, id: string): HTMLElement | false {
    const item: HTMLElement = document.querySelector(
      `${this.controller.config.selectorItems}[data-group="${groupName}"][data-id="${id}"]`
    )
    return item === null ? false : item
  }

  // 1) ACTION HUB

  public actionHub(action: MonoAction, callback?: Function): this {

    const actionNameString: string = StringUtil.upperCaseFirstLetter(action.name)
    this[`setActionTarget${actionNameString}`](action)

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
      })
    } else {
      preAction = Promise.resolve()
    }

    preAction
      .then(() => { return this.completeAction(action) })
      .catch(() => { this.endAction(callback) })
    return this
  }

}