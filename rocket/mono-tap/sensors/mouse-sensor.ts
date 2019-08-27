import {
  DOMTraverse,
  DOMUtil,
} from '../../rocket';

import {
  MonoTap,
} from '../mono-tap';

import {
  TapEvent,
} from '../tap-event';

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
      target.addEventListener('mousedown', this.onMouseDown);
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
      target.removeEventListener('mousedown', this.onMouseDown);
      // window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);

      this.isListening = false;
    }
  }

  private onMouseDown = (event: MouseEvent) => {
    this.isDown = true;

    const tapEvent = new TapEvent(this.monoTap, 'down', event);

    this.monoTap.sensorHub.dispatch(tapEvent);
  }

  private onMouseMove = (event: MouseEvent) => {
    // TODO: Do nothing for now.
  }

  private onMouseUp = (event: MouseEvent) => {
    this.isDown = false;

    const tapEvent = new TapEvent(this.monoTap, 'up', event);

    this.monoTap.sensorHub.dispatch(tapEvent);
  }
}