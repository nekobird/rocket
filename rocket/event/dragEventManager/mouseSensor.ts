import {
  DragEventManager,
} from './dragEventManager'

import {
  EventName,
  SensorData,
} from './sensorHub'

export class MouseSensor {

  public manager: DragEventManager

  public isDown: boolean = false

  constructor(manager: DragEventManager) {
    this.manager = manager
  }

  public dispatch(data: SensorData) {
    this.manager.sensorHub.receive(data)
  }

  public composeData(name: EventName, event: MouseEvent): SensorData {
    return {
      identifier: 'mouse-event',
      type: 'MOUSE',
      name: name,
      time: Date.now(),
      target: <HTMLElement>event.target,
      screenX: event.screenX,
      screenY: event.screenY,
      pageX: event.pageX,
      pageY: event.pageY,
      clientX: event.clientX,
      clientY: event.clientY,
      event: event,
      touch: undefined
    }
  }

  public eventHandlerMouseDown = (event: MouseEvent) => {
    this.isDown = true
    this.dispatch(
      this.composeData('down', event)
    )
  }

  public eventHandlerMouseMove = (event: MouseEvent) => {
    if (this.isDown === true) {
      this.dispatch(
        this.composeData('drag', event)
      )
    }
  }

  public eventHandlerMouseUp = (event: MouseEvent) => {
    this.isDown = false
    this.dispatch(
      this.composeData('up', event)
    )
  }

  public listen() {
    this.manager.config.parent.addEventListener('mousedown', this.eventHandlerMouseDown)
    this.manager.config.parent.addEventListener('mousemove', this.eventHandlerMouseMove)
    this.manager.config.parent.addEventListener('mouseup',   this.eventHandlerMouseUp)
  }

  public stop() {
    this.manager.config.parent.removeEventListener('mousedown', this.eventHandlerMouseDown)
    this.manager.config.parent.removeEventListener('mousemove', this.eventHandlerMouseMove)
    this.manager.config.parent.removeEventListener('mouseup',   this.eventHandlerMouseUp)
  }
}