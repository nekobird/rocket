import {
  DOMUtil,
} from '~/rocket';

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

  public target: HTMLElement | null = null;

  constructor(polyDrag: PolyDrag) {
    this.polyDrag = polyDrag;
  }

  public attach(): boolean {
    const { target } = this.polyDrag.config;

    if (
      this.isListening === false
      && DOMUtil.isHTMLElement(target) === true
    ) {
      this.target = target as HTMLElement;

      this.target.addEventListener('mousedown', this.onMouseDown);
      this.target.addEventListener('contextmenu', this.onContextMenu);

      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);

      // document.documentElement.addEventListener('mouseleave', this.onMouseLeave);

      this.isListening = true;

      return true;
    }

    return false;
  }

  public detach(): boolean {
    if (
      this.isListening === true
      && DOMUtil.isHTMLElement(this.target) === true
    ) {
      const target = this.target as HTMLElement;

      target.removeEventListener('mousedown', this.onMouseDown);
      target.removeEventListener('contextmenu', this.onContextMenu);

      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);

      // document.documentElement.removeEventListener('mouseleave', this.onMouseLeave);

      this.target = null;

      this.isListening = false;

      return true;
    }

    return false;
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