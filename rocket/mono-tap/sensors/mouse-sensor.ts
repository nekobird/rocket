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

  public attach(): boolean {
    const { target } = this.monoTap.config;

    if (
      this.isListening === false
      && DOMUtil.isHTMLElement(target) === true
    ) {
      this.target = target as HTMLElement;

      this.target.addEventListener('mousedown', this.onMouseDown);

      window.addEventListener('mousemove', this.onMouseMove);

      window.addEventListener('mouseup', this.onMouseUp);

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

      target.removeEventListener('mousedown', this.onMouseDown);

      window.removeEventListener('mousemove', this.onMouseMove);

      window.removeEventListener('mouseup', this.onMouseUp);

      this.isListening = false;

      return true;
    }

    return false;
  }

  private onMouseDown = (event: MouseEvent) => {
    this.mouseButtonIsDown = true;

    this.dispatch('down', event);
  }

  private onMouseMove = (event: MouseEvent) => {
    this.mouseButtonIsDown = true;

    this.dispatch('move', event);
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
