import {
  Action,
  ActionName,
  ActionManager,
  MonoConfig,
  MonoGroup,
  MonoController,
} from '../index'

export type MonoActionName = 'activate' | 'deactivate' | 'toggle'

export interface MonoAction {
  name?: MonoActionName
  groupName: string,
  group?: MonoGroup,
  currentItem?: HTMLElement,
  currentItemId?: string,
  nextItem?: HTMLElement,
  nextItemId?: string,
  targetId?: string,
  trigger?: HTMLElement,
}

export class MonoActionManager implements ActionManager {

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
    if (action.group.isActive === false) {
      return Promise.resolve()
    }
    if (
      action.name === 'deactivate' &&
      typeof action.targetId === 'string' &&
      action.group.activeItemId !== action.targetId
    ) {
      return Promise.resolve()
    }
    if (config.conditionDeactivate(action, this.controller) === true) {
      return config
        .beforeDeactivate(action, this.controller)
        .then(() => {
          this.controller.groupManager.deactivateItem(action.groupName)
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
    if (
      action.name === 'activate' &&
      action.group.activeItemId !== action.targetId
    ) {
      return this
        .deactivate(action)
        .then(() => {
          return this.activate(action)
        })
    } else if (action.name === 'deactivate') {
      return this.deactivate(action)
    } else if (action.name === 'toggle') {
      if (action.group.activeItemId === action.targetId) {
        return this.deactivate(action)
      } else {
        return this
          .deactivate(action)
          .then(() => {
            return this.activate(action)
          })
      }
    }
    return Promise.reject()
  }

  // CREATE & COMPOSE ACTION

  public createAction(actionName: MonoActionName, groupName: string): MonoAction {
    const group: MonoGroup = this.controller.groupManager.groups[groupName]
    return {
      name: actionName,
      groupName: groupName,
      group: group,
      currentItem  : group.activeItem,
      currentItemId: group.activeItemId,
      nextItem  : undefined,
      nextItemId: undefined,
      targetId  : undefined,
      trigger   : undefined,
    }
  }

  public composeAction(actionName: MonoActionName, groupName: string, id?: string): MonoAction {
    const action: MonoAction = this.createAction(actionName, groupName)
    if (typeof id === 'string') {
      const nextItem: HTMLElement | false = this.getItemFromId(groupName, id)
      if (typeof nextItem === 'object') {
        action.nextItem   = nextItem
        action.nextItemId = id
      }
      action.targetId = id
    }
    return action
  }

  public composeActionFromEvent(actionName: ActionName, trigger: HTMLElement): Action | false {
    const groupName: string | undefined = trigger.dataset.group
    if (typeof groupName === 'string') {
      const action: MonoAction = this.composeAction(
        <MonoActionName>actionName, groupName, trigger.dataset.target
      )
      action.trigger = trigger
      return action
    }
    return false
  }

  // HELPER

  private getItemFromId(groupName: string, id: string): HTMLElement | false {
    const item: HTMLElement | null = document.querySelector(
      `${this.controller.config.selectorItems}[data-group="${groupName}"][data-id="${id}"]`
    )
    return item === null ? false : item
  }

  // 1) ACTION HUB

  public actionHub(action: Action, isNestedAction: boolean = false, callback?: Function): Promise<void> {
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
          .beforeAction(<MonoAction>action, this.controller)
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
        return this.completeAction(<MonoAction>action)
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
          config.afterAction(<MonoAction>action, this.controller)
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