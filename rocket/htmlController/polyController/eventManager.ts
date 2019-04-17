import {
  DOMUtil
} from '../../rocket'

import {
  ActionName
} from './types'

import {
  PolyController
} from './polyController'

export interface EventMap {
  [name: string]: EventMapEntry
}

export interface EventMapEntry {
  elementName: string,
  eventType: string,
  handler: Function,
  action: string,
}

export class EventManager {
  private uppercaseFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  private eventMap
  private controller

  constructor(controller: PolyController) {
    this.eventMap = {}
    this.controller = controller
  }

  private initialize() {
    this.initializeEventMap()
  }

  private mapListenerToEventHandler() {
    Array.from(this.eventMap).forEach(eventMap => {
      eventMap.target.addEventListener(eventMap.event, eventMap.handler)
    })
  }

  private initializeEventMap() {
    Object.keys(this.eventMap).forEach(name => {
      let actionName: string = this.eventMap[name].action
      this.eventMap[name].handler = (event: Event) => {
        this.hubEvent(event, actionName)
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

  private hubEvent(event: Event, actionName: ActionName) {
    this.controller.elementManager.getEntry('js')
    if (this.controller.isReady === true) {
      this.controller.isTransitioning = true
      const trigger = DOMUtil.findAncestorWithClass(
        <HTMLElement>event.target,
        this[`className_js_${actionName}`],
        false
      )
      if (
        typeof trigger !== 'undefined' &&
        trigger instanceof HTMLElement
      ) {
        this.controller.actionManager.hubAction
        this.controller.actionManager.composeActionFromTrigger(actionName, trigger)
        )
      } else {
        this.endAction()
      }
    }
    return this
  }

  private eventHandler_clickOutside = (event: Event) => {
    if (
      this.controller.config.listenToClickOutside === true &&
      this.isTransitioning === false
    ) {
      Object.keys(this.controller.groups).forEach(groupName => {
        let group: Group = this.controller.groups[groupName]
        if (
          group.isActive == true &&
          DOMUtil.hasAncestor(<HTMLElement>event.target, group.activeItems) === false
        ) {
          this.controller.config.onClickOutside(event, group, this)
        }
      })
    }
  }

  private eventHandler_keydown = (event: Event) => {
    if (
      this.listenTo_keydown === true &&
      this.isTransitioning === false
    ) {
      Object.keys(this.groups).forEach(groupName => {
        let group: Group = this.groups[groupName]
        this.onKeydown(event, group, this)
      })
    }
  }

}