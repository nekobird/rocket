import {
  DOMUtil,
  StringUtil,
} from '../rocket'

import {
  ActionName,
  HTMLController,
} from './index'

export interface EventEntries<T> {
  [name: string]: EventEntry<T>
}

export interface EventEntry<T> {
  name: string,
  target: string | HTMLElement | HTMLElement[] | Document | Window,
  event: string | string[],
  action: T,
  listener: EventListener | Function,
  useCapture?: boolean
}

export type EventEntryList<T> = EventEntry<T>[]

export class EventManager<AN> {

  private controller: HTMLController
  private eventEntries: EventEntries<AN>

  constructor(controller: HTMLController) {
    this.controller = controller
    this.eventEntries = {}
  }

  // LISTEN

  public listen(): this {
    Object.keys(this.eventEntries).forEach(name => {

      const eventEntry: EventEntry<AN> = this.eventEntries[name]

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

  private listenerFactory(actionName: AN): EventListener {
    return (event: Event) => {
      this.eventHub(event, actionName)
    }
  }

  private addEventListenerToTarget(
    target: HTMLElement | Window | Document, eventEntry: EventEntry<AN>, useCapture: boolean
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

  public addEntry(entry: EventEntry<AN>): this {
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

  private eventHub(event: Event, actionName: AN): this {
    const actionManager = this.controller.actionManager

    if (
      this.controller.isReady === true &&
      actionManager.isRunning === false
    ) {

      actionManager.isRunning = true

      const eventName: string = StringUtil.upperCaseFirstLetter(actionName.toString())
      const trigger = DOMUtil.findAncestorWithClass(
        <HTMLElement>event.target,
        this.controller.config[`classNameJs${eventName}`],
        false
      )

      if (
        typeof trigger !== 'undefined' &&
        trigger instanceof HTMLElement
      ) {
        actionManager.actionHub(
          actionManager.composeActionFromEvent(actionName, trigger)
        )
      } else {
        actionManager.endAction()
      }
    }
    return this
  }

}