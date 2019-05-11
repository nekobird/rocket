import {
  DragEventManager,
} from './dragEventManager'

import {
  EventName,
  SensorData,
} from './sensorHub'

export class TouchSensor {

  public manager: DragEventManager

  constructor(manager: DragEventManager) {
    this.manager = manager
  }

  public dispatch(data: SensorData) {
    this.manager.sensorHub.receive(data)
  }

  public composeData(name: EventName, event: Touch): SensorData {
    return {
      identifier: event.identifier,
      type: 'MOUSE',
      name: name,
      time: Date.now(),
      target: <HTMLElement>event.target,
      x: event.clientX,
      y: event.clientY,
      event: event,
    }
  }

  public eventHandlerTouchStart = (event: TouchEvent) => {
    Array.from(event.changedTouches).forEach(touch => {
      this.dispatch(this.composeData('down', touch))
    })
  }

  public eventHandlerTouchMove = (event: TouchEvent) => {
    Array.from(event.changedTouches).forEach(touch => {
      this.dispatch(this.composeData('drag', touch))
    })
  }

  public eventHandlerTouchEnd = (event: TouchEvent) => {
    Array.from(event.changedTouches).forEach(touch => {
      this.dispatch(this.composeData('up', touch))
    })
  }

  public eventHandlerTouchCancel = (event: TouchEvent) => {
    Array.from(event.changedTouches).forEach(touch => {
      this.dispatch(this.composeData('cancel', touch))
    })
  }

  public listen() {
    window.addEventListener('touchstart',  this.eventHandlerTouchStart)
    window.addEventListener('touchmove',   this.eventHandlerTouchMove)
    window.addEventListener('touchend',    this.eventHandlerTouchEnd)
    window.addEventListener('touchcancel', this.eventHandlerTouchCancel)
  }

  public stop() {
    window.removeEventListener('touchstart',  this.eventHandlerTouchStart)
    window.removeEventListener('touchmove',   this.eventHandlerTouchMove)
    window.removeEventListener('touchend',    this.eventHandlerTouchEnd)
    window.removeEventListener('touchcancel', this.eventHandlerTouchCancel)
  }
} 