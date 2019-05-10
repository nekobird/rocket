import {
  MouseTouchManager
} from './mouseTouchManager'

import {
  SensorEventName,
  SensorData,
} from './sensorHub'

export class MouseSensor {

  public isDown: boolean = false
  public isDrag: boolean = false
  public manager: MouseTouchManager

  constructor(manager: MouseTouchManager) {
    this.manager = manager
  }

  public dispatch(data: SensorData) {
    this.manager.sensorHub.receive(data)
  }

  public composeData(name: SensorEventName, event: MouseEvent): SensorData {
    return {
      identifier: 'mouse-event',
      type: 'MOUSE',
      name: name,
      time: Date.now(),
      target: <HTMLElement>event.target,
      x: event.clientX,
      y: event.clientY,
      event: event,
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
    window.addEventListener('mousedown', this.eventHandlerMouseDown)
    window.addEventListener('mousemove', this.eventHandlerMouseMove)
    window.addEventListener('mouseup',   this.eventHandlerMouseUp)
  }

  public stop() {
    window.removeEventListener('mousedown', this.eventHandlerMouseDown)
    window.removeEventListener('mousemove', this.eventHandlerMouseMove)
    window.removeEventListener('mouseup',   this.eventHandlerMouseUp)
  }
}