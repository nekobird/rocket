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
  private manager: MonoDrag;

  public isActive: boolean = false;

  constructor(manager: MonoDrag) {
    this.manager = manager;
  }

  public attach() {
    let { target } = this.manager.config;

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
    let { target } = this.manager.config;

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

    if (type !== 'down') {
      velocity = Vector2.subtract(position, this.manager.previousPosition);
      acceleration = Vector2.subtract(velocity, this.manager.previousVelocity);
    }

    const targetOffset = Vector2.clone(this.manager.targetOffset);

    this.manager.previousPosition.equals(position);
    this.manager.previousVelocity.equals(velocity);

    return {
      type,

      isTouch: true,

      event,
      touch,
      
      identifier,

      target,      

      targetOffset,

      position,
      velocity,
      acceleration,

      time: Date.now(),
    };
  }

  private eventHandlerTouchStart = (event: TouchEvent) => {
    const { isActive, config } = this.manager;

    if (
      isActive === false
      && config.condition(event, this.manager) === true
    ) {
      const pointerEvent = this.createDragEvent('down', event, event.changedTouches[0]);

      this.manager.dragStart(pointerEvent, true);
    }
  }

  private eventHandlerTouchMove = (event: TouchEvent) => {
    const { isActive } = this.manager;

    if (isActive === true) {
      [...event.changedTouches].forEach(touch => {
        if (touch.identifier === this.manager.touchIdentifier) {
          const pointerEvent = this.createDragEvent('drag', event, touch);

          this.manager.drag(pointerEvent);
        }
      });
    }
  }

  private eventHandlerTouchEnd = (event: TouchEvent) => {
    const { isActive } = this.manager;

    if (isActive === true) {
      [...event.changedTouches].forEach(touch => {
        if (touch.identifier === this.manager.touchIdentifier) {
          const pointerEvent = this.createDragEvent('up', event, touch);

          this.manager.dragEnd(pointerEvent);
        }
      });
    }
  }

  private eventHandlerTouchCancel = (event: TouchEvent) => {
    const { isActive } = this.manager;

    if (isActive === true) {
      [...event.changedTouches].forEach(touch => {
        if (touch.identifier === this.manager.touchIdentifier) {
          const pointerEvent = this.createDragEvent('cancel', event, touch);

          this.manager.dragCancel(pointerEvent);
        }
      });
    }
  }
}