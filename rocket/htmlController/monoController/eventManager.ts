import {
  DOMUtil,
  DragEventManager,
  StringUtil,
} from '../../rocket'

import {
  MonoController
} from './monoController'

import {
  MonoActionName,
  MonoAction,
} from './actionManager'

import {
  MONO_ACTION_CONFIG_MAP,
} from './config'

export interface ActionConfigMapEntry {
  configProperty: string,
  action: MonoActionName,
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

  private onUp = (event, manager) => {
    this.handleOutsideAction(event)

    if (typeof event.downData === 'object') {
      const targetDownElement: HTMLElement | false = event.getTargetElementFromData(event.downData)
      if (targetDownElement !== false) {
        MONO_ACTION_CONFIG_MAP.forEach(entry => {
          const className: string = this.controller.config[entry.configProperty]
          const trigger = DOMUtil.findAncestorWithClass(targetDownElement, className, false)
          if (trigger !== false) {
            this.eventHub(<HTMLElement>trigger, entry.action)
          }
        })
      }
    }
  }

  private eventHub(trigger: HTMLElement, actionName: MonoActionName): this {
    const actionManager = this.controller.actionManager
    if (
      this.controller.isReady === true &&
      actionManager.isRunning === false
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
    if (
      this.controller.config.deactivateOnOutsideAction === true &&
      this.controller.actionManager.isRunning === false
    ) {

      const targetDownElement: HTMLElement | false = event.getTargetElementFromData(event.downData)
      const targetUpElement  : HTMLElement | false = event.getTargetElementFromData(event.upData)

      let classNames: string[] = [
        this.controller.config.classNameJsActivate,
        this.controller.config.classNameJsDeactivate,
        this.controller.config.classNameJsToggle
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
        this.controller.itemManager.isActive === true &&
        targetDownElement !== false &&
        targetUpElement   !== false &&

        DOMUtil.hasAncestor(targetDownElement, this.controller.itemManager.activeItem) === false &&
        DOMUtil.hasAncestor(targetUpElement,   this.controller.itemManager.activeItem) === false &&

        DOMUtil.findAncestor(targetDownElement, identifierFn) === false
      ) {
        this.controller.deactivate()
        this.controller.config.onOutsideAction(this.controller)
      }
    }
  }

  private eventHandlerKeydown = (event: KeyboardEvent) => {
    if (
      this.controller.config.listenToKeydown  === true &&
      this.controller.actionManager.isRunning === false
    ) {
      this.controller.config.onKeydown(event, this.controller)
    }
  }
}