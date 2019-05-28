import {
  DragEventManager,
} from './dragEventManager';

import {
  EventName,
  SensorData,
} from './sensorHub';

export class TouchSensor {

  public manager: DragEventManager;

  constructor(manager: DragEventManager) {
    this.manager = manager;
  }

  public dispatch(data: SensorData) {
    this.manager.sensorHub.receive(data);
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
    this.manager.config.parent.addEventListener('touchstart', this.eventHandlerTouchStart);
    this.manager.config.parent.addEventListener('touchmove', this.eventHandlerTouchMove);
    this.manager.config.parent.addEventListener('touchend', this.eventHandlerTouchEnd);
    this.manager.config.parent.addEventListener('touchcancel', this.eventHandlerTouchCancel);
  }

  public stop() {
    this.manager.config.parent.removeEventListener('touchstart', this.eventHandlerTouchStart);
    this.manager.config.parent.removeEventListener('touchmove', this.eventHandlerTouchMove);
    this.manager.config.parent.removeEventListener('touchend', this.eventHandlerTouchEnd);
    this.manager.config.parent.removeEventListener('touchcancel', this.eventHandlerTouchCancel);
  }
}
