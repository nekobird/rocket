import {
  DOMUtil,
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

  public isListening: boolean = false;

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

      this.isListening = true;
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

      this.isListening = false;
    }
  }

  private createDragEvent(type: DragEventType, originalEvent: MouseEvent): DragEvent {
    return new DragEvent(this.monoDrag, type, originalEvent, false);
  }

  private onMouseDown = (event: MouseEvent) => {
    const { isListening, config } = this.monoDrag;

    const dragEvent = this.createDragEvent('start', event);

    if (
      isListening === false
      && config.condition(dragEvent, this.monoDrag) === true
    ) {
      this.monoDrag.dragStart(dragEvent);
    }
  }

  private onMouseMove = (event: MouseEvent) => {
    const { isListening } = this.monoDrag;

    if (isListening === true) {
      const dragEvent = this.createDragEvent('drag', event);

      this.monoDrag.drag(dragEvent);
    }
  }

  private onMouseUp = (event: MouseEvent) => {
    const { isListening } = this.monoDrag;

    if (isListening === true) {
      const dragEvent = this.createDragEvent('stop', event);

      this.monoDrag.dragStop(dragEvent);
    }
  }

  private onMouseLeave = (event: MouseEvent) => {
    const { isListening } = this.monoDrag;

    if (isListening === true) {
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