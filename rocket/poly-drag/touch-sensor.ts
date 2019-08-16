import {
  DragEventManager,
} from './poly-drag';

import {
  EventName,
  SensorData,
} from './sensor-hub';

export class TouchSensor {
  public manager: DragEventManager;

  public isActive: boolean = false;

  constructor(manager: DragEventManager) {
    this.manager = manager;
  }

  public dispatch(data: SensorData) {
    const { config, sensorHub } = this.manager;

    if (config.listenTo.indexOf('TOUCH') !== -1) {
      sensorHub.receive(data);
    }
  }

  public composeData(name: EventName, event: TouchEvent, touch: Touch): SensorData {
    const { target, screenX, screenY, pageX, pageY, clientX, clientY } = touch;

    return {
      identifier: touch.identifier.toString(),
      type: 'TOUCH',
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
      touch,
    };
  }

  public eventHandlerTouchStart = (event: TouchEvent): void => {
    Array.from(event.changedTouches).forEach(touch => {
      const data = this.composeData('down', event, touch);
      this.dispatch(data);
    });
  };

  public eventHandlerTouchMove = (event: TouchEvent): void => {
    Array.from(event.changedTouches).forEach(touch => {
      const data = this.composeData('drag', event, touch);
      this.dispatch(data);
    });
  };

  public eventHandlerTouchEnd = (event: TouchEvent): void => {
    Array.from(event.changedTouches).forEach(touch => {
      const data = this.composeData('up', event, touch);
      this.dispatch(data);
    });
  };

  public eventHandlerTouchCancel = (event: TouchEvent): void => {
    Array.from(event.changedTouches).forEach(touch => {
      const data = this.composeData('cancel', event, touch);
      this.dispatch(data);
    });
  };

  public listen() {
    if (this.isActive === false) {
      const { parent } = this.manager.config;

      parent.addEventListener('touchstart', this.eventHandlerTouchStart as EventListener);
      parent.addEventListener('touchmove', this.eventHandlerTouchMove as EventListener);
      parent.addEventListener('touchend', this.eventHandlerTouchEnd as EventListener);
      parent.addEventListener('touchcancel', this.eventHandlerTouchCancel as EventListener);

      this.isActive = true;
    }
  }

  public stop() {
    if (this.isActive === true) {
      const { parent } = this.manager.config;

      parent.removeEventListener('touchstart', this.eventHandlerTouchStart as EventListener);
      parent.removeEventListener('touchmove', this.eventHandlerTouchMove as EventListener);
      parent.removeEventListener('touchend', this.eventHandlerTouchEnd as EventListener);
      parent.removeEventListener('touchcancel', this.eventHandlerTouchCancel as EventListener);

      this.isActive = false;
    }
  }
}
