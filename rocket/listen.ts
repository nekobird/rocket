// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

export class Listen {
  public config?;

  private target: HTMLElement | Window;

  private events: string[];
  private handler?: EventListener;

  constructor(target: HTMLElement | Window) {
    this.target = target;

    this.events = [];
  }

  public on(
    eventString: string,
    handlers: EventListener[] | EventListener
  ) {

  }

  public off() {
    
  }

  public static once(
    target: EventTarget,
    eventName: string,
    handler: EventListener,
    capture: boolean = false,
  ) {
    const listener = event => {
      handler(event);

      target.removeEventListener(eventName, listener, capture);
    }

    target.addEventListener(eventName, listener, capture);
  }
}
