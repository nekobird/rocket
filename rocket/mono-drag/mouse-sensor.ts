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
  private manager: MonoDrag;

  public isActive: boolean = false;

  constructor(manager: MonoDrag) {
    this.manager = manager;
  }

  public attach() {
    let { target } = this.manager.config;

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
    let { target } = this.manager.config;

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

    if (type !== 'down') {
      velocity = Vector2.subtract(position, this.manager.previousPosition);
      acceleration = Vector2.subtract(velocity, this.manager.previousVelocity);
    }

    const targetOffset = Vector2.clone(this.manager.targetOffset);

    this.manager.previousPosition.equals(position);
    this.manager.previousVelocity.equals(velocity);

    return {
      type,

      event,

      isTouch: false,

      target,

      targetOffset,

      position,
      velocity,
      acceleration,

      time: Date.now(),
    };
  }

  private eventHandlerMouseDown = (event: MouseEvent) => {
    const { isActive, config } = this.manager;

    if (
      isActive === false
      && config.condition(event, this.manager) === true
    ) {
      const pointerEvent = this.createDragEvent('down', event);

      this.manager.dragStart(pointerEvent);
    }
  }

  private eventHandlerMouseMove = (event: MouseEvent) => {
    const { isActive } = this.manager;

    if (isActive === true) {
      const pointerEvent = this.createDragEvent('drag', event);

      this.manager.drag(pointerEvent);
    }
  }

  private eventHandlerMouseUp = (event: MouseEvent) => {
    const { isActive } = this.manager;

    if (isActive === true) {
      const pointerEvent = this.createDragEvent('up', event);

      this.manager.dragEnd(pointerEvent);
    }
  }

  private eventHandlerMouseLeave = (event: MouseEvent) => {
    const { isActive } = this.manager;

    if (isActive === true) {
      const pointerEvent = this.createDragEvent('cancel', event);

      this.manager.dragCancel(pointerEvent);
    }
  }
}