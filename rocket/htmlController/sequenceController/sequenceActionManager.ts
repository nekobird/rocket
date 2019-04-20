import {
  StringUtil,
} from '../../rocket'

import {
  ActionName,
  ActionManager,
  SequenceConfig,
  SequenceGroup,
  SequenceController,
} from '../index'

export type SequenceActionName = 'previous' | 'next' | 'jump'

export interface SequenceAction {
  name?: SequenceActionName
  groupName: string,
  group?: SequenceGroup,
  currentItem?: HTMLElement,
  nextItemIndex?: number,
  nextItemId?: string,
  nextItem?: HTMLElement,
  trigger?: HTMLElement,
}

export class SequenceActionManager implements ActionManager<SequenceAction> {

  private controller: SequenceController

  public isRunning: boolean = false
  public isNested: boolean = false

  constructor(controller: SequenceController) {
    this.controller = controller
  }

  // 5) COMPLETE ACTION

  private completeAction(action: SequenceAction, callback?: Function): this {
    const config: SequenceConfig = this.controller.config
    const actionNameString: string = StringUtil.upperCaseFirstLetter(action.name)
    // condition[actionName]
    if (
      action.group.activeItem !== action.nextItem &&
      config[`condition${actionNameString}`](action, this) === true
    ) {
      config
        .beforeDeactivate(action, this.controller)
        .then(() => {
          this.deactivate(action)
          return Promise.resolve()
        })
        .then(() => {
          return config.afterDeactivate(action, this.controller)
        })
        .then(() => {
          return config.beforeActivate(action, this.controller)
        })
        .then(() => {
          this.activate(action)
          return Promise.resolve()
        })
        .then(() => {
          return config.afterActivate(action, this.controller)
        })
        .then(() => {
          this.endAction(callback)
          if (this.isNested === false) {
            config.afterAction(action, this.controller)
          }
        })
        .catch(error => {
          this.endAction(callback)
        })
    } else {
      this.endAction(callback)
    }
    return this
  }

  public endAction(callback?: Function): this {
    this.isRunning = false
    if (typeof callback === 'function') {
      callback()
    }
    return this
  }

  private deactivate(action: SequenceAction): this {
    action.group.items.forEach(item => {
      item.classList.remove(
        this.controller.config.classNameItemActive
      )
    })
    action.group.activeItem = undefined
    action.group.activeIndex = undefined
    action.group.isActive = false
    return this
  }

  private activate(action: SequenceAction): this {
    action.nextItem.classList.add(
      this.controller.config.classNameItemActive
    )
    action.group.activeItem = action.nextItem
    action.group.activeIndex = action.nextItemIndex
    action.group.isActive = true
    return this
  }

  // SET ACTION TO TARGET

  private setActionTargetPrevious(action: SequenceAction): SequenceAction {
    let index: number
    if (action.group.activeIndex - 1 >= 0) {
      index = action.group.activeIndex - 1
    } else {
      index = action.group.items.length - 1
    }
    action.nextItem = action.group.items[index]
    action.nextItemIndex = index
    return action
  }

  private setActionTargetNext(action: SequenceAction): SequenceAction {
    let index: number
    if (action.group.activeIndex + 1 >= action.group.items.length) {
      index = 0
    } else {
      index = action.group.activeIndex + 1
    }
    action.nextItem = action.group.items[index]
    action.nextItemIndex = index
    return action
  }

  private setActionTargetJump(action: SequenceAction): SequenceAction {
    action.nextItem = document.querySelector(
      `${this.controller.config.selectorItems}[data-group="${action.groupName}"][data-id="${action.nextItemId}"]`
    )
    action.nextItemIndex = action.group.items.indexOf(action.nextItem)
    return action
  }

  // CREATE AND COMPOSE ACTIONS

  public createAction(actionName: SequenceActionName, groupName: string): SequenceAction {
    const group: SequenceGroup = this.controller.groupManager.groups[groupName]
    return {
      name: actionName,
      groupName: groupName,
      group: group,
      currentItem: group.activeItem
    }
  }

  public composeAction(actionName: SequenceActionName, groupName: string, id?: string): SequenceAction {
    let action: SequenceAction = this.createAction(actionName, groupName)
    if (typeof id === 'string') {
      action.nextItemId = id
    }
    return action
  }

  public composeActionFromEvent(actionName: ActionName, trigger: HTMLElement): SequenceAction {
    const groupName: string = trigger.dataset.group
    const action: SequenceAction = this.createAction(actionName, groupName)
    if (typeof trigger.dataset.target === 'string') {
      action.nextItemId = trigger.dataset.target
    }
    action.trigger = trigger
    return action
  }

  // 1) ACTION HUB

  public actionHub(action: SequenceAction, callback?: Function): this {
    const actionNameString: string = StringUtil.upperCaseFirstLetter(action.name)
    this[`setActionTarget${actionNameString}`](action)

    const config: SequenceConfig = this.controller.config

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
      .then(() => {
        this.completeAction(action, callback)
      })
      .catch(() => {
        this.endAction(callback)
      })

    return this
  }

}