import {
  DOMUtil,
  Vector2,
} from '../rocket';

import {
  PolyDragEvent,
  PolyDragEventIdentifier,
} from './poly-drag-event';

import {
  PolyDrag,
} from './poly-drag';

export class PolyDragStory {
  public polyDrag: PolyDrag;

  public identifier: PolyDragEventIdentifier;

  public offset: Vector2;

  public previousPosition: Vector2;
  public previousVelocity: Vector2;

  public startingEvent: PolyDragEvent | null = null;
  public previousEvent: PolyDragEvent | null = null;
  public currentEvent: PolyDragEvent | null = null;
  public finalEvent: PolyDragEvent | null = null;

  public history: PolyDragEvent[];

  public startTime?: number;
  public endTime?: number;

  constructor(polyDrag: PolyDrag, event: PolyDragEvent) {
    this.polyDrag = polyDrag;

    this.history = [];

    this.previousPosition = new Vector2();
    this.previousVelocity = new Vector2();

    this.offset = new Vector2();

    this.identifier = event.identifier;

    this.addEvent(event);
  }

  public addEvent(event: PolyDragEvent) {
    if (event.type === 'start') {
      this.identifier = event.identifier;
    }

    if (this.isValidEvent(event) === false) {
      return;
    }

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

  private isValidEvent(event: PolyDragEvent): boolean {
    return event.identifier === this.identifier;
  }

  private addEventToHistory(event: PolyDragEvent) {
    const { config } = this.polyDrag;

    if (config.keepEventHistory === true) {
      this.history.push(event);
    }
  }

  private updateOffset(position: Vector2) {
    const { target, offsetFrom } = this.polyDrag.config;

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

  private updateEventVectors(event: PolyDragEvent) {
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

  private addStopOrCancelEvent(event: PolyDragEvent) {
    this.updateEventVectors(event);

    this.previousEvent = this.currentEvent;
    this.currentEvent = event;
    this.finalEvent = event;
  }
}