import {
  DOMUtil,
  StringUtil,
} from '../rocket'

import {
  Action,
  ActionName,
  HTMLController,
} from './index'

export interface EventEntries {
  [name: string]: EventEntry
}

export interface EventEntry {
  name: string,
  target: string | HTMLElement | HTMLElement[] | Window | Document,
  event: string | string[],
  action: ActionName,
  listener: EventListener | Function,
  useCapture?: boolean,
}

export type EventEntryList = EventEntry[]

export class EventManager {

  private controller: HTMLController
  private eventEntries: EventEntries

  constructor(controller: HTMLController) {
    this.controller = controller
    this.eventEntries = {}
  }

  // LISTEN

  public listen(): this {
    Object.keys(this.eventEntries).forEach(name => {

      const eventEntry: EventEntry = this.eventEntries[name]

      let targets: HTMLElement[] | HTMLElement | Window | Document | undefined = undefined

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

  private listenerFactory(actionName: ActionName): EventListener {
    return (event: Event) => {
      this.eventHub(event, actionName)
    }
  }

  private addEventListenerToTarget(
    target: HTMLElement | Window | Document, eventEntry: EventEntry, useCapture: boolean
  ): this {

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

  public addEntry(entry: EventEntry): this {
    if (typeof this.eventEntries[entry.name] === 'object') {
      this.eventEntries[entry.name] = Object.assign(this.eventEntries[name], entry)
    } else {
      this.eventEntries[entry.name] = { ...entry }
    }
    return this
  }

  public removeEntry(name: string): this {
    if (typeof this.eventEntries[name] === 'object') {
      delete this.eventEntries[name]
    }
    return this
  }

  private eventHub(event: Event, actionName: ActionName): this {
    const actionManager = this.controller.actionManager

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
        const action: Action | false = actionManager.composeActionFromEvent(actionName, trigger)
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
}