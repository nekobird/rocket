import {
  DOMUtil,
} from '../../rocket';

import {
  PolyDragEvent,
  PolyDragEventType,
} from '../poly-drag-event';

import {
  PolyDrag,
} from '../poly-drag';

export class MouseSensor {
  public polyDrag: PolyDrag;

  public isListening: boolean = false;

  public mouseButtonIsDown: boolean = false;

  constructor(polyDrag: PolyDrag) {
    this.polyDrag = polyDrag;
  }

  public attach() {
    const { target } = this.polyDrag.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      const targetElement = target as HTMLElement;

      targetElement.addEventListener('mousedown', this.onMouseDown);
      targetElement.addEventListener('contextmenu', this.onContextMenu);

      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);

      document.documentElement.addEventListener('mouseleave', this.onMouseLeave);

      this.isListening = true;
    }
  }

  public detach() {
    const { target } = this.polyDrag.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      const targetElement = target as HTMLElement;

      targetElement.removeEventListener('mousedown', this.onMouseDown);
      targetElement.removeEventListener('contextmenu', this.onContextMenu);

      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);

      document.documentElement.removeEventListener('mouseleave', this.onMouseLeave);

      this.isListening = false;
    }
  }

  private onMouseDown = (event: MouseEvent) => {
    this.dispatch('start', event);

    this.mouseButtonIsDown = true;
  }

  private onMouseMove = (event: MouseEvent) => {
    if (this.mouseButtonIsDown === true) {
      this.dispatch('drag', event);
    }
  }

  private onMouseUp = (event: MouseEvent) => {
    if (this.mouseButtonIsDown === true) {
      this.dispatch('stop', event);

      this.mouseButtonIsDown = false;
    }
  }

  private onMouseLeave = (event: MouseEvent) => {
    if (this.mouseButtonIsDown === true) {
      this.dispatch('cancel', event);
    }
  }

  private onContextMenu = (event: MouseEvent) => {
    const { disableContextMenu } = this.polyDrag.config;

    if (disableContextMenu === true) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private dispatch(type: PolyDragEventType, event: MouseEvent) {
    const polyDragEvent = new PolyDragEvent(this.polyDrag, type, event);

    this.polyDrag.sensorHub.receive(polyDragEvent);
  }
}