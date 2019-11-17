import {
  DOMUtil,
} from '~/rocket';

import {
  MonoDrag,
} from '../mono-drag';

import {
  MonoDragEvent,
  MonoDragEventType,
} from '../mono-drag-event';

export class MouseSensor {
  private monoDrag: MonoDrag;

  public isListening: boolean = false;

  public mouseButtonIsDown: boolean = false;

  private target: HTMLElement | null = null;

  constructor(monoDrag: MonoDrag) {
    this.monoDrag = monoDrag;
  }

  public attach(): boolean {
    let { target } = this.monoDrag.config;

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
    if (this.mouseButtonIsDown === false) {
      this.dispatch('start', event);

      this.mouseButtonIsDown = true;
    }
  }

  private onMouseMove = (event: MouseEvent) => {
    if (this.mouseButtonIsDown === true) {
      this.dispatch('drag', event);
    }
  }

  private onMouseUp = (event: MouseEvent) => {
    if (this.mouseButtonIsDown === true) {
      this.mouseButtonIsDown = false;

      this.dispatch('stop', event);
    }
  }

  private onMouseLeave = (event: MouseEvent) => {
    if (this.mouseButtonIsDown === true) {
      this.mouseButtonIsDown = false;

      this.dispatch('cancel', event);
    }
  }

  private onContextMenu = (event: MouseEvent) => {
    const { disableContextMenu } = this.monoDrag.config;

    if (disableContextMenu === true) {
      event.preventDefault();

      event.stopPropagation();
    }
  }

  private dispatch(type: MonoDragEventType, event: MouseEvent) {
    const monoDragEvent = new MonoDragEvent(this.monoDrag, type, event);

    this.monoDrag.sensorHub.receive(monoDragEvent);
  }
}