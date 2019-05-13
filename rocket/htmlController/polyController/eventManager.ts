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
  POLY_EVENT_ENTRY_LIST
} from './config'

export interface EventEntries {
  [name: string]: EventEntry
}

export interface EventEntry {
  name  : string,
  target: string,
  action: PolyActionName,
}

export type EventEntryList = EventEntry[]

export class EventManager {

  private controller: PolyController

  private dragEventManager: DragEventManager

  private eventEntries: EventEntries

  constructor(controller: PolyController) {
    this.controller = controller

    this.dragEventManager = new DragEventManager({
      onUp: this.onUp
    })

    this.eventEntries = {}

    this.initialize()
  }

  public initialize() {
    this.initializeEventEntriesFromConfig()

    if (this.controller.config.listenToKeydown === true) {
      window.addEventListener('keydown', this.eventHandlerKeydown)
    }
  }

  private initializeEventEntriesFromConfig(): this {
    POLY_EVENT_ENTRY_LIST.forEach(eventEntry => {
      this.addEntry(eventEntry)
    })
    return this
  }

  private onUp = (event, manager) => {
    this.handleOutsideAction(event)
    
    if (typeof event.downData === 'object') {
      const targetDownElement: HTMLElement | false = event.getTargetElementFromData(event.downData)
      if (targetDownElement !== false) {

        Object.keys(this.eventEntries).forEach(name => {
          const target   : string = StringUtil.upperCaseFirstLetter(this.eventEntries[name].target)
          const className: string = this.controller.config[`className${target}`]

          const trigger = DOMUtil.findAncestorWithClass(targetDownElement, className, false)

          if (trigger !== false) {
            this.eventHub(<HTMLElement>trigger, this.eventEntries[name].action)
          }
        })
      }
    }
  }

  public addEntry(entry: EventEntry): this {
    if (typeof this.eventEntries[entry.name] === 'object') {
      this.eventEntries[entry.name] = Object.assign(this.eventEntries[name], entry)
    } else {
      this.eventEntries[entry.name] = Object.assign({}, entry)
    }
    return this
  }

  public removeEntry(name: string): this {
    if (typeof this.eventEntries[name] === 'object') {
      delete this.eventEntries[name]
    }
    return this
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