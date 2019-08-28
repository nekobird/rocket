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

  public identifier?: PolyDragEventIdentifier;

  public offset: Vector2;

  public previousPosition: Vector2;
  public previousVelocity: Vector2;

  public startingPolyDragEvent: PolyDragEvent | null = null;
  public previousPolyDragEvent: PolyDragEvent | null = null;
  public currentPolyDragEvent: PolyDragEvent | null = null;
  public finalPolyDragEvent: PolyDragEvent | null = null;

  public history: PolyDragEvent[];

  public startTime?: number;
  public endTime?: number;

  constructor(polyDrag: PolyDrag) {
    this.polyDrag = polyDrag;

    this.history = [];

    this.previousPosition = new Vector2();
    this.previousVelocity = new Vector2();

    this.offset = new Vector2();
  }

  public addPolyDragEvent(polyDragEvent: PolyDragEvent) {
    if (polyDragEvent.type === 'start') {
      this.identifier = polyDragEvent.identifier;
    }

    if (this.isValidPolyDragEvent(polyDragEvent) === false) {
      return;
    }

    this.addPolyDragEventToHistory(polyDragEvent);

    switch (polyDragEvent.type) {
      case 'start': {
        this.startingPolyDragEvent = polyDragEvent;
        this.currentPolyDragEvent = polyDragEvent;
        this.previousPolyDragEvent = polyDragEvent;

        this.updateOffset(polyDragEvent.position);

        break;
      }

      case 'drag': {
        this.updatePolyDragEventVectors(polyDragEvent);

        this.previousPolyDragEvent = this.currentPolyDragEvent;
        this.currentPolyDragEvent = polyDragEvent;

        break;
      }

      case 'stop': {
        this.addStopOrCancelPolyDragEvent(polyDragEvent);

        break;
      }

      case 'cancel': {
        this.addStopOrCancelPolyDragEvent(polyDragEvent);

        break;
      }
    }
  }

  private isValidPolyDragEvent(polyDragEvent: PolyDragEvent): boolean {
    return polyDragEvent.identifier === this.identifier;
  }

  private addPolyDragEventToHistory(polyDragEvent: PolyDragEvent) {
    const { config } = this.polyDrag;

    if (config.keepPolyDragEventHistory === true) {
      this.history.push(polyDragEvent);
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

  private updatePolyDragEventVectors(polyDragEvent: PolyDragEvent) {
    if (polyDragEvent.type !== 'start') {
      const velocity = Vector2.subtract(
        polyDragEvent.position,
        this.previousPosition,
      );

      const acceleration = Vector2.subtract(
        polyDragEvent.velocity,
        this.previousVelocity,
      );

      polyDragEvent.velocity.equals(velocity);
      polyDragEvent.acceleration.equals(acceleration);
    }

    this.previousPosition.equals(polyDragEvent.position);
    this.previousVelocity.equals(polyDragEvent.velocity);
  }

  private addStopOrCancelPolyDragEvent(polyDragEvent: PolyDragEvent) {
    this.updatePolyDragEventVectors(polyDragEvent);

    this.previousPolyDragEvent = this.currentPolyDragEvent;
    this.currentPolyDragEvent = polyDragEvent;
    this.finalPolyDragEvent = polyDragEvent;
  }
}