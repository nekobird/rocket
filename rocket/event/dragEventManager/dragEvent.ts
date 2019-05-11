import {
  DragEventManager,
} from './dragEventManager'

import {
  Identifier,
  EventName,
  SensorData,
} from './sensorHub'

export class DragEvent {

  public identifier: Identifier

  public previousEvent: EventName
  public currentEvent: EventName

  public downData  : SensorData
  public dragData  : SensorData
  public upData    : SensorData
  public cancelData: SensorData

  public isCancelled: boolean = false
  public isActive   : boolean = false

  public longPressTimeout

  public manager: DragEventManager

  constructor(manager: DragEventManager) {
    this.manager = manager
  }
  
  public get duration(): number | undefined {
    if (typeof this.downData === 'object') {
      if (this.isActive === true) {
        return this.dragData.time - this.downData.time
      }
      if (this.isCancelled === true) {
        return this.cancelData.time - this.downData.time
      }
      return this.upData.time - this.downData.time
    }
    return undefined
  }

  public get previousEventData(): SensorData | false {
    if (typeof this.previousEvent === 'string') {
      return this[`${this.previousEvent}Data`]
    }
    return false
  }

  public get currentEventData(): SensorData | false {
    if (typeof this.currentEvent === 'string') {
      return this[`${this.currentEvent}Data`]
    }
    return false
  }

  public update(data: SensorData): this {
    switch (data.name) {
      case 'down': {
        this.isActive   = true
        this.identifier = data.identifier
        this.downData   = data

        this.manager.config.onDown(this, this.manager)

        if (this.manager.config.isLongPressEnabled === true) {
          this.longPressTimeout = setTimeout(() => {
            this.manager.config.onLongPress(this, this.manager)
          }, this.manager.config.longPressWait * 1000)
        }
        break
      }
      case 'drag': {
        if (this.isActive === true) {
          this.dragData = data
        }
        break
      }
      case 'up': {
        if (this.isActive === true) {
          this.upData   = data
          this.isActive = false
        }
        break
      }
      case 'cancel': {
        if (this.isActive === true) {
          this.cancelData  = data
          this.isCancelled = true
          this.isActive    = false
        }
        break
      }
    }
    return this
  }
}