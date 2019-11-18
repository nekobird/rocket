// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

// export interface EventListenObject {
//   target: HTMLElement | Window;
//   event: string;
//   handler: EventListener;
//   useCapture: boolean;
// }

// const activeEvents: EventListenObject[] = [];

export class Listen {
  // private stringToEvents(eventsString: string): string[] {
  //   const events = eventsString.split(',').map(event => event.trim());

  //   return events.filter(event => {
  //     const matches = event.match(/^[a-z]+$/g);

  //     return matches !== null;
  //   });
  // }

  // private createEventListenObject(events: string[]): string[] {
  //   const acceptedEvents: string[] = [];

  //   events.forEach(event => {
  //     if (this.events.indexOf(event) === -1) {
  //       acceptedEvents.push(event);
  //       this.events.push(event);
  //     }
  //   });

  //   return acceptedEvents;
  // }

  // public static on(
  //   target: HTMLElement | Window,
  //   eventsString: string | string[],
  //   handler: EventListener,
  //   useCapture: boolean = false,
  // ) {
  //   if (
  //     Array.isArray(eventsString) === true
  //     && (eventsString as string[]).every(string => typeof string === 'string')
  //   ) {
      
  //   }
  //   const events = this.stringToEvents(eventsString);
  //   const acceptedEvents = this.appendEvents(events);

  //   if (acceptedEvents.length > 0) {
  //     acceptedEvents.forEach(event => {
  //       this.target.addEventListener(event );
  //     });
  //  }
  // }

  // public static off() {
    
  // }

  public static delegate() {
    
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
