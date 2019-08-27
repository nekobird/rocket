import {
  DOMUtil,
} from '../../rocket';

import {
  MonoTap,
} from '../mono-tap';

import {
  MonoTapEvent, MonoTapEventType,
} from '../mono-tap-event';

export class TouchSensor {
  public monoTap: MonoTap;

  public isListening: boolean = false;

  public touchIdentifier?: number;

  constructor(monoTap: MonoTap) {
    this.monoTap = monoTap;
  }

  public attach() {
    const { target } = this.monoTap.config;

    if (
      this.isListening === false
      && DOMUtil.isHTMLElement(target) === true
    ) {
      const targetElement = target as HTMLElement;

      targetElement.addEventListener('touchstart', this.onTouchStart);
      // window.addEventListener('touchmove', this.onTouchMove);
      window.addEventListener('touchend', this.onTouchEnd);
      window.addEventListener('touchcancel', this.onTouchCancel);

      this.isListening = true;
    }
  }

  public detach() {
    const { target } = this.monoTap.config;

    if (
      this.isListening === true
      && DOMUtil.isHTMLElement(target) === true
    ) {
      const targetElement = target as HTMLElement;

      targetElement.removeEventListener('touchstart', this.onTouchStart);
      // window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd);
      window.removeEventListener('touchcancel', this.onTouchCancel);

      this.isListening = false;
    }
  }

  private onTouchStart = (event: TouchEvent) => this.dispatch('down', event);

  private onTouchMove = (event: TouchEvent) => {
    // TODO: Do nothing for now.
  }

  private onTouchEnd = (event: TouchEvent) => this.dispatch('up', event);
  
  private onTouchCancel = (event: TouchEvent) => this.dispatch('cancel', event);

  private dispatch(type: MonoTapEventType, event: TouchEvent) {
    [...event.changedTouches].forEach(touch => {
      const tapEvent = new MonoTapEvent(this.monoTap, type, event, true, touch);

      this.monoTap.sensorHub.receive(tapEvent);
    });
  }
}