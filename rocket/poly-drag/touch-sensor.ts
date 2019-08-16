import {
  DOMUtil,
  Vector2,
} from '../rocket';

import {
  PolyDrag,
} from './poly-drag';

import {
  DragEvent,
  DragEventType,
} from './drag-event';

import {
  SensorHub
} from './sensor-hub';

export class TouchSensor {
  private polyDrag: PolyDrag;

  public target?: HTMLElement;

  public isActive: boolean = false;

  public sensorHub: SensorHub;

  constructor(sensorHub: SensorHub) {
    this.sensorHub = sensorHub;
  }

  public attach(target: HTMLElement) {
    if (DOMUtil.isHTMLElement(target) === true) {
      target = target as HTMLElement;

      target.addEventListener('touchstart', this.eventHandlerTouchStart);
      window.addEventListener('touchmove', this.eventHandlerTouchMove);
      window.addEventListener('touchend', this.eventHandlerTouchEnd);
      window.addEventListener('touchcancel', this.eventHandlerTouchCancel);

      this.isActive = true;
    }
  }

  public detach() {
    if (DOMUtil.isHTMLElement(this.target) === true) {
      const target = this.target as HTMLElement;

      target.removeEventListener('touchstart', this.eventHandlerTouchStart);
      window.removeEventListener('touchmove', this.eventHandlerTouchMove);
      window.removeEventListener('touchend', this.eventHandlerTouchEnd);
      window.removeEventListener('touchcancel', this.eventHandlerTouchCancel);

      this.isActive = false;
    }
  }



  private eventHandlerTouchStart = (event: TouchEvent) => {
    const { isActive, config } = this.polyDrag;

    if (
      isActive === false
      && config.condition(event, this.polyDrag) === true
    ) {
      const pointerEvent = this.createDragEvent('start', event, event.changedTouches[0]);

      this.polyDrag.dragStart(pointerEvent, true);
    }
  }

  private eventHandlerTouchMove = (event: TouchEvent) => {
    const { isActive } = this.polyDrag;

    if (isActive === true) {
      [...event.changedTouches].forEach(touch => {
        if (touch.identifier === this.polyDrag.touchIdentifier) {
          const pointerEvent = this.createDragEvent('drag', event, touch);

          this.polyDrag.drag(pointerEvent);
        }
      });
    }
  }

  private eventHandlerTouchEnd = (event: TouchEvent) => {
    const { isActive } = this.polyDrag;

    if (isActive === true) {
      [...event.changedTouches].forEach(touch => {
        if (touch.identifier === this.polyDrag.touchIdentifier) {
          const pointerEvent = this.createDragEvent('stop', event, touch);

          this.polyDrag.dragStop(pointerEvent);
        }
      });
    }
  }

  private eventHandlerTouchCancel = (event: TouchEvent) => {
    const { isActive } = this.polyDrag;

    if (isActive === true) {
      [...event.changedTouches].forEach(touch => {
        if (touch.identifier === this.polyDrag.touchIdentifier) {
          const pointerEvent = this.createDragEvent('cancel', event, touch);

          this.polyDrag.dragCancel(pointerEvent);
        }
      });
    }
  }
}