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
  public finalMonoDragEvent: MonoDragEvent | null = null;

  constructor(monoDrag: MonoDrag) {
    this.monoDrag = monoDrag;

    this.offset = new Vector2();

    this.previousPosition = new Vector2();
    this.previousVelocity = new Vector2();

    this.history = [];
  }

  public addMonoDragEvent(event: MonoDragEvent) {
    this.preventDefault(event);

    this.addMonoDragEventToHistory(event);

    switch (event.type) {
      case 'start': {
        this.startingMonoDragEvent = event;
        this.currentMonoDragEvent = event;
        this.previousMonoDragEvent = event;

        this.updateOffset(event.position);

        break;
      }

      case 'drag': {
        this.updateMonoDragEventVectors(event);

        this.previousMonoDragEvent = this.currentMonoDragEvent;
        this.currentMonoDragEvent = event;

        break;
      }

      case 'stop': {
        this.addStopOrCancelMonoDragEvent(event);

        break;
      }

      case 'cancel': {
        this.addStopOrCancelMonoDragEvent(event);

        break;
      }
    }
  }

  private preventDefault(event: MonoDragEvent) {
    const { preventDefault } = this.monoDrag.config;

    if (preventDefault === true) {
      event.originalEvent.preventDefault();
    }
  }

  private addMonoDragEventToHistory(event: MonoDragEvent) {
    const { keepHistory } = this.monoDrag.config;

    if (keepHistory === true) {
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

  private updateMonoDragEventVectors(event: MonoDragEvent) {
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

  private addStopOrCancelMonoDragEvent(event: MonoDragEvent) {
    this.updateMonoDragEventVectors(event);

    this.previousMonoDragEvent = this.currentMonoDragEvent;
    this.currentMonoDragEvent = event;
    this.finalMonoDragEvent = event;
  }
}
