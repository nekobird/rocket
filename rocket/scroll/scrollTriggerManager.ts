import {
  Util,
  ViewportModel,
} from '../rocket';

export interface ScrollLocation {
  left: number,
  right: number,
  top: number,
  bottom: number,
}

export interface ScrollTrigger {
  condition: (scrollLocation: ScrollLocation, trigger: ScrollTrigger, manager: ScrollTriggerManager) => boolean;
  action: (scrollLocation: ScrollLocation, trigger: ScrollTrigger, manager: ScrollTriggerManager) => Promise<void>;
  prepare: (scrollLocation: ScrollLocation, trigger: ScrollTrigger, manager: ScrollTriggerManager) => void;
  enabled: boolean;
  removeOnceTriggered: boolean;
  previousTriggeredTime?: number;
  isActive: boolean;
  isTriggered: boolean;
  export?: any;
}

export const DEFAULT_SCROLL_TRIGGER: ScrollTrigger = {
  condition: () => true,
  action: () => Promise.resolve(),
  prepare: () => {},
  enabled: true,
  removeOnceTriggered: false,
  previousTriggeredTime: undefined,
  isActive: false,
  isTriggered: false,
  export: {},
}

export class ScrollTriggerManager {
  public triggerOnlyOnResizeEnd: boolean = false;
  public resizeDebounceDelay: number = 0.5;
  private resizeDebounce?: Function;

  public previousScrollLocation?: ScrollLocation;
  public currentScrollLocation?: ScrollLocation;

  public triggers: ScrollTrigger[];

  public isScrolling: boolean = false;
  public isResizing: boolean = false;
  public isDisabled: boolean = false;

  public isReady: boolean = false;

  constructor() {
    this.triggers = [];
  }

  public initialize() {
    this.previousScrollLocation = this.scrollLocation;
    this.currentScrollLocation = this.scrollLocation;
    this.prepare();
    this.listen();
  }

  public prepare() {
    this.updateScrollLocation();
    if (this.isReady === false) {
      this.triggers.forEach(trigger => {
        if (
          trigger.enabled === true
          && typeof this.currentScrollLocation !== 'undefined'
        )
          trigger.prepare(this.currentScrollLocation, trigger, this);
      });
      this.isReady = true;
    }
  }

  public set disable(disable: boolean) {
    this.isDisabled = disable;
  }

  public get scrollLocation(): ScrollLocation {
    return this.currentScrollLocation = {
      left: window.scrollX,
      top: window.scrollY,
      right: window.scrollX + ViewportModel.width,
      bottom: window.scrollY + ViewportModel.height,
    };
  }

  public addTrigger(trigger: Partial<ScrollTrigger>) {
    const newTrigger = Object.assign({}, DEFAULT_SCROLL_TRIGGER);
    this.triggers.push(
      Object.assign(newTrigger, trigger)
    );
  }

  public removeTrigger(trigger: ScrollTrigger) {
    const index = this.triggers.indexOf(trigger);
    if (index !== -1)
      this.triggers.splice(index, 1);
  }

  public update() {
    this.updateScrollLocation();
    if (
      this.isDisabled === false
      && this.triggers.length > 0
    ) {
      this.triggers.forEach(trigger => {
        if (
          trigger.enabled === true
          && trigger.isActive === false
          && typeof this.currentScrollLocation !== 'undefined'
          && trigger.condition(this.currentScrollLocation, trigger, this) === true
        ) {
          trigger
            .action(this.currentScrollLocation, trigger, this)
            .then(() => {
              if (trigger.removeOnceTriggered === true)
                this.removeTrigger(trigger);
              trigger.isTriggered = true;
              trigger.previousTriggeredTime = Date.now();
              trigger.isActive = false;
            })
            .catch(() => trigger.isActive = false);
        }
      });
    }
  }

  public updateScrollLocation() {
    Object.assign(this.previousScrollLocation, this.currentScrollLocation);
    this.currentScrollLocation = this.scrollLocation
  }

  public eventHandlerScroll = event => {
    this.update();
  }

  public eventHandlerResize = event => {
    this.isResizing = true;
    this.updateScrollLocation();
    if (this.triggerOnlyOnResizeEnd === false)
      this.update();
  }

  public eventHandlerResizeEnd = event => {
    this.isResizing = false;
    if (this.triggerOnlyOnResizeEnd === true)
      this.update();
  }

  public listen() {
    this.resizeDebounce = Util.debounce(this.resizeDebounceDelay, this.eventHandlerResizeEnd);
    window.addEventListener('resize', <EventListener>this.resizeDebounce);
    window.addEventListener('resize', this.eventHandlerResize);
    window.addEventListener('scroll', this.eventHandlerScroll);
  }

  public stop() {
    window.removeEventListener('resize', <EventListener>this.resizeDebounce);
    window.removeEventListener('resize', this.eventHandlerResize);
    window.removeEventListener('scroll', this.eventHandlerScroll);
  }
}
