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
    const {actionManager}: PolyController = this.controller

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
    const {config, actionManager, itemManager}: PolyController = this.controller

    if (
      config.deactivateAllOnOutsideAction === true &&
      actionManager.isRunning === false
    ) {
      const targetDownElement: HTMLElement | false = event.getTargetElementFromData(event.downData)
      const targetUpElement  : HTMLElement | false = event.getTargetElementFromData(event.upData)

      let classNames: string[] = [
        config.classNameJsActivate,
        config.classNameJsDeactivate,
        config.classNameJsToggle,
        config.classNameJsActivateAll,
        config.classNameJsDeactivateAll,
        config.classNameJsToggleAll,
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
        itemManager.isActive === true &&
        targetDownElement !== false &&
        targetUpElement !== false &&

        DOMUtil.hasAncestor(targetDownElement, itemManager.activeItems) === false &&
        DOMUtil.hasAncestor(targetUpElement,   itemManager.activeItems) === false &&

        DOMUtil.findAncestor(targetDownElement, identifierFn) === false
      ) {
        this.controller.deactivateAll()
        config.onOutsideAction(this.controller)
      }
    }
  }

  private eventHandlerKeydown = (event: KeyboardEvent) => {
    const {config, actionManager}: PolyController = this.controller
    if (
      config.listenToKeydown  === true &&
      actionManager.isRunning === false
    ) {
      config.onKeydown(event, this.controller)
    }
  }
}