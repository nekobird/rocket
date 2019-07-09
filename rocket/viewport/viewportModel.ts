import {
  DOMScroll,
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

let scrollingIsDisabled: boolean = false;
let scrollingIsLocked: boolean = false;

let scrollX: number;
let scrollY: number;

export class ViewportModel {

  constructor() {
    ViewportModel.createModel();
  }

  public static get scrollingIsEnabled() {
    return !scrollingIsDisabled;
  }

  public static get scrollingIsLocked() {
    return scrollingIsLocked;
  }

  public static disableScrolling(isLocked: boolean = false, forceHideScrollbar: boolean = false) {
    if (scrollingIsDisabled === false) {
      let hasHorizontalScrollBar = this.hasHorizontalScrollBar;
      let hasVerticalScrollBar   = this.hasVerticalScrollbar;

      scrollX = DOMScroll.scrollLeft;
      scrollY = DOMScroll.scrollTop;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.left = `-${scrollX}px`;
      document.body.style.top  = `-${scrollY}px`;

      if (hasHorizontalScrollBar === true && forceHideScrollbar === false)
        document.documentElement.style.overflowX = 'scroll';
      if (hasVerticalScrollBar === true && forceHideScrollbar === false)
        document.documentElement.style.overflowY = 'scroll';

      scrollingIsLocked = isLocked;
      scrollingIsDisabled = true;
    }
  }

  public static enableScrolling(unlock: boolean = false) {
    if (scrollingIsDisabled === true) {
      if (
        scrollingIsLocked === false
        || (scrollingIsLocked === true && unlock === true)
      ) {
        document.documentElement.style.removeProperty('overflow-x');
        document.documentElement.style.removeProperty('overflow-y');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('position');
        document.body.style.removeProperty('left');
        document.body.style.removeProperty('top');
        window.scrollTo(scrollX, scrollY);
        scrollingIsLocked   = false;
        scrollingIsDisabled = false;
      }
    }
  }

  // @model_properties
  public static get hasHorizontalScrollBar(): boolean {
    return window.innerHeight > document.documentElement.scrollHeight;
  }

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
    const w = modelElement.offsetWidth;
    const h = modelElement.offsetHeight;
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
      typeof modelElement !== 'undefined'
      && modelElement.nodeType === 1
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
