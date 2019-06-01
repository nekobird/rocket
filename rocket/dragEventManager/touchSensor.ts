import {
  DragEventManager,
} from './dragEventManager';

import {
  EventName,
  SensorData,
} from './sensorHub';

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
      target: <HTMLElement>target,
      screenX, screenY,
      pageX, pageY,
      clientX, clientY,
      event, touch,
    };
  }

  public eventHandlerTouchStart = (event: Event): void => {
    const touchEvent = <TouchEvent>event;
    Array.from(touchEvent.changedTouches).forEach(touch => {
      this.dispatch(
        this.composeData('down', touchEvent, touch)
      );
    });
  }

  public eventHandlerTouchMove = (event: Event): void => {
    const touchEvent = <TouchEvent>event;
    Array.from(touchEvent.changedTouches).forEach(touch => {
      this.dispatch(
        this.composeData('drag', touchEvent, touch)
      );
    });
  }

  public eventHandlerTouchEnd = (event: Event): void => {
    const touchEvent = <TouchEvent>event;
    Array.from(touchEvent.changedTouches).forEach(touch => {
      this.dispatch(
        this.composeData('up', touchEvent, touch)
      );
    });
  }

  public eventHandlerTouchCancel = (event: Event): void => {
    const touchEvent = <TouchEvent>event;
    Array.from(touchEvent.changedTouches).forEach(touch => {
      this.dispatch(
        this.composeData('cancel', touchEvent, touch)
      );
    });
  }

  public listen() {
    if (this.isActive === false) {
      const { parent } = this.manager.config;
      parent.addEventListener('touchstart', this.eventHandlerTouchStart);
      parent.addEventListener('touchmove', this.eventHandlerTouchMove);
      parent.addEventListener('touchend', this.eventHandlerTouchEnd);
      parent.addEventListener('touchcancel', this.eventHandlerTouchCancel);
      this.isActive = true;
    }
  }

  public stop() {
    if (this.isActive === true) {
      const { parent } = this.manager.config;
      parent.removeEventListener('touchstart', this.eventHandlerTouchStart);
      parent.removeEventListener('touchmove', this.eventHandlerTouchMove);
      parent.removeEventListener('touchend', this.eventHandlerTouchEnd);
      parent.removeEventListener('touchcancel', this.eventHandlerTouchCancel);
      this.isActive = false;
    }
  }
}
