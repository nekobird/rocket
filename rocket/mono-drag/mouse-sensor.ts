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

      target.addEventListener('mousedown', this.onMouseDown);
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
      document.documentElement.addEventListener('mouseleave', this.onMouseLeave);

      this.isActive = true;
    }
  }

  public detach() {
    let { target } = this.monoDrag.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      target = target as HTMLElement;

      target.removeEventListener('mousedown', this.onMouseDown);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
      document.documentElement.removeEventListener('mouseleave', this.onMouseLeave);

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

  private onMouseDown = (event: MouseEvent) => {
    const { isActive, config } = this.monoDrag;

    const dragEvent = this.createDragEvent('start', event);

    if (
      isActive === false
      && config.condition(dragEvent, this.monoDrag) === true
    ) {
      this.monoDrag.dragStart(dragEvent);
    }
  }

  private onMouseMove = (event: MouseEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      const dragEvent = this.createDragEvent('drag', event);

      this.monoDrag.drag(dragEvent);
    }
  }

  private onMouseUp = (event: MouseEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      const dragEvent = this.createDragEvent('stop', event);

      this.monoDrag.dragStop(dragEvent);
    }
  }

  private onMouseLeave = (event: MouseEvent) => {
    const { isActive } = this.monoDrag;
    console.log('leaving');
    if (isActive === true) {
      const dragEvent = this.createDragEvent('cancel', event);

      this.monoDrag.dragCancel(dragEvent);
    }
  }
}