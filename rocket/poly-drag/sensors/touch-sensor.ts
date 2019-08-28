import {
  DOMUtil,
} from '../../rocket';

import {
  PolyDragEvent,
  PolyDragEventType,
} from '../poly-drag-event';

import {
  PolyDrag
} from '../poly-drag';

export class TouchSensor {
  public polyDrag: PolyDrag;

  public isListening: boolean = false;

  constructor(polyDrag: PolyDrag) {
    this.polyDrag = polyDrag;
  }

  public attach() {
    const { target } = this.polyDrag.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      const targetElement = target as HTMLElement;

      targetElement.addEventListener('touchstart', this.onTouchStart);

      window.addEventListener('touchmove', this.onTouchMove);
      window.addEventListener('touchend', this.onTouchEnd);
      window.addEventListener('touchcancel', this.onTouchCancel);

      this.isListening = true;
    }
  }

  public detach() {
    const { target } = this.polyDrag.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      const targetElement = target as HTMLElement;

      targetElement.removeEventListener('touchstart', this.onTouchStart);

      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd);
      window.removeEventListener('touchcancel', this.onTouchCancel);

      this.isListening = false;
    }
  }

  private onTouchStart = (event: TouchEvent) => {
    this.dispatch('start', event);
  }

  private onTouchMove = (event: TouchEvent) => {
    this.dispatch('drag', event);
  }

  private onTouchEnd = (event: TouchEvent) => {
    this.dispatch('stop', event);
  }

  private onTouchCancel = (event: TouchEvent) => {
    this.dispatch('cancel', event);
  }

  private dispatch(type: PolyDragEventType, event: TouchEvent) {
    [...event.changedTouches].forEach(touch => {
      const polyDragEvent = new PolyDragEvent(this.polyDrag, type, event, true, touch);

      this.polyDrag.sensorHub.receive(polyDragEvent);
    });
  }
}