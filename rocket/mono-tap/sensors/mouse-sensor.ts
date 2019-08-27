import {
  DOMUtil,
} from '../../rocket';

import {
  MonoTap,
} from '../mono-tap';

import {
  MonoTapEvent, MonoTapEventType,
} from '../mono-tap-event';

export class MouseSensor {
  public monoTap: MonoTap;

  public isListening: boolean = false;
  public isDown: boolean = false;

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

      targetElement.addEventListener('mousedown', this.onMouseDown);
      // window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);

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

      targetElement.removeEventListener('mousedown', this.onMouseDown);
      // window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);

      this.isListening = false;
    }
  }

  private onMouseDown = (event: MouseEvent) => {
    this.isDown = true;

    this.dispatch('down', event);
  }

  private onMouseMove = (event: MouseEvent) => {
    // TODO: Do nothing for now.
  }

  private onMouseUp = (event: MouseEvent) => {
    this.isDown = false;

    this.dispatch('up', event);
  }

  private dispatch(type: MonoTapEventType, event: MouseEvent) {
    const tapEvent = new MonoTapEvent(this.monoTap, type, event);

    this.monoTap.sensorHub.receive(tapEvent);
  }
}