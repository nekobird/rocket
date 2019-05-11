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

  public composeData(name: EventName, event: TouchEvent, touch: Touch): SensorData {
    return {
      identifier: touch.identifier.toString(),
      type: 'MOUSE',
      name: name,
      time: Date.now(),
      target: <HTMLElement>touch.target,
      screenX: touch.screenX,
      screenY: touch.screenY,
      pageX: touch.pageX,
      pageY: touch.pageY,
      clientX: touch.clientX,
      clientY: touch.clientY,
      event: event,
      touch: touch,
    }
  }

  public eventHandlerTouchStart = (event: TouchEvent) => {
    Array.from(event.changedTouches).forEach(touch => {
      this.dispatch(this.composeData('down', event, touch))
    })
  }

  public eventHandlerTouchMove = (event: TouchEvent) => {
    Array.from(event.changedTouches).forEach(touch => {
      this.dispatch(this.composeData('drag', event, touch))
    })
  }

  public eventHandlerTouchEnd = (event: TouchEvent) => {
    Array.from(event.changedTouches).forEach(touch => {
      this.dispatch(this.composeData('up', event, touch))
    })
  }

  public eventHandlerTouchCancel = (event: TouchEvent) => {
    Array.from(event.changedTouches).forEach(touch => {
      this.dispatch(this.composeData('cancel', event, touch))
    })
  }

  public listen() {
    this.manager.config.parent.addEventListener('touchstart',  this.eventHandlerTouchStart)
    this.manager.config.parent.addEventListener('touchmove',   this.eventHandlerTouchMove)
    this.manager.config.parent.addEventListener('touchend',    this.eventHandlerTouchEnd)
    this.manager.config.parent.addEventListener('touchcancel', this.eventHandlerTouchCancel)
  }

  public stop() {
    this.manager.config.parent.removeEventListener('touchstart',  this.eventHandlerTouchStart)
    this.manager.config.parent.removeEventListener('touchmove',   this.eventHandlerTouchMove)
    this.manager.config.parent.removeEventListener('touchend',    this.eventHandlerTouchEnd)
    this.manager.config.parent.removeEventListener('touchcancel', this.eventHandlerTouchCancel)
  }
} 