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
        this.onDown(data)
        break
      }
      case 'drag': {
        this.onDrag(data)
        break
      }
      case 'up': {
        this.onUp(data)
        break
      }
      case 'cancel': {
        this.onCancel(data)
        break
      }
    }
    return this
  }

  public onDown(data: SensorData) {
    this.isActive   = true
    this.identifier = data.identifier
    this.downData   = data

    this.currentEvent = data.name

    this.manager.config.onDown(this, this.manager)

    if (this.manager.config.enableLongPress === true) {
      this.longPressTimeout = setTimeout(
        () => this.onLongPress(data),
        this.manager.config.longPressWait * 1000
      )
    }
  }

  public onDrag(data: SensorData) {
    if (this.isActive === true) {
      this.dragData = data

      this.previousEvent = this.currentEvent
      this.currentEvent  = data.name

      this.manager.config.onDrag(this, this.manager)
    }
  }

  public onUp(data: SensorData) {
    if (this.isActive === true) {
      this.clearLongPress()

      this.isActive = false

      this.upData   = data

      this.previousEvent = this.currentEvent
      this.currentEvent  = data.name

      this.manager.config.onUp(this, this.manager)
    }
  }

  public onCancel(data: SensorData) {
    if (this.isActive === true) {
      this.clearLongPress()

      this.isCancelled = true
      this.isActive    = false

      this.cancelData  = data

      this.previousEvent = this.currentEvent
      this.currentEvent  = data.name

      this.manager.config.onCancel(this, this.manager)
    }
  }

  public onLongPress(data: SensorData) {
    this.manager.config.onLongPress(this, this.manager)
  }

  public clearLongPress() {
    clearTimeout(this.longPressTimeout)
  }
}