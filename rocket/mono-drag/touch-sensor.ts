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

      target.addEventListener('touchstart', this.onTouchStart);
      window.addEventListener('touchmove', this.onTouchMove);
      window.addEventListener('touchend', this.onTouchEnd);
      window.addEventListener('touchcancel', this.onTouchCancel);

      this.isActive = true;
    }
  }

  public detach() {
    let { target } = this.monoDrag.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      target = target as HTMLElement;

      target.removeEventListener('touchstart', this.onTouchStart);
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd);
      window.removeEventListener('touchcancel', this.onTouchCancel);

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

  private onTouchStart = (event: TouchEvent) => {
    const { isActive, config } = this.monoDrag;

    const dragEvent = this.createDragEvent('start', event, event.changedTouches[0]);

    if (
      isActive === false
      && config.condition(dragEvent, this.monoDrag) === true
    ) {
      this.monoDrag.dragStart(dragEvent, true);
    }
  }

  private onTouchMove = (event: TouchEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      [...event.changedTouches].forEach(touch => {
        if (touch.identifier === this.monoDrag.touchIdentifier) {
          const dragEvent = this.createDragEvent('drag', event, touch);

          this.monoDrag.drag(dragEvent);
        }
      });
    }
  }

  private onTouchEnd = (event: TouchEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      [...event.changedTouches].forEach(touch => {
        if (touch.identifier === this.monoDrag.touchIdentifier) {
          const dragEvent = this.createDragEvent('stop', event, touch);

          this.monoDrag.dragStop(dragEvent);
        }
      });
    }
  }

  private onTouchCancel = (event: TouchEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      [...event.changedTouches].forEach(touch => {
        if (touch.identifier === this.monoDrag.touchIdentifier) {
          const dragEvent = this.createDragEvent('cancel', event, touch);

          this.monoDrag.dragCancel(dragEvent);
        }
      });
    }
  }
}