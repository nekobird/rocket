import {
  DOMUtil
} from '../../rocket'

import {
  ActionName
} from './actionManager'

import {
  ElementMapEntry, ElementMap
} from './elementManager'

import {
  PolyController
} from './polyController'

export interface EventMap {
  [name: string]: EventMapEntry
}

export interface EventMapEntry {
  elementName: string, // element name associated to an element in ElementManager
  eventType: string, // event string
  handler: Function, // event handler function
  action: string, // action string to be passed to ActionHub
}

export class EventManager {

  private uppercaseFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  private eventMap: EventMap

  private controller: PolyController

  constructor(controller: PolyController) {
    this.controller = controller
    this.eventMap = {}
  }

  private initialize() {
    this.initializeEventMap()
  }

  private mapListenerToEventHandler() {
    Object.keys(this.eventMap).forEach(name => {
      const entry: ElementMapEntry = this.controller.elementManager.getEntry[
        this.eventMap[name].elementName
      ]
      entry.elements.forEach(element => {
        element.addEventListener(
          this.eventMap[name].eventType,
          <EventListener>this.eventMap[name].handler
        )
      })
    })
    return this
  }

  private initializeEventMap() {
    Object.keys(this.eventMap).forEach(name => {
      let actionName: ActionName = this.eventMap[name].action
      this.eventMap[name].handler = (event: Event) => {
        this.eventHub(event, actionName)
      }
    })
  }

  private initializeEventListener() {
    Object.keys(this.eventMap).forEach(name => {
      let elementName = this.eventMap[name].elementName
      let elementEntry = this.controller.elementManager.getEntry(elementName)
      elementEntry.elements.forEach(element => {
        element.addEventListener(this.eventMap[name].eventType, this.eventMap[name].handler)
      })
    })
  }

  private eventHub(event: Event, actionName: ActionName) {
    this.controller.elementManager.getEntry('js')
    if (this.controller.isReady === true) {
      this.controller.actionManager.isRunning = true
      const trigger = DOMUtil.findAncestorWithClass(
        <HTMLElement>event.target,
        this[`className_js_${actionName}`],
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