import {
  DOMUtil,
} from '../../rocket';

import {
  MonoTap,
} from '../mono-tap';

import {
  MonoTapEvent,
  MonoTapEventType,
} from '../mono-tap-event';

export class TouchSensor {
  public monoTap: MonoTap;

  public isListening: boolean = false;

  public target?: HTMLElement;

  constructor(monoTap: MonoTap) {
    this.monoTap = monoTap;
  }

  public attach() {
    const { target } = this.monoTap.config;

    if (
      this.isListening === false
      && DOMUtil.isHTMLElement(target) === true
    ) {
      this.target = target as HTMLElement;

      this.target.addEventListener('touchstart', this.onTouchStart);

      window.addEventListener('touchend', this.onTouchEnd);
      window.addEventListener('touchcancel', this.onTouchCancel);

      this.isListening = true;
    }
  }

  public detach() {
    if (
      this.isListening === true
      && DOMUtil.isHTMLElement(this.target) === true
    ) {
      const target = this.target as HTMLElement;

      target.removeEventListener('touchstart', this.onTouchStart);

      window.removeEventListener('touchend', this.onTouchEnd);
      window.removeEventListener('touchcancel', this.onTouchCancel);

      this.isListening = false;
    }
  }

  private onTouchStart = (event: TouchEvent) => {
    this.dispatch('down', event);
  }

  private onTouchEnd = (event: TouchEvent) => {
    this.dispatch('up', event);
  }
  
  private onTouchCancel = (event: TouchEvent) => {
    this.dispatch('cancel', event);
  }

  private dispatch(type: MonoTapEventType, event: TouchEvent) {
    [...event.changedTouches].forEach(touch => {
      const tapEvent = new MonoTapEvent(this.monoTap, type, event, true, touch);

      this.monoTap.sensorHub.receive(tapEvent);
    });
  }
}
