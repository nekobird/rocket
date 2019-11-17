import {
  DOMUtil,
} from '~/rocket';

import {
  MonoTap,
} from '../mono-tap';

import {
  MonoTapEvent,
  MonoTapEventType,
} from '../mono-tap-event';

import {
  Sensor,
} from './sensor';

export class TouchSensor extends Sensor {
  constructor(monoTap: MonoTap) {
    super(monoTap);
  }

  public attach(): boolean {
    const { target } = this.monoTap.config;

    if (
      this.isListening === false
      && DOMUtil.isHTMLElement(target) === true
    ) {
      this.target = target as HTMLElement;

      this.target.addEventListener('touchstart', this.onTouchStart);

      window.addEventListener('touchmove', this.onTouchMove);
      window.addEventListener('touchend', this.onTouchEnd);
      window.addEventListener('touchcancel', this.onTouchCancel);

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

      target.removeEventListener('touchstart', this.onTouchStart);

      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd);
      window.removeEventListener('touchcancel', this.onTouchCancel);

      this.isListening = false;

      return true;
    }

    return false;
  }

  private onTouchStart = (event: TouchEvent) => {
    this.dispatch('down', event);
  }

  private onTouchMove = (event: TouchEvent) => {
    this.dispatch('move', event);
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
