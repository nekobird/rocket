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

export class MouseSensor {
  public monoTap: MonoTap;

  public isListening: boolean = false;

  public mouseButtonIsDown: boolean = false;

  private target?: HTMLElement;

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

      this.target.addEventListener('mousedown', this.onMouseDown);

      window.addEventListener('mouseup', this.onMouseUp);

      this.isListening = true;
    }
  }

  public detach() {
    if (
      this.isListening === true
      && DOMUtil.isHTMLElement(this.target) === true
    ) {
      const target = this.target as HTMLElement;

      target.removeEventListener('mousedown', this.onMouseDown);

      window.removeEventListener('mouseup', this.onMouseUp);

      this.isListening = false;
    }
  }

  private onMouseDown = (event: MouseEvent) => {
    this.mouseButtonIsDown = true;

    this.dispatch('down', event);
  }

  private onMouseUp = (event: MouseEvent) => {
    this.mouseButtonIsDown = false;

    this.dispatch('up', event);
  }

  private dispatch(type: MonoTapEventType, event: MouseEvent) {
    const tapEvent = new MonoTapEvent(this.monoTap, type, event);

    this.monoTap.sensorHub.receive(tapEvent);
  }
}
