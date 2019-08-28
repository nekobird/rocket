import {
  DOMUtil,
  Vector2,
} from '../rocket';

import {
  MonoDrag,
} from './mono-drag';

import {
  MonoDragEvent,
  MonoDragEventIdentifier,
} from './mono-drag-event';

export class MonoDragStory {
  public monoDrag: MonoDrag;

  public identifier: MonoDragEventIdentifier;

  public offset: Vector2;

  public previousPosition: Vector2;
  public previousVelocity: Vector2;

  public history: MonoDragEvent[];

  public startingEvent: MonoDragEvent | null = null;
  public previousEvent: MonoDragEvent | null = null;
  public currentEvent: MonoDragEvent | null = null;
  public finalEvent: MonoDragEvent | null = null;

  public startTime: number;
  public endTime: number | null = null;

  constructor(monoDrag: MonoDrag, event: MonoDragEvent) {
    this.monoDrag = monoDrag;

    this.offset = new Vector2();

    this.previousPosition = new Vector2();
    this.previousVelocity = new Vector2();

    this.history = [];

    this.identifier = event.identifier;

    this.startTime = event.time;
  }

  public get duration(): number | null {
    if (this.endTime === null) {
      return null;
    }

    return this.startTime - this.endTime;
  }

  public addEvent(event: MonoDragEvent) {
    if (this.identifier !== event.identifier) {
      return;
    }

    this.preventDefault(event);

    this.addEventToHistory(event);

    switch (event.type) {
      case 'start': {
        this.startingEvent = event;
        this.currentEvent = event;
        this.previousEvent = event;

        this.updateOffset(event.position);

        break;
      }

      case 'drag': {
        this.updateEventVectors(event);

        this.previousEvent = this.currentEvent;
        this.currentEvent = event;

        break;
      }

      case 'stop': {
        this.addStopOrCancelEvent(event);

        break;
      }

      case 'cancel': {
        this.addStopOrCancelEvent(event);

        break;
      }
    }
  }

  private addStopOrCancelEvent(event: MonoDragEvent) {
    this.updateEventVectors(event);

    this.previousEvent = this.currentEvent;
    this.currentEvent = event;
    this.finalEvent = event;

    this.endTime = event.time;
  }

  private preventDefault(event: MonoDragEvent) {
    const { preventDefault } = this.monoDrag.config;

    if (preventDefault === true) {
      event.originalEvent.preventDefault();
    }
  }

  private addEventToHistory(event: MonoDragEvent) {
    const { keepEventHistory } = this.monoDrag.config;

    if (
      keepEventHistory === true
      && this.history.indexOf(event) === -1
    ) {
      this.history.push(event);
    }
  }

  private updateOffset(position: Vector2) {
    const { target, offsetFrom } = this.monoDrag.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      let element = target as HTMLElement;

      if (DOMUtil.isHTMLElement(offsetFrom) === true) {
        element = offsetFrom as HTMLElement;
      }

      const { left, top } = element.getBoundingClientRect();

      this.offset.equals(
        position.x - left,
        position.y - top,
      );
    }
  }

  private updateEventVectors(event: MonoDragEvent) {
    if (event.type !== 'start') {
      const velocity = Vector2.subtract(
        event.position,
        this.previousPosition,
      );

      const acceleration = Vector2.subtract(
        event.velocity,
        this.previousVelocity,
      );

      event.velocity.equals(velocity);
      event.acceleration.equals(acceleration);
    }

    this.previousPosition.equals(event.position);
    this.previousVelocity.equals(event.velocity);
  }
}
