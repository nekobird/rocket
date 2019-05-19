import {
  DOMTransverse,
  DragEventManager,
} from '../../rocket'

import {
  SequenceController
} from './SequenceController'

import {
  SEQUENCE_ACTION_CONFIG_MAP,
} from './config'

import {
  SequenceActionName,
  SequenceAction,
} from './actionManager'


export interface ActionConfigMapEntry {
  configProperty: string,
  action        : SequenceActionName,
}

export type ActionConfigMapEntries = ActionConfigMapEntry[]

export class EventManager {

  public controller: SequenceController

  public dragEventManager: DragEventManager

  constructor(controller: SequenceController) {
    this.controller = controller

    this.dragEventManager = new DragEventManager({
      onUp: this.onUp
    })
  }

  public initialize(): this {
    if (this.controller.config.listenToKeydown === true) {
      window.addEventListener('keydown', this.eventHandlerKeydown)
    }
    return this
  }

  private onUp = (event, manager) => {
    if (typeof event.downData === 'object') {
      const targetDownElement: HTMLElement | false = event.getTargetElementFromData(event.downData)
      if (targetDownElement !== false) {
        SEQUENCE_ACTION_CONFIG_MAP.forEach(entry => {
          const className: string = this.controller.config[entry.configProperty]
          const trigger = DOMTransverse.findAncestorWithClass(targetDownElement, className, false)
          if (trigger !== false) {
            this.eventHub(<HTMLElement>trigger, entry.action)
          }
        })
      }
    }
  }

  private eventHub(trigger: HTMLElement, actionName: SequenceActionName): this {
    const {actionManager}: SequenceController = this.controller

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
    const {config, actionManager}: SequenceController = this.controller

    if (
      config.listenToKeydown  === true &&
      actionManager.isRunning === false
    ) {
      config.onKeydown(event, this.controller)
    }
  }
}