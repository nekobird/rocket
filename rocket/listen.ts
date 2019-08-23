// 'resize, blah, blah'
// listeners[]
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

let eventNames: string[] = [];

let eventListeners: EventListener[] = [];

interface addEventListenerOptions {
  useCapture: boolean;
}

export class Listen {

  constructor(config) {

  }

  public setConfig() {

  }

  public attach(eventNames: string, listeners: EventListener | EventListener[]) {
  }

  public dettachAll() {

  }

  public detachFromEventNames(eventNames: string) {

  }

  public static once(target: EventTarget, eventName: string, handler: EventListener, capture?: boolean) {
    const listener = event => {
      handler(event);

      target.removeEventListener(eventName, listener, capture);
    }

    target.addEventListener(eventName, listener, capture);
  }
}