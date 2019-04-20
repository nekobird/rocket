import {
  DOMUtil,
  StringUtil,
} from '../../rocket'

import {
  ActionName,
  EVENT_ENTRY_LIST,
  SequenceController,
} from './index'
import { ActionManager } from './actionManager';

export interface EventEntries {
  [name: string]: EventEntry
}

export interface EventEntry {
  name: string,
  target: string | HTMLElement | HTMLElement[] | Document | Window,
  event: string | string[],
  action: ActionName,
  listener: EventListener | Function,
  useCapture?: boolean
}

export type EventEntryList = EventEntry[]

export class EventManager {

  private controller: SequenceController
  private eventEntries: EventEntries

  constructor(controller: SequenceController) {
    this.controller = controller
    this.eventEntries = {}
  }

  public initialize(): EventManager {
    this
      .initializeEventEntriesFromConfig()
      .listen()
    return this
  }

  private initializeEventEntriesFromConfig(): EventManager {
    EVENT_ENTRY_LIST.forEach(eventEntry => {
      this.addEventEntry(eventEntry)
    })
    return this
  }

  private listenerFactory(action: ActionName): EventListener {
    return (event: Event) => {
      this.eventHub(event, action)
    }
  }

  private listen(): EventManager {
    Object.keys(this.eventEntries).forEach(name => {

      const eventEntry: EventEntry = this.eventEntries[name]

      let targets = undefined

      if (typeof eventEntry.target === 'string') {
        const elements = this.controller.elementManager.getElements(eventEntry.target)
        if (elements !== false) {
          targets = elements
        }
      } else {
        targets = eventEntry.target
      }

      if (typeof targets !== 'undefined') {
        const useCapture: boolean =
          (typeof eventEntry.useCapture === 'undefined') ? false : eventEntry.useCapture

        if (typeof eventEntry.listener === 'undefined') {
          eventEntry.listener = this.listenerFactory(eventEntry.action)
        }

        if (Array.isArray(targets)) {
          targets.forEach(target => {
            this.addEventListenerToTarget(target, eventEntry, useCapture)
          })
        } else {
          this.addEventListenerToTarget(targets, eventEntry, useCapture)
        }
      }

    }) // End eventEntries loop
    return this
  }

  private addEventListenerToTarget(
    target: HTMLElement | Window | Document, eventEntry: EventEntry, useCapture: boolean
  ): EventManager {

    if (Array.isArray(eventEntry.event)) {
      eventEntry.event.forEach(event => {
        target.addEventListener(
          event, <EventListener>eventEntry.listener, useCapture
        )
      })
    } else if (typeof eventEntry.event === 'string') {
      target.addEventListener(
        eventEntry.event, <EventListener>eventEntry.listener, useCapture
      )
    }
    return this
  }

  public addEventEntry(entry: EventEntry): EventManager {
    if (typeof this.eventEntries[entry.name] === 'object') {
      this.eventEntries[entry.name] = Object.assign(this.eventEntries[name], entry)
    } else {
      this.eventEntries[entry.name] = { ...entry }
    }
    return this
  }

  public removeEventEntry(name: string): EventManager {
    return this
  }

  private eventHub(event: Event, actionName: ActionName): EventManager {
    const actionManager: ActionManager = this.controller.actionManager

    if (
      this.controller.isReady === true &&
      actionManager.isRunning === false
    ) {
      actionManager.isRunning = true

      const eventName: string = StringUtil.upperCaseFirstLetter(actionName)
      const trigger = DOMUtil.findAncestorWithClass(
        <HTMLElement>event.target,
        this.controller.config[`classNameJs${eventName}`],
        false
      )

      if (
        typeof trigger !== 'undefined' &&
        trigger instanceof HTMLElement
      ) {
        actionManager.hubAction(
          actionManager.composeActionFromEvent(actionName, trigger)
        )
      } else {
        actionManager.endAction()
      }
    }
    return this
  }

}