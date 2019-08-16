import {
  DOMUtil,
  Vector2,
} from '../rocket';

import {
  MonoDrag,
} from './mono-drag';

import {
  DragEvent,
  DragEventType,
} from './drag-event';

export class TouchSensor {
  private monoDrag: MonoDrag;

  public isActive: boolean = false;

  constructor(monoDrag: MonoDrag) {
    this.monoDrag = monoDrag;
  }

  public attach() {
    let { target } = this.monoDrag.config;

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
    let { target } = this.monoDrag.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      target = target as HTMLElement;

      target.removeEventListener('touchstart', this.eventHandlerTouchStart);
      window.removeEventListener('touchmove', this.eventHandlerTouchMove);
      window.removeEventListener('touchend', this.eventHandlerTouchEnd);
      window.removeEventListener('touchcancel', this.eventHandlerTouchCancel);

      this.isActive = false;
    }
  }

  private createDragEvent(type: DragEventType, event: TouchEvent, touch: Touch): DragEvent {
    const { identifier, clientX, clientY, target } = touch;

    const position = new Vector2(clientX, clientY);

    let velocity = new Vector2();
    let acceleration = new Vector2();

    if (type !== 'start') {
      velocity = Vector2.subtract(position, this.monoDrag.previousPosition);
      acceleration = Vector2.subtract(velocity, this.monoDrag.previousVelocity);
    }

    const offset = Vector2.clone(this.monoDrag.offset);

    this.monoDrag.previousPosition.equals(position);
    this.monoDrag.previousVelocity.equals(velocity);

    return {
      type,
      event,
      target,
      isTouch: true,
      touch,
      identifier,
      offset,
      position,
      velocity,
      acceleration,
      time: Date.now(),
    };
  }

  private eventHandlerTouchStart = (event: TouchEvent) => {
    const { isActive, config } = this.monoDrag;

    if (
      isActive === false
      && config.condition(event, this.monoDrag) === true
    ) {
      const pointerEvent = this.createDragEvent('start', event, event.changedTouches[0]);

      this.monoDrag.dragStart(pointerEvent, true);
    }
  }

  private eventHandlerTouchMove = (event: TouchEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      [...event.changedTouches].forEach(touch => {
        if (touch.identifier === this.monoDrag.touchIdentifier) {
          const pointerEvent = this.createDragEvent('drag', event, touch);

          this.monoDrag.drag(pointerEvent);
        }
      });
    }
  }

  private eventHandlerTouchEnd = (event: TouchEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      [...event.changedTouches].forEach(touch => {
        if (touch.identifier === this.monoDrag.touchIdentifier) {
          const pointerEvent = this.createDragEvent('stop', event, touch);

          this.monoDrag.dragStop(pointerEvent);
        }
      });
    }
  }

  private eventHandlerTouchCancel = (event: TouchEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      [...event.changedTouches].forEach(touch => {
        if (touch.identifier === this.monoDrag.touchIdentifier) {
          const pointerEvent = this.createDragEvent('cancel', event, touch);

          this.monoDrag.dragCancel(pointerEvent);
        }
      });
    }
  }
}