import {
  DOMUtil,
  Vector2,
} from '../rocket';

import {
  DragEvent,
  DragEventType,
  DragEventIdentifier,
} from './drag-event';

import {
  PolyDrag,
} from './poly-drag';

export class DragStory {
  public polyDrag: PolyDrag;

  public identifier?: DragEventIdentifier;

  public isActive: boolean = false;
  public wasActive: boolean = false;

  public dragEvents?: DragEvent[];
  public activeDragEvent?: DragEvent;

  public previousPosition: Vector2;
  public previousVelocity: Vector2;

  public startingDragEvent?: DragEvent;
  public previousDragEvent?: DragEvent;
  public finalDragEvent?: DragEvent;

  public history: DragEvent[];

  public offset: Vector2;

  constructor(polyDrag: PolyDrag) {
    this.polyDrag = polyDrag;

    this.history = [];

    this.previousPosition = new Vector2();
    this.previousVelocity = new Vector2();

    this.offset = new Vector2();
  }

  private updateVectors(dragEvent: DragEvent) {
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

  private addToHistory(dragEvent: DragEvent) {
    const { config } = this.polyDrag;

    if (config.keepDragEventHistory === true) {
      this.history.push(dragEvent);
    }
  }

  public start(dragEvent: DragEvent) {
    if (
      this.isActive === false
      && this.wasActive === false
      && dragEvent.type === 'start'
    ) {
      this.isActive = true;
      this.wasActive = true;

      this.identifier = dragEvent.identifier;

      this.startingDragEvent = dragEvent;
      this.previousDragEvent = dragEvent;

      this.setOffset(dragEvent.position);

      this.updateVectors(dragEvent);

      this.addToHistory(dragEvent);
    }
  }

  public drag(dragEvent: DragEvent) {
    if (
      this.wasActive === true
      && this.isActive === true
      && dragEvent.type === 'drag'
      && dragEvent.identifier === this.identifier
    ) {
      this.previousDragEvent = dragEvent;

      this.updateVectors(dragEvent);

      this.addToHistory(dragEvent);
    }
  }

  public stop(dragEvent: DragEvent) {
    if (
      this.wasActive === true
      && this.isActive === true
      && dragEvent.identifier === this.identifier
      && (
        dragEvent.type === 'stop'
        || dragEvent.type === 'cancel'
      )
    ) {
      this.previousDragEvent = dragEvent;
      this.finalDragEvent = dragEvent;

      this.updateVectors(dragEvent);

      this.addToHistory(dragEvent);

      this.end();
    }
  }

  private end() {
    this.isActive = false;
  }
}