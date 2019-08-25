// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

export class Listen {
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