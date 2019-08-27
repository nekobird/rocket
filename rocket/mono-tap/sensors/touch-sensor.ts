import {
  DOMUtil,
} from '../../rocket';

import {
  MonoTap,
} from '../mono-tap';

export class TouchSensor {
  public monoTap: MonoTap;

  public isActive: boolean = false;
  
  public touchIdentifier: number;

  constructor(monoTap: MonoTap) {
    this.monoTap = monoTap;
  }

  public attach() {
    const { target } = this.monoTap.config;

    if (
      this.isActive === false
      && DOMUtil.isHTMLElement(target) === true
    ) {
      target.addEventListener('touchstart', this.onTouchStart);
      window.addEventListener('touchmove', this.onTouchMove);
      window.addEventListener('touchend', this.onTouchEnd);
      window.addEventListener('touchcancel', this.onTouchCancel);

      this.isActive = true;
    }
  }

  public detach() {
    const { target } = this.monoTap.config;

    if (
      this.isActive === true
      && DOMUtil.isHTMLElement(target) === true
    ) {
      target.removeEventListener('mousedown', this.onMouseDown);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);

      this.isActive = false;
    }
  }

  private onMouseDown = (event: MouseEvent) => {
    this.isDown = true;
  }

  private onMouseMove = (event: MouseEvent) => {

  }

  private onMouseUp = (event: MouseEvent) => {
    this.isDown = false;
  }
}