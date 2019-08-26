import {
  DOMUtil,
  Vector2,
} from '../../rocket';

import {
  MonoDrag,
} from '../mono-drag';

import {
  DragEvent,
  DragEventType,
} from '../drag-event';

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
      target.addEventListener('contextmenu', this.onContextMenu);

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
      target.removeEventListener('contextmenu', this.onContextMenu);

      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);

      document.documentElement.removeEventListener('mouseleave', this.onMouseLeave);

      this.isActive = false;
    }
  }

  private createDragEvent(type: DragEventType, originalEvent: MouseEvent): DragEvent {
    const {
      clientX,
      clientY,
      target: targetFromEvent
    } = originalEvent;

    const target = document.elementFromPoint(clientX, clientY) as HTMLElement | null;

    const position = new Vector2(clientX, clientY);
    const velocity = new Vector2();
    const acceleration = new Vector2();

    if (type !== 'start') {
      const { previousPosition, previousVelocity } = this.monoDrag;

      velocity.equals(Vector2.subtract(position, previousPosition));
      acceleration.equals(Vector2.subtract(velocity, previousVelocity));
    }

    this.monoDrag.previousPosition.equals(position);
    this.monoDrag.previousVelocity.equals(velocity);

    const offset = Vector2.clone(this.monoDrag.offset);

    return {
      type,

      isTouch: false,

      originalEvent,

      targetFromEvent,
      target,

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

    if (isActive === true) {
      const dragEvent = this.createDragEvent('cancel', event);

      this.monoDrag.dragCancel(dragEvent);
    }
  }

  private onContextMenu = (event: MouseEvent) => {
    const { disableContextMenu } = this.monoDrag.config;

    if (disableContextMenu === true) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}