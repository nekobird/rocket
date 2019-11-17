import {
  DOMScroll,
  Util,
  Viewport,
} from '@/rocket';

// TODO: Add a way to remove event listeners once completed.

export interface ScrollLocation {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface ScrollTrigger {
  condition: (
    scrollLocation: ScrollLocation,
    trigger: ScrollTrigger,
    manager: ScrollTriggerManager,
  ) => boolean;

  action: (
    scrollLocation: ScrollLocation,
    trigger: ScrollTrigger,
    manager: ScrollTriggerManager,
  ) => Promise<void>;

  prepare: (
    scrollLocation: ScrollLocation,
    trigger: ScrollTrigger,
    manager: ScrollTriggerManager,
  ) => void;

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
};

export class ScrollTriggerManager {
  public triggerOnlyOnResizeEnd: boolean = false;

  public resizeDebounceDelayInSeconds: number = 0.5;

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

  public initialize(): this {
    this.previousScrollLocation = this.scrollLocation;

    this.currentScrollLocation = this.scrollLocation;

    this.prepare();

    this.listen();

    return this;
  }

  public prepare(): this {
    this.updateScrollLocation();
   
    if (this.isReady === false) {
      this.triggers.forEach(trigger => {
        if (
          trigger.enabled === true
          && typeof this.currentScrollLocation !== 'undefined'
        ) {
          trigger.prepare(this.currentScrollLocation, trigger, this);
        }
      });

      this.isReady = true;
    }

    return this;
  }

  public set disable(disable: boolean) {
    this.isDisabled = disable;
  }

  public get scrollLocation(): ScrollLocation {
    return (this.currentScrollLocation = {
      left: DOMScroll.scrollLeft,
      top: DOMScroll.scrollTop,
      right: DOMScroll.scrollLeft + Viewport.width,
      bottom: DOMScroll.scrollTop + Viewport.height,
    });
  }

  public addTrigger(trigger: Partial<ScrollTrigger>): this {
    const newTrigger = {...DEFAULT_SCROLL_TRIGGER};

    this.triggers.push(Object.assign(newTrigger, trigger));

    return this;
  }

  public removeTrigger(trigger: ScrollTrigger): this {
    const index = this.triggers.indexOf(trigger);

    if (index !== -1) {
      this.triggers.splice(index, 1);
    }

    return this;
  }

  public update(): this {
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
              if (trigger.removeOnceTriggered === true) {
                this.removeTrigger(trigger);
              }

              trigger.isTriggered = true;

              trigger.previousTriggeredTime = Date.now();

              trigger.isActive = false;
            })
            .catch(() => {
              trigger.isActive = false
            });
        }
      });
    }

    return this;
  }

  public updateScrollLocation(): this {
    Object.assign(this.previousScrollLocation, this.currentScrollLocation);

    this.currentScrollLocation = this.scrollLocation;

    return this;
  }

  private eventHandlerScroll = event => {
    this.update();
  };

  private eventHandlerResize = event => {
    this.isResizing = true;

    this.updateScrollLocation();

    if (this.triggerOnlyOnResizeEnd === false) {
      this.update();
    }
  };

  private eventHandlerResizeEnd = event => {
    this.isResizing = false;

    if (this.triggerOnlyOnResizeEnd === true) {
      this.update();
    }
  };

  public listen() {
    window.addEventListener('resize', this.resizeDebounce as EventListener);

    this.resizeDebounce = Util.debounce(this.eventHandlerResizeEnd, this.resizeDebounceDelayInSeconds);
    window.addEventListener('resize', this.eventHandlerResize as EventListener);

    window.addEventListener('scroll', this.eventHandlerScroll as EventListener);
  }

  public stop() {
    window.removeEventListener('resize', this.resizeDebounce as EventListener);
    window.removeEventListener('resize', this.eventHandlerResize as EventListener);

    window.removeEventListener('scroll', this.eventHandlerScroll as EventListener);
  }
}
