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

  private createMonoDragEvent(type: MonoDragEventType, originalEvent: MouseEvent): MonoDragEvent {
    return new MonoDragEvent(this.monoDrag, type, originalEvent, false);
  }

  private onMouseDown = (event: MouseEvent) => {
    const { isActive, config } = this.monoDrag;

    const dragEvent = this.createMonoDragEvent('start', event);

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
      const dragEvent = this.createMonoDragEvent('drag', event);

      this.monoDrag.drag(dragEvent);
    }
  }

  private onMouseUp = (event: MouseEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      const dragEvent = this.createMonoDragEvent('stop', event);

      this.monoDrag.dragStop(dragEvent);
    }
  }

  private onMouseLeave = (event: MouseEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      const dragEvent = this.createMonoDragEvent('cancel', event);

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