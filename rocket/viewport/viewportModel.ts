import {
  Num,
  Point,
  PointHelper,
} from '../rocket';

const MODEL_ATTRIBUTES = {
  border: 'none',
  boxSizing: 'border-box',
  display: 'block',
  height: '100vh',
  left: '0',
  padding: '0',
  position: 'fixed',
  top: '0',
  visibility: 'hidden',
  width: '100vw',
  zIndex: '-9999',
};

let modelElement: HTMLElement;
let modelIsReady: boolean = false;

export class ViewportModel {

  constructor() {
    ViewportModel.createModel();
  }

  // @model_properties

  public static get hasVerticalScrollbar(): boolean {
    return window.innerWidth > document.documentElement.scrollWidth;
  }

  public static get centerPoint(): Point {
    this.createModel();
    return PointHelper.newPoint(this.centerX, this.centerY);
  }

  public static get centerX(): number {
    this.createModel();
    return modelElement.offsetWidth / 2;
  }

  public static get centerY(): number {
    this.createModel();
    return modelElement.offsetHeight / 2;
  }

  public static get width(): number {
    this.createModel();
    return modelElement.offsetWidth;
  }

  public static get height(): number {
    this.createModel();
    return modelElement.offsetHeight;
  }

  public static get diagonal(): number {
    this.createModel();
    const w: number = modelElement.offsetWidth;
    const h: number = modelElement.offsetHeight;
    return Num.hypotenuse(w, h);
  }

  // @model

  public static get modelElement(): HTMLElement {
    this.createModel();
    return modelElement;
  }

  public static get modelIsReady(): boolean {
    return modelIsReady;
  }

  public static get modelIsCreated(): boolean {
    return (
      typeof modelElement !== 'undefined' &&
      modelElement.nodeType === 1
    );
  }

  public static createModel(): ViewportModel {
    if (modelIsReady === false) {
      modelElement = document.createElement('DIV');
      document.body.appendChild(modelElement);
      Object.assign(modelElement.style, MODEL_ATTRIBUTES);
      modelIsReady = true;
    }
    return this;
  }

  public static destroyModel(): ViewportModel {
    if (modelIsReady === true) {
      document.body.removeChild(modelElement);
      modelElement.remove();
      modelIsReady = false;
    }
    return this;
  }
}
