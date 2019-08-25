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

export class MouseSensor {
  public target?: HTMLElement;

  public isActive: boolean = false;
  public isDown: boolean = false;

  public sensorHub: SensorHub;

  constructor(sensorHub: SensorHub) {
    this.sensorHub = sensorHub;
  }

  public attach(target: HTMLElement) {
    if (DOMUtil.isHTMLElement(target) === true) {
      target = target as HTMLElement;

      target.addEventListener('mousedown', this.onMouseDown);
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
      window.addEventListener('mouseleave', this.onMouseLeave);

      this.isActive = true;
    }
  }

  public detach() {
    if (DOMUtil.isHTMLElement(this.target) === true) {
      const target = this.target as HTMLElement;

      target.removeEventListener('mousedown', this.onMouseDown);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
      window.removeEventListener('mouseleave', this.onMouseLeave);

      this.isActive = false;
    }
  }

  private onMouseDown = (event: MouseEvent) => {
    const dragEvent = new DragEvent(this.sensorHub.polyDrag);

    dragEvent.setFromMouseEvent('start', event);

    this.sensorHub.onDragStart(dragEvent);

    this.isDown = true;
  }

  private onMouseMove = (event: MouseEvent) => {
    if (this.isDown === true) {
      const dragEvent = new DragEvent(this.sensorHub.polyDrag);

      dragEvent.setFromMouseEvent('drag', event);

      this.sensorHub.onDrag(dragEvent);
    }
  }

  private onMouseUp = (event: MouseEvent) => {
    if (this.isDown === true) {
      const dragEvent = new DragEvent(this.sensorHub.polyDrag);

      dragEvent.setFromMouseEvent('stop', event);

      this.sensorHub.onDragEnd(dragEvent);

      this.isDown = false;
    }
  }

  private onMouseLeave = (event: MouseEvent) => {
    if (this.isDown === true) {
      const dragEvent = new DragEvent(this.sensorHub.polyDrag);

      dragEvent.setFromMouseEvent('cancel', event);

      this.sensorHub.onDragCancel(dragEvent);
    }
  }
}