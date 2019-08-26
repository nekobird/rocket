import {
  DOMScroll,
  DOMUtil,
  Num,
  Point,
} from './rocket';

const VIEWPORT_MODEL_ATTRIBUTES = {
  border: 'none',
  boxSizing: 'border-box',
  display: 'block',
  height: '100vh',
  left: '0',
  maxHeight: '100%',
  maxWidth: '100%',
  padding: '0',
  position: 'fixed',
  top: '0',
  visibility: 'hidden',
  width: '100vw',
  zIndex: '-9999999',
};

let modelElement: HTMLElement;
let modelIsReady: boolean = false;

let scrollToggleElement: HTMLElement = document.body;

let scrollingIsDisabled: boolean = false;
let scrollingIsLocked: boolean = false;

let scrollX: number;
let scrollY: number;

export class Viewport {
  public static setScrollToggleElement(element: HTMLElement) {
    if (
      DOMUtil.isHTMLElement(element) === true
      && scrollingIsDisabled === false
    ) {
      scrollToggleElement = element;
    } else {
      scrollToggleElement = document.body;
    }
  }

  public static get scrollingIsEnabled(): boolean {
    return !scrollingIsDisabled;
  }

  public static get scrollingIsLocked(): boolean {
    return scrollingIsLocked;
  }

  public static disableScrolling(isLocked: boolean = false, forceHideScrollbar: boolean = false) {
    if (scrollingIsDisabled === false) {
      let { 
        hasHorizontalScrollBar,
        hasVerticalScrollBar,
      } = this;

      scrollX = DOMScroll.scrollLeft;
      scrollY = DOMScroll.scrollTop;

      scrollToggleElement.style.overflow = 'hidden';
      scrollToggleElement.style.position = 'fixed';
      scrollToggleElement.style.left = `-${scrollX}px`;
      scrollToggleElement.style.top = `-${scrollY}px`;

      if (
        hasHorizontalScrollBar === true
        && forceHideScrollbar === false
      ) {
        document.documentElement.style.overflowX = 'scroll';
      }

      if (
        hasVerticalScrollBar === true
        && forceHideScrollbar === false
      ) {
        document.documentElement.style.overflowY = 'scroll';
      }

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

        scrollToggleElement.style.removeProperty('overflow');
        scrollToggleElement.style.removeProperty('position');
        scrollToggleElement.style.removeProperty('left');
        scrollToggleElement.style.removeProperty('top');

        window.scrollTo(scrollX, scrollY);

        scrollingIsLocked = false;

        scrollingIsDisabled = false;
      }
    }
  }

  public static scrollTo(left: number, top: number) {
    if (scrollingIsDisabled === true) {
      scrollX = left;
      scrollY = top;

      scrollToggleElement.style.left = `-${left}px`;
      scrollToggleElement.style.top = `-${top}px`;
    } else {
      window.scrollTo(left, top);
    }
  }

  // @model_properties
  public static get hasHorizontalScrollBar(): boolean {
    return window.innerHeight > document.documentElement.scrollHeight;
  }

  public static get hasVerticalScrollBar(): boolean {
    return window.innerWidth > document.documentElement.scrollWidth;
  }

  public static get centerPoint(): Point {
    this.createModel();

    return new Point(this.centerX, this.centerY);
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

    return Num.hypotenuse(
      modelElement.offsetWidth,
      modelElement.offsetHeight,
    );
  }

  public static get documentHeight(): number {
    const { body } = document;

    const html = document.documentElement;

    return Math.max(
      body.scrollHeight,
      body.offsetHeight, 
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    );
  }

  public static get documentWidth(): number {
    const { body } = document;

    const html = document.documentElement;

    return Math.max(
      body.scrollWidth,
      body.offsetWidth, 
      html.clientWidth,
      html.scrollWidth,
      html.offsetWidth,
    );
  }

  // @mobile

  // @model

  private static get modelElement(): HTMLElement {
    this.createModel();

    return modelElement;
  }

  private static get modelIsReady(): boolean {
    return modelIsReady;
  }

  private static get modelIsCreated(): boolean {
    return DOMUtil.isHTMLElement(modelElement);
  }

  private static createModel(): Viewport {
    if (modelIsReady === false) {
      modelElement = document.createElement('DIV');

      document.body.appendChild(modelElement);

      Object.assign(modelElement.style, VIEWPORT_MODEL_ATTRIBUTES);

      modelIsReady = true;
    }

    return this;
  }

  private static destroyModel(): Viewport {
    if (modelIsReady === true) {
      document.body.removeChild(modelElement);

      modelElement.remove();

      modelIsReady = false;
    }

    return this;
  }
}
