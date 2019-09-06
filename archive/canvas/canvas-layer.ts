import {
  CanvasDraw,
} from '../rocket';

export class CanvasLayer {
  public element: HTMLCanvasElement;

  public draw: CanvasDraw;

  constructor(element: HTMLCanvasElement) {
    this.element = element;

    this.element.style.position = 'absolute';
    this.element.style.left = '0px';
    this.element.style.top = '0px';

    this.draw = new CanvasDraw(this.element);
  }

  set zIndex(zIndex: number) {
    this.element.style.zIndex = zIndex.toString();
  }

  public updateElement(element: HTMLCanvasElement): this {
    this.element = element;

    this.draw.element = element;

    return this;
  }

  public show(): this {
    this.element.style.display = `block`;

    return this;
  }

  public hide(): this {
    this.element.style.display = `none`;

    return this;
  }
}
