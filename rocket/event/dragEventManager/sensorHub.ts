import {
  DragEventManager,
} from './dragEventManager'

import {
  DragEvent,
} from './dragEvent'

export type EventName = 'down' | 'drag' | 'up' | 'cancel'

export type Identifier = 'mouse-event' | string

export interface SensorData {
  identifier: Identifier,
  name: EventName,
  time: number,
  screenX: number,
  screenY: number,
  pageX: number,
  pageY: number,
  clientX: number,
  clientY: number,
  target: HTMLElement,
  type: 'MOUSE' | 'TOUCH',
  event: MouseEvent | TouchEvent,
  touch: Touch | undefined
}

export interface DragEvents {
  [identifier: string]: DragEvent
}

export class SensorHub {

  public manager: DragEventManager

  public events: DragEvents

  constructor(manager: DragEventManager) {
    this.manager = manager

    this.events = {}
  }

  public receive(data: SensorData) {
    this.manager.isActive = true
    if (
      this.hasEvent(data.identifier) === false ||
      (
        data.identifier === 'mouse-event' &&
        data.name === 'down'
      )
    ) {
      this.events[data.identifier] = new DragEvent(this.manager).update(data)
    } else {
      this.events[data.identifier].update(data)
    }
  }

  public get hasActiveEvents(): boolean {
    return (Object.keys(this.events).length > 0)

  }

  private hasEvent(identifier: Identifier) {
    return (Object.keys(this.events).indexOf(identifier) !== -1)
  }

  public get activeEvents(): DragEvent[] {
    return Object.keys(this.events).map(identifier => {
      if (this.events[identifier].isActive === true) {
        return this.events[identifier]
      }
    })
  }

  private destroyEvent(identifier: Identifier): boolean {
    if (typeof this.events[identifier] !== undefined) {
      delete this.events[identifier]
      return true
    }
    return false
  }
}