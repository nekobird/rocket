import {
  DragEventManager,
} from './dragEventManager';

import {
  EventName,
  SensorData,
} from './sensorHub';

export class MouseSensor {

  public manager: DragEventManager;

  public isDown: boolean = false;

  constructor(manager: DragEventManager) {
    this.manager = manager;
  }

  public dispatch(data: SensorData) {
    this.manager.sensorHub.receive(data);
  }

  public composeData(name: EventName, event: MouseEvent): SensorData {
    const { target, screenX, screenY, pageX, pageY, clientX, clientY } = event;
    return {
      identifier: 'mouse-event',
      type: 'MOUSE',
      name,
      time: Date.now(),
      target: <HTMLElement>target,
      screenX, screenY,
      pageX, pageY,
      clientX, clientY,
      event,
      touch: undefined,
    };
  }

  public eventHandlerMouseDown = (event: Event): void => {
    if (
      this.manager.config.leftMouseButtonOnly === false
      || (
        this.manager.config.leftMouseButtonOnly === true
        && (<MouseEvent>event).button === 0
      )
    ) {
      this.isDown = true;
      this.dispatch(
        this.composeData('down', <MouseEvent>event)
      );
    }
  }

  public eventHandlerMouseMove = (event: Event): void => {
    if (this.isDown === true) {
      this.dispatch(
        this.composeData('drag', <MouseEvent>event)
      );
    }
  }

  public eventHandlerMouseUp = (event: Event): void => {
    this.isDown = false;
    this.dispatch(
      this.composeData('up', <MouseEvent>event)
    );
  }

  public listen() {
    const { parent } = this.manager.config;
    parent.addEventListener('mousedown', this.eventHandlerMouseDown);
    parent.addEventListener('mousemove', this.eventHandlerMouseMove);
    parent.addEventListener('mouseup', this.eventHandlerMouseUp);
  }

  public stop() {
    const { parent } = this.manager.config;
    parent.removeEventListener('mousedown', this.eventHandlerMouseDown);
    parent.removeEventListener('mousemove', this.eventHandlerMouseMove);
    parent.removeEventListener('mouseup', this.eventHandlerMouseUp);
  }
}
