import {
  DragEventManager,
} from './poly-drag';

import {
  EventName,
  SensorData,
} from './sensor-hub';

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
      target: target as HTMLElement,
      screenX,
      screenY,
      pageX,
      pageY,
      clientX,
      clientY,
      event,
      touch: undefined,
    };
  }

  public eventHandlerMouseDown = (event: MouseEvent): void => {
    const { leftMouseButtonOnly } = this.manager.config;

    if (
      leftMouseButtonOnly === false
      || (
        leftMouseButtonOnly === true
        && event.button === 0
      )
    ) {
      this.isDown = true;

      const data = this.composeData('down', event);

      this.dispatch(data);
    }
  };

  public eventHandlerMouseMove = (event: MouseEvent): void => {
    if (this.isDown === true) {
      const data = this.composeData('drag', event);

      this.dispatch(data);
    }
  };

  public eventHandlerMouseUp = (event: MouseEvent): void => {
    this.isDown = false;

    const data = this.composeData('up', event);

    this.dispatch(data);
  };

  public listen() {
    if (this.isActive === false) {
      const { parent } = this.manager.config;

      parent.addEventListener('mousedown', this.eventHandlerMouseDown as EventListener);
      parent.addEventListener('mousemove', this.eventHandlerMouseMove as EventListener);
      parent.addEventListener('mouseup', this.eventHandlerMouseUp as EventListener);

      this.isActive = true;
    }
  }

  public stop() {
    if (this.isActive === true) {
      const { parent } = this.manager.config;

      parent.removeEventListener('mousedown', this.eventHandlerMouseDown as EventListener);
      parent.removeEventListener('mousemove', this.eventHandlerMouseMove as EventListener);
      parent.removeEventListener('mouseup', this.eventHandlerMouseUp as EventListener);

      this.isActive = false;
    }
  }
}
