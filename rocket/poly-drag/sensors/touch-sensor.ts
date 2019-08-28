import {
  DOMUtil,
} from '../../rocket';

import {
  PolyDragEvent,
  PolyDragEventType,
} from '../poly-drag-event';

import {
  SensorHub
} from '../sensor-hub';

export class TouchSensor {
  public target?: HTMLElement;

  public isActive: boolean = false;

  public sensorHub: SensorHub;

  constructor(sensorHub: SensorHub) {
    this.sensorHub = sensorHub;
  }

  public attach(target: HTMLElement) {
    if (DOMUtil.isHTMLElement(target) === true) {
      target = target as HTMLElement;

      target.addEventListener('touchstart', this.onTouchStart);

      window.addEventListener('touchmove', this.onTouchMove);
      window.addEventListener('touchend', this.onTouchEnd);
      window.addEventListener('touchcancel', this.onTouchCancel);

      this.isActive = true;
    }
  }

  public detach() {
    if (DOMUtil.isHTMLElement(this.target) === true) {
      const target = this.target as HTMLElement;

      target.removeEventListener('touchstart', this.onTouchStart);

      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd);
      window.removeEventListener('touchcancel', this.onTouchCancel);

      this.isActive = false;
    }
  }

  private onTouchStart = (event: TouchEvent) => {
    this.dispatch('start', event);
  }

  private onTouchMove = (event: TouchEvent) => {
    this.dispatch('drag', event);
  }

  private onTouchEnd = (event: TouchEvent) => {
    this.dispatch('stop', event);
  }

  private onTouchCancel = (event: TouchEvent) => {
    this.dispatch('cancel', event);
  }

  private dispatch(type: PolyDragEventType, event: TouchEvent) {
    [...event.changedTouches].forEach(touch => {
      const polyDragEvent = new PolyDragEvent(this.sensorHub.polyDrag);

      polyDragEvent.setFromTouchEvent(type, event, touch);

      this.sensorHub.receive(polyDragEvent);
    });
  }
}