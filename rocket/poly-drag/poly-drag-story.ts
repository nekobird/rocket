import {
  DOMUtil,
  Vector2,
} from '../rocket';

import {
  PolyDragEvent,
  PolyDragEventType,
  PolyDragEventIdentifier,
} from './poly-drag-event';

import {
  PolyDrag,
} from './poly-drag';

export class PolyDragStory {
  public polyDrag: PolyDrag;

  public identifier?: PolyDragEventIdentifier;

  public isActive: boolean = false;
  public wasActive: boolean = false;

  public dragEvents?: PolyDragEvent[];
  public activePolyDragEvent?: PolyDragEvent;

  public previousPosition: Vector2;
  public previousVelocity: Vector2;

  public startingPolyDragEvent?: PolyDragEvent;
  public previousPolyDragEvent?: PolyDragEvent;
  public finalPolyDragEvent?: PolyDragEvent;

  public history: PolyDragEvent[];

  public offset: Vector2;

  constructor(polyDrag: PolyDrag) {
    this.polyDrag = polyDrag;

    this.history = [];

    this.previousPosition = new Vector2();
    this.previousVelocity = new Vector2();

    this.offset = new Vector2();
  }

  private updateVectors(dragEvent: PolyDragEvent) {
    let event: MouseEvent | Touch;

    if (
      dragEvent.isTouch === true
      && typeof dragEvent.touch !== 'undefined'
    ) {
      event = dragEvent.touch;
    } else {
      event = dragEvent.originalEvent as MouseEvent;
    }

    const { clientX, clientY } = event;

    dragEvent.position.equals(clientX, clientY);

    if (dragEvent.type !== 'start') {
      dragEvent.velocity.equals(Vector2.subtract(dragEvent.position, this.previousPosition));
      dragEvent.acceleration.equals(Vector2.subtract(dragEvent.velocity, this.previousVelocity));
    }

    this.previousPosition.equals(dragEvent.position);
    this.previousVelocity.equals(dragEvent.velocity);
  }

  private setOffset(from: Vector2) {
    const { target, offsetFrom } = this.polyDrag.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      let element = target as HTMLElement;

      if (DOMUtil.isHTMLElement(offsetFrom) === true) {
        element = offsetFrom as HTMLElement;
      }

      const { left, top } = element.getBoundingClientRect();

      this.offset.equals(
        from.x - left,
        from.y - top,
      );
    }
  }

  private addToHistory(dragEvent: PolyDragEvent) {
    const { config } = this.polyDrag;

    if (config.keepPolyDragEventHistory === true) {
      this.history.push(dragEvent);
    }
  }

  public start(dragEvent: PolyDragEvent) {
    if (
      this.isActive === false
      && this.wasActive === false
      && dragEvent.type === 'start'
    ) {
      this.isActive = true;
      this.wasActive = true;

      this.identifier = dragEvent.identifier;

      this.startingPolyDragEvent = dragEvent;
      this.previousPolyDragEvent = dragEvent;

      this.setOffset(dragEvent.position);

      this.updateVectors(dragEvent);

      this.addToHistory(dragEvent);
    }
  }

  public drag(dragEvent: PolyDragEvent) {
    if (
      this.wasActive === true
      && this.isActive === true
      && dragEvent.type === 'drag'
      && dragEvent.identifier === this.identifier
    ) {
      this.previousPolyDragEvent = dragEvent;

      this.updateVectors(dragEvent);

      this.addToHistory(dragEvent);
    }
  }

  public stop(dragEvent: PolyDragEvent) {
    if (
      this.wasActive === true
      && this.isActive === true
      && dragEvent.identifier === this.identifier
      && (
        dragEvent.type === 'stop'
        || dragEvent.type === 'cancel'
      )
    ) {
      this.previousPolyDragEvent = dragEvent;
      this.finalPolyDragEvent = dragEvent;

      this.updateVectors(dragEvent);

      this.addToHistory(dragEvent);

      this.end();
    }
  }

  private end() {
    this.isActive = false;
  }
}