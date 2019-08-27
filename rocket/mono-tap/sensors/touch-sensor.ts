import {
  DOMUtil,
} from '../../rocket';

import {
  MonoTap,
} from '../mono-tap';

import {
  MonoTapEvent,
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

  private onTouchStart = (event: TouchEvent) => {
    [...event.changedTouches].forEach(touch => {
      const tapEvent = new MonoTapEvent(this.monoTap, 'down', event, true, touch);

      this.monoTap.sensorHub.dispatch(tapEvent);
    });
  }

  private onTouchMove = (event: TouchEvent) => {
    // TODO: Do nothing for now.
  }

  private onTouchEnd = (event: TouchEvent) => {
    [...event.changedTouches].forEach(touch => {
      const tapEvent = new MonoTapEvent(this.monoTap, 'up', event, true, touch);

      this.monoTap.sensorHub.dispatch(tapEvent);
    });
  }

  private onTouchCancel = (event: TouchEvent) => {
    [...event.changedTouches].forEach(touch => {
      const tapEvent = new MonoTapEvent(this.monoTap, 'cancel', event, true, touch);

      this.monoTap.sensorHub.dispatch(tapEvent);
    });
  }
}