import {
  DragEventManager,
} from './dragEventManager';

import {
  EventName,
  SensorData,
} from './sensorHub';

export class MouseSensor {
  public manager: DragEventManager;

  public isActive: boolean = false;
  public isDown: boolean = false;

  constructor(manager: DragEventManager) {
    this.manager = manager;
  }

  public dispatch(data: SensorData) {
    const { config, sensorHub } = this.manager;
    if (config.listenTo.indexOf('MOUSE') !== -1) {
      sensorHub.receive(data);
    }
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
    const { leftMouseButtonOnly } = this.manager.config; 
    if (
      leftMouseButtonOnly === false
      || (
        leftMouseButtonOnly === true
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
    if (this.isActive === false) {
      const { parent } = this.manager.config;
      parent.addEventListener('mousedown', this.eventHandlerMouseDown);
      parent.addEventListener('mousemove', this.eventHandlerMouseMove);
      parent.addEventListener('mouseup', this.eventHandlerMouseUp);
      this.isActive = true;
    }
  }

  public stop() {
    if (this.isActive === true) {
      const { parent } = this.manager.config;
      parent.removeEventListener('mousedown', this.eventHandlerMouseDown);
      parent.removeEventListener('mousemove', this.eventHandlerMouseMove);
      parent.removeEventListener('mouseup', this.eventHandlerMouseUp);
      this.isActive = false;
    }
  }
}
