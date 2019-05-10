import {
  MouseTouchManager,
} from './mouseTouchManager'

import {
  MouseTouchEvent,
} from './MouseTouchEvent'

export type EventName = 'down' | 'drag' | 'up' | 'cancel'

export type Identifier = 'mouse-event' | number

export interface SensorData {
  identifier: Identifier,
  name: EventName,
  time: number,
  x: number,
  y: number,
  target: HTMLElement,
  type: 'MOUSE' | 'TOUCH',
  event: MouseEvent | Touch,
}

export interface MouseTouchEvents {
  [identifier: number | string]: MouseTouchEvent
}

export class SensorHub {

  public manager: MouseTouchManager

  public events: MouseTouchEvents

  constructor(manager: MouseTouchManager) {
    this.manager = manager
  }

  public receive(data: SensorData) {
    // TODO set manager is active to true

    // Check if there's no other active events and set it to false.
    if (
      this.hasEvent(data.identifier) === false ||
      (
        data.identifier === 'mouse-event' &&
        data.name === 'down'
      )
    ) {
      this.events[data.identifier] = new MouseTouchEvent().update(data)
    } else {
      this.events[data.identifier].update(data)
    }
  }

  public pass(name: EventName, event: MouseTouchEvent) {
    this.manager.receive(name, event)
  }

  private destroyEvent(identifier: Identifier): boolean {
    if (typeof this.events[identifier] !== undefined) {
      delete this.events[identifier]
      return true
    }
    return false
  }

  private hasEvent(identifier: Identifier) {
    return (Object.keys(this.events).indexOf(identifier) !== -1)
  }

  public get activeEvents(): MouseTouchEvent[] {
    return Object.keys(this.events).map(identifier => {
      if (this.events[identifier].isActive === true) {
        return this.events[identifier]
      }
    })
  }
}