import {
  DOMUtil,
  StringUtil,
} from '../../rocket'

import {
  EVENT_ENTRY_LIST,
} from '../polyController/config'

import {
  ActionName,
} from './actionManager'

import {
  ElementEntry,
  ElementEntries,
} from './elementManager'

import {
  PolyController,
} from './polyController'

import {
  Config
} from './config'

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

  private controller: PolyController
  private eventEntries: EventEntries

  constructor(controller: PolyController) {
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
  ) {
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

    if (this.controller.isReady === true) {
      this.controller.actionManager.isRunning = true

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
        this.controller.actionManager.hubAction(
          this.controller.actionManager.composeActionFromEvent(actionName, trigger)
        )
      } else {
        this.controller.actionManager.endAction()
      }
    }
    return this
  }

  // private eventHandler_clickOutside = (event: Event) => {
  //   if (
  //     this.controller.config.listenToClickOutside === true &&
  //     this.isTransitioning === false
  //   ) {
  //     Object.keys(this.controller.groups).forEach(groupName => {
  //       let group: Group = this.controller.groups[groupName]
  //       if (
  //         group.isActive == true &&
  //         DOMUtil.hasAncestor(<HTMLElement>event.target, group.activeItems) === false
  //       ) {
  //         this.controller.config.onClickOutside(event, group, this)
  //       }
  //     })
  //   }
  // }

  // private eventHandler_keydown = (event: Event) => {
  //   if (
  //     this.controller.config.listenToKeydown === true &&
  //     this.isTransitioning === false
  //   ) {
  //     Object.keys(this.controller.groupManager.groups).forEach(groupName => {
  //       let group: Group = this.controller.groupManager.groups[groupName]
  //       this.controller.config.onKeydown(event, group, this)
  //     })
  //   }
  // }

}