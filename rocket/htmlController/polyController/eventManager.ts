import {
  DOMUtil,
  DragEventManager,
  StringUtil,
} from '../../rocket'

import {
  PolyController,
} from './polyController'

import {
  PolyActionName,
  PolyAction,
} from './ActionManager'

import {
  POLY_ACTION_CONFIG_MAP,
} from './config'

export interface ActionConfigMapEntry {
  configProperty: string,
  action        : PolyActionName,
}

export type ActionConfigMapEntries = ActionConfigMapEntry[]

export class EventManager {

  public controller: PolyController

  public dragEventManager: DragEventManager

  constructor(controller: PolyController) {
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
        POLY_ACTION_CONFIG_MAP.forEach(entry => {
          const className: string = this.controller.config[entry.configProperty]
          const trigger = DOMUtil.findAncestorWithClass(targetDownElement, className, false)
          if (trigger !== false) {
            this.eventHub(<HTMLElement>trigger, entry.action)
          }
        })
      }
    }
  }

  private eventHub(trigger: HTMLElement, actionName: PolyActionName): this {
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
        const action: PolyAction = actionManager.composeActionFromEvent(actionName, trigger)
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
      this.controller.config.deactivateAllOnOutsideAction === true &&
      this.controller.actionManager.isRunning             === false
    ) {

      const targetDownElement: HTMLElement | false = event.getTargetElementFromData(event.downData)
      const targetUpElement  : HTMLElement | false = event.getTargetElementFromData(event.upData)

      let classNames: string[] = [
        this.controller.config.classNameJsActivate,
        this.controller.config.classNameJsDeactivate,
        this.controller.config.classNameJsToggle,
        this.controller.config.classNameJsActivateAll,
        this.controller.config.classNameJsDeactivateAll,
        this.controller.config.classNameJsToggleAll,
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

        DOMUtil.hasAncestor(targetDownElement, this.controller.itemManager.activeItems) === false &&
        DOMUtil.hasAncestor(targetUpElement,   this.controller.itemManager.activeItems) === false &&

        DOMUtil.findAncestor(targetDownElement, identifierFn) === false
      ) {
        this.controller.deactivateAll()
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