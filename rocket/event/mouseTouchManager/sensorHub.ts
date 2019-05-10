import {
  MouseTouchManager,
} from './mouseTouchManager'

import {
  MouseTouchEvent,
} from './MouseTouchEvent'

export type SensorEventName = 'down' | 'drag' | 'up' | 'cancel'

export type Identifier = 'mouse-event' | number

export interface SensorData {
  identifier: Identifier,
  name: SensorEventName,
  time: number,
  x: number,
  y: number,
  target: HTMLElement,
  type: 'MOUSE' | 'TOUCH',
  event: MouseEvent | Touch,
}

export interface ActiveMouseTouchEvents {
  [identifier: number | string]: MouseTouchEvent
}

export class SensorHub {

  public manager: MouseTouchManager

  public activeEvents: ActiveMouseTouchEvents

  constructor(manager: MouseTouchManager) {
    this.manager = manager
  }

  public receive(data: SensorData) {
    switch (data.name) {
      case 'down': {
        this.down(data)
        break
      }
      case 'drag': {
        this.drag(data)
        break
      }
      case 'up': {
        this.up(data)
        break
      }
      case 'cancel': {
        this.cancel(data)
        break
      }
    }
  }

  public down(data: SensorData) {
    // In case of error.
    if (this.isEventActive(data) === true) {
      deactivateEvent(data.identifier)
    }
    this.activeEvents[data.identifier] = new MouseTouchEvent(data)
  }

  public drag(data: SensorData) {
    if (this.isEventActive(data) === true) {
      this.activeEvents[data.identifier].update(data)
    }
  }

  public up(data: SensorData) {
    if (this.isEventActive(data) === true) {
      this.activeEvents[data.identifier].update(data)
    }
  }

  public cancel(data: SensorData) {
    if (this.isEventActive(data) === true) {

    }
  }

  private isEventActive(data: SensorData): boolean {
    return (Object.keys(this.activeEvents).indexOf(data.identifier) !== -1)
  }

  private getActiveEvent(identifier: Identifier): MouseTouchEvent | false{
    if (typeof this.activeEvents[identifier] !== undefined) {
      return this.activeEvents[identifier]
    }
    return false
  }

  private deactivateEvent(identifier: Identifier): boolean {
    if (typeof this.activeEvents[identifier] !== undefined) {
      delete this.activeEvents[identifier]
      return true
    }
    return false
  }
}