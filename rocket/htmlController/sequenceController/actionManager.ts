import {
  StringUtil,
} from '../../rocket'

import {
  SequenceConfig,  
} from './config'

import {
  SequenceController,
} from './sequenceController'

import {
  ItemManager,
} from './itemManager'

export type SequenceActionName = 'previous' | 'next' | 'jump'

export interface SequenceAction {
  name?: SequenceActionName

  currentItem?: HTMLElement,
  
  nextItem?: HTMLElement,
  nextItemIndex?: number,
  nextItemId?: string,

  trigger?: HTMLElement,
}

export class ActionManager {

  private controller: SequenceController

  public isRunning: boolean = false
  public isNested: boolean = false

  constructor(controller: SequenceController) {
    this.controller = controller
  }

  // 5) COMPLETE ACTION

  private completeAction(action: SequenceAction, callback?: Function): Promise<void> {
    const config: SequenceConfig   = this.controller.config
    const itemManager: ItemManager = this.controller.itemManager

    const actionNameString: string = StringUtil.upperCaseFirstLetter(<string>action.name)

    // condition[actionName]
    if (
      itemManager.activeItem !== action.nextItem &&
      config[`condition${actionNameString}`](action, this) === true
    ) {
      return config
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
    }
    return Promise.resolve()
  }

  private deactivate(action: SequenceAction): this {
    const itemManager: ItemManager = this.controller.itemManager

    itemManager.items.forEach(item => {
      item.classList.remove(
        <string>this.controller.config.classNameItemActive
      )
    })

    itemManager.activeItem  = undefined
    itemManager.activeIndex = undefined
    itemManager.isActive    = false
    return this
  }

  private activate(action: SequenceAction): this {
    const itemManager: ItemManager = this.controller.itemManager

    action.nextItem.classList.add(
      <string>this.controller.config.classNameItemActive
    )
    itemManager.activeItem = action.nextItem
    itemManager.activeIndex = action.nextItemIndex
    itemManager.isActive = true
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

  // Create & Compose Action

  public createAction(actionName: SequenceActionName): SequenceAction {
    const itemManager: ItemManager = this.controller.itemManager

    return {
      name       : actionName,
      currentItem: itemManager.activeItem
    }
  }

  public composeAction(actionName: SequenceActionName, id?: string): SequenceAction {
    let action: SequenceAction = this.createAction(actionName)

    if (typeof id === 'string') {
      action.nextItemId = id
    }

    return action
  }

  public composeActionFromEvent(actionName: SequenceActionName, trigger: HTMLElement): SequenceAction {
    const action: SequenceAction = this.createAction(actionName)

    if (typeof trigger.dataset.target === 'string') {
      action.nextItemId = trigger.dataset.target
    }

    action.trigger = trigger
    return action
  }

  // 1) Action Hub

  public actionHub(action: SequenceAction, isNestedAction: boolean = false, callback?: Function): Promise<void> {
    if (
      this.isRunning === true &&
      isNestedAction === true
    ) {
      this.isNested = true
    }
    this.isRunning = true

    const actionNameString: string = StringUtil.upperCaseFirstLetter(<string>action.name)
    this[`setActionTarget${actionNameString}`](action)

    const config: SequenceConfig = this.controller.config

    let preAction: Promise<void>
    if (this.isNested === false) {
      preAction = new Promise(resolve => {
        this.isNested = true
        config
          .beforeAction(<SequenceAction>action, this.controller)
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
        return this.completeAction(<SequenceAction>action, callback)
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
          config.afterAction(<SequenceAction>action, this.controller)
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
      this.isNested === true
    ) {
      this.isNested = false;
    }
    if (typeof callback === 'function') {
      callback()
    }
    return Promise.resolve()
  }
}