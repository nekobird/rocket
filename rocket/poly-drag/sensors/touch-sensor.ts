import {
  DOMUtil,
  Vector2,
} from '../../rocket';

import {
  PolyDrag,
} from '../poly-drag';

import {
  DragEvent,
  DragEventType,
} from '../drag-event';

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
    [...event.changedTouches].forEach(touch => {
      const dragEvent = new DragEvent(this.sensorHub.polyDrag);
      dragEvent.setFromTouchEvent('start', event, touch);

      this.sensorHub.onDragStart(dragEvent);
    });
  }

  private onTouchMove = (event: TouchEvent) => {
    [...event.changedTouches].forEach(touch => {
      const dragEvent = new DragEvent(this.sensorHub.polyDrag);
      dragEvent.setFromTouchEvent('drag', event, touch);

      this.sensorHub.onDrag(dragEvent);
    });
  }

  private onTouchEnd = (event: TouchEvent) => {
    [...event.changedTouches].forEach(touch => {
      const dragEvent = new DragEvent(this.sensorHub.polyDrag);
      dragEvent.setFromTouchEvent('stop', event, touch);

      this.sensorHub.onDragEnd(dragEvent);
    });
  }

  private onTouchCancel = (event: TouchEvent) => {
    [...event.changedTouches].forEach(touch => {
      const dragEvent = new DragEvent(this.sensorHub.polyDrag);
      dragEvent.setFromTouchEvent('cancel', event, touch);

      this.sensorHub.onDragCancel(dragEvent);
    });
  }
}