import {
  DOMUtil,
  Vector2,
} from '../rocket';

import {
  MonoDrag,
} from './mono-drag';

import {
  MonoDragEvent,
} from './mono-drag-event';

export class MonoDragStory {
  public monoDrag: MonoDrag;

  public offset: Vector2;

  public previousPosition: Vector2;
  public previousVelocity: Vector2;

  public history: MonoDragEvent[];

  public startingMonoDragEvent: MonoDragEvent | null = null;
  public previousMonoDragEvent: MonoDragEvent | null = null;
  public currentMonoDragEvent: MonoDragEvent | null = null;
  public endingMonoDragEvent: MonoDragEvent | null = null;

  constructor(monoDrag: MonoDrag) {
    this.monoDrag = monoDrag;

    this.offset = new Vector2();

    this.previousPosition = new Vector2();
    this.previousVelocity = new Vector2();

    this.history = [];
  }

  public addMonoDragEvent(monoDragEvent: MonoDragEvent) {
    this.addMonoDragEventToHistory(monoDragEvent);

    switch (monoDragEvent.type) {
      case 'start': {
        this.startingMonoDragEvent = monoDragEvent;
        this.currentMonoDragEvent = monoDragEvent;
        this.previousMonoDragEvent = monoDragEvent;

        this.updateOffset(monoDragEvent.position);
      }

      case 'drag': {
        this.updateDragEventVectors(monoDragEvent);

        this.previousMonoDragEvent = this.currentMonoDragEvent;
        this.currentMonoDragEvent = monoDragEvent;       
      }

      case 'stop': {
        this.addStopOrCancelMonoDragEvent(monoDragEvent);
      }

      case 'cancel': {
        this.addStopOrCancelMonoDragEvent(monoDragEvent);
      }
    }
  }

  private addStopOrCancelMonoDragEvent(monoDragEvent: MonoDragEvent) {
    this.updateDragEventVectors(monoDragEvent);

    this.previousMonoDragEvent = this.currentMonoDragEvent;
    this.currentMonoDragEvent = monoDragEvent;
    this.endingMonoDragEvent = monoDragEvent;
  }

  private updateDragEventVectors(monoDragEvent: MonoDragEvent) {
    if (monoDragEvent.type !== 'start') {
      const velocity = Vector2.subtract(
        monoDragEvent.position,
        this.previousPosition,
      );

      const acceleration = Vector2.subtract(
        monoDragEvent.velocity,
        this.previousVelocity,
      );

      monoDragEvent.velocity.equals(velocity);
      monoDragEvent.acceleration.equals(acceleration);
    }

    this.previousPosition.equals(monoDragEvent.position);
    this.previousVelocity.equals(monoDragEvent.velocity);
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

  private addMonoDragEventToHistory(monoDragEvent: MonoDragEvent) {
    const { keepHistory } = this.monoDrag.config;

    if (keepHistory === true) {
      this.history.push(monoDragEvent);
    }
  }
}
