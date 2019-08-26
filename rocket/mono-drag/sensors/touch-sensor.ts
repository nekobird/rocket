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

export class TouchSensor {
  private monoDrag: MonoDrag;

  public isActive: boolean = false;

  constructor(monoDrag: MonoDrag) {
    this.monoDrag = monoDrag;
  }

  public attach() {
    let { target } = this.monoDrag.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      target = target as HTMLElement;

      target.addEventListener('touchstart', this.onTouchStart);
      window.addEventListener('touchmove', this.onTouchMove);
      window.addEventListener('touchend', this.onTouchEnd);
      window.addEventListener('touchcancel', this.onTouchCancel);

      this.isActive = true;
    }
  }

  public detach() {
    let { target } = this.monoDrag.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      target = target as HTMLElement;

      target.removeEventListener('touchstart', this.onTouchStart);
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd);
      window.removeEventListener('touchcancel', this.onTouchCancel);

      this.isActive = false;
    }
  }

  private createDragEvent(type: DragEventType, originalEvent: TouchEvent, touch: Touch): DragEvent {
    return new DragEvent(this.monoDrag, type, originalEvent, true, touch);
  }

  private onTouchStart = (event: TouchEvent) => {
    const { isActive, config } = this.monoDrag;

    const dragEvent = this.createDragEvent('start', event, event.changedTouches[0]);

    if (
      isActive === false
      && config.condition(dragEvent, this.monoDrag) === true
    ) {
      this.monoDrag.dragStart(dragEvent, true);
    }
  }

  private onTouchMove = (event: TouchEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      const touch = [...event.changedTouches].find(touch => {
        return touch.identifier === this.monoDrag.touchIdentifier;
      });

      if (typeof touch !== 'undefined') {
        const dragEvent = this.createDragEvent('drag', event, touch);

        this.monoDrag.drag(dragEvent);
      }
    }
  }

  private onTouchEnd = (event: TouchEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      const touch = [...event.changedTouches].find(touch => {
        return touch.identifier === this.monoDrag.touchIdentifier;
      });

      if (typeof touch !== 'undefined') {
        const dragEvent = this.createDragEvent('stop', event, touch);

        this.monoDrag.dragStop(dragEvent);
      }
    }
  }

  private onTouchCancel = (event: TouchEvent) => {
    const { isActive } = this.monoDrag;

    if (isActive === true) {
      const touch = [...event.changedTouches].find(touch => {
        return touch.identifier === this.monoDrag.touchIdentifier;
      });

      if (typeof touch !== 'undefined') {
        const dragEvent = this.createDragEvent('cancel', event, touch);

        this.monoDrag.dragCancel(dragEvent);
      }
    }
  }
}