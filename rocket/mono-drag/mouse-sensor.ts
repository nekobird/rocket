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

export class MouseSensor {
  private monoDrag: MonoDrag;

  public isActive: boolean = false;

  constructor(monoDrag: MonoDrag) {
    this.monoDrag = monoDrag;
  }

  public attach() {
    let { target } = this.monoDrag.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      target = target as HTMLElement;

      target.addEventListener('mousedown', this.eventHandlerMouseDown);
      window.addEventListener('mousemove', this.eventHandlerMouseMove);
      window.addEventListener('mouseup', this.eventHandlerMouseUp);
      document.body.addEventListener('mouseleave', this.eventHandlerMouseLeave);

      this.isActive = true;
    }
  }

  public detach() {
    let { target } = this.monoDrag.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      target = target as HTMLElement;

      target.removeEventListener('mousedown', this.eventHandlerMouseDown);
      window.removeEventListener('mousemove', this.eventHandlerMouseMove);
      window.removeEventListener('mouseup', this.eventHandlerMouseUp);
      document.body.removeEventListener('mouseleave', this.eventHandlerMouseLeave);

      this.isActive = false;
    }
  }

  private createDragEvent(type: DragEventType, event: MouseEvent): DragEvent {
    const { clientX, clientY, target } = event;

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
      isTouch: false,
      offset,
      position,
      velocity,
      acceleration,
      time: Date.now(),
    };
  }

  private eventHandlerMouseDown = (event: MouseEvent) => {
    const { isActive, config } = this.monoDrag;

    if (
      isActive === false
      && config.condition(event, this.monoDrag) === true
    ) {
      const pointerEvent = this.createDragEvent('start', event);

      this.monoDrag.dragStart(pointerEvent);
    }
  }

  private eventHandlerMouseMove = (event: MouseEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      const pointerEvent = this.createDragEvent('drag', event);

      this.monoDrag.drag(pointerEvent);
    }
  }

  private eventHandlerMouseUp = (event: MouseEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      const pointerEvent = this.createDragEvent('stop', event);

      this.monoDrag.dragStop(pointerEvent);
    }
  }

  private eventHandlerMouseLeave = (event: MouseEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      const pointerEvent = this.createDragEvent('cancel', event);

      this.monoDrag.dragCancel(pointerEvent);
    }
  }
}