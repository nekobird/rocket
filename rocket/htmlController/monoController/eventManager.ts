import {
  DOMTransverse,
  DragEventManager,
} from '../../rocket'

import {
  MonoController
} from './monoController'

import {
  MonoAction,
  MonoActionName,
} from './actionManager'

import {
  MONO_ACTION_CONFIG_MAP,
} from './config'

export interface ActionConfigMapEntry {
  action: MonoActionName,
  configProperty: string,
}

export type ActionConfigMapEntries = ActionConfigMapEntry[]

export class EventManager {
  public controller: MonoController

  public dragEventManager: DragEventManager

  constructor(controller: MonoController) {
    this.controller = controller

    this.dragEventManager = new DragEventManager({
      onUp: this.onUp
    })
  }

  public initialize() {
    if (this.controller.config.listenToKeydown === true) {
      window.addEventListener('keydown', this.eventHandlerKeydown)
    }
  }

  private onUp = event => {
    this.handleOutsideAction(event)

    if (typeof event.downData === 'object') {
      const targetDownElement = event.getTargetElementFromData(event.downData)

      if (targetDownElement !== false) {
        MONO_ACTION_CONFIG_MAP.forEach(entry => {
          const className: string = this.controller.config[entry.configProperty]
          const trigger = DOMTransverse.findAncestorWithClass(targetDownElement, className, false)
          if (trigger !== false) {
            this.eventHub(<HTMLElement>trigger, entry.action)
          }
        })
      }
    }
  }

  private eventHub(trigger: HTMLElement, actionName: MonoActionName): this {
    const { actionManager, isReady } = this.controller
    if (
      isReady === true
      && actionManager.isRunning === false
    ) {
      actionManager.isRunning = true
      if (
        typeof trigger !== 'undefined' &&
        trigger instanceof HTMLElement
      ) {
        const action: MonoAction = actionManager.composeActionFromEvent(actionName, trigger)
        if (typeof action === 'object') {
          actionManager.actionHub(action)
        } else {
          actionManager.endAction()
        }
      } else {
        actionManager.endAction()
      }
    }
    return this
  }

  private handleOutsideAction = event => {
    const { config, actionManager, itemManager } = this.controller
    if (
      config.deactivateOnOutsideAction === true
      && actionManager.isRunning === false
    ) {

      const targetDownElement: HTMLElement | false = event.getTargetElementFromData(event.downData)
      const targetUpElement  : HTMLElement | false = event.getTargetElementFromData(event.upData)

      let classNames: string[] = [
        config.classNameJsActivate,
        config.classNameJsDeactivate,
        config.classNameJsToggle
      ]

      const identifierFn = element => {
        let containsClassName: boolean = false
        classNames.forEach(className => {
          if (element.classList.contains(className) === true) {
            containsClassName = true
          }
        })
        return containsClassName
      }

      if (
        itemManager.isActive === true
        && typeof itemManager.activeItem !== 'undefined'
        && targetDownElement !== false
        && targetUpElement !== false

        && DOMTransverse.hasAncestor(targetDownElement, itemManager.activeItem) === false
        && DOMTransverse.hasAncestor(targetUpElement, itemManager.activeItem) === false

        && DOMTransverse.findAncestor(targetDownElement, identifierFn) === false
      ) {
        this.controller.deactivate()
        config.onOutsideAction(this.controller)
      }
    }
  }

  private eventHandlerKeydown = (event: KeyboardEvent) => {
    const { config, actionManager } = this.controller

    if (
      config.listenToKeydown  === true
      && actionManager.isRunning === false
    ) {
      config.onKeydown(event, this.controller)
    }
  }
}