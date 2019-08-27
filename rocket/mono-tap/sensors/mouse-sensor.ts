import {
  DOMTraverse,
  DOMUtil,
} from '../../rocket';

import {
  MonoTap,
} from '../mono-tap';

export class MouseSensor {
  public monoTap: MonoTap;

  public isActive: boolean = false;
  public isDown: boolean = false;

  public downTarget: HTMLElement;

  constructor(monoTap: MonoTap) {
    this.monoTap = monoTap;
  }

  public attach() {
    const { target } = this.monoTap.config;

    if (
      this.isActive === false
      && DOMUtil.isHTMLElement(target) === true
    ) {
      target.addEventListener('mousedown', this.onMouseDown);
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);

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
    const { target } = this.monoTap.config;

    this.isDown = false;


    if (
      DOMUtil.isHTMLElement(event.target) === true
      && DOMTraverse.hasAncestor(event.target as HTMLElement, target) === true
    ) {
      this.monoTap.tapComplete();
    }    
  }
}