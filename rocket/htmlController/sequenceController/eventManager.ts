import {
  DOMUtil,
  DragEventManager,
  StringUtil,
} from '../../rocket'

import {
  SequenceController
} from './SequenceController'

import {
  SequenceActionName,
  SequenceAction,
} from './actionManager'

import {
  SEQUENCE_EVENT_ENTRY_LIST
} from './config'

export interface EventEntries {
  [name: string]: EventEntry
}

export interface EventEntry {
  name  : string,
  target: string,
  action: SequenceActionName,
}

export type EventEntryList = EventEntry[]

export class EventManager {

  private controller: SequenceController

  private dragEventManager: DragEventManager

  private eventEntries: EventEntries

  constructor(controller: SequenceController) {
    this.controller = controller

    this.dragEventManager = new DragEventManager({
      onUp: this.onUp
    })

    this.eventEntries = {}
  }

  public initialize(): this {
    this.initializeEventEntriesFromConfig()

    if (this.controller.config.listenToKeydown === true) {
      window.addEventListener('keydown', this.eventHandlerKeydown)
    }
    return this
  }

  private initializeEventEntriesFromConfig(): this {
    SEQUENCE_EVENT_ENTRY_LIST.forEach(eventEntry => {
      this.addEntry(eventEntry)
    })
    return this
  }

  private onUp = (event, manager) => {
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

  private eventHub(trigger: HTMLElement, actionName: SequenceActionName): this {
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
        const action: SequenceAction = actionManager.composeActionFromEvent(actionName, trigger)
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

  private eventHandlerKeydown = (event: KeyboardEvent) => {
    if (
      this.controller.config.listenToKeydown  === true &&
      this.controller.actionManager.isRunning === false
    ) {
      this.controller.config.onKeydown(event, this.controller)
    }
  }
}