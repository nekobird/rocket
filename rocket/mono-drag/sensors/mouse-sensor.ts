import {
  DOMUtil,
} from '../../rocket';

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

  public isDown: boolean = false;

  constructor(monoDrag: MonoDrag) {
    this.monoDrag = monoDrag;
  }

  public attach() {
    let { target } = this.monoDrag.config;

    if (
      this.isListening === false
      && DOMUtil.isHTMLElement(target) === true
    ) {
      target = target as HTMLElement;

      target.addEventListener('mousedown', this.onMouseDown);
      target.addEventListener('contextmenu', this.onContextMenu);

      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);

      document.documentElement.addEventListener('mouseleave', this.onMouseLeave);

      this.isListening = true;
    }
  }

  public detach() {
    let { target } = this.monoDrag.config;

    if (
      this.isListening === true
      && DOMUtil.isHTMLElement(target) === true
    ) {
      target = target as HTMLElement;

      target.removeEventListener('mousedown', this.onMouseDown);
      target.removeEventListener('contextmenu', this.onContextMenu);

      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);

      document.documentElement.removeEventListener('mouseleave', this.onMouseLeave);

      this.isListening = false;
    }
  }

  private onMouseDown = (event: MouseEvent) => {
    this.dispatch('start', event);

    this.isDown = true;
  }

  private onMouseMove = (event: MouseEvent) => {
    if (this.isDown === true) {
      this.dispatch('drag', event);
    }
  }

  private onMouseUp = (event: MouseEvent) => {
    if (this.isDown === true) {
      this.dispatch('stop', event);

      this.isDown = false;
    }
  }

  private onMouseLeave = (event: MouseEvent) => {
    if (this.isDown === true) {
      this.dispatch('cancel', event);

      this.isDown = false;
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