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

  public identifier: DragEventIdentifier;

  public isActive: boolean = false;
  public wasActive: boolean = false;

  public dragEvents: DragEvent[];
  public activeDragEvent: DragEvent;

  public previousPosition: Vector2;
  public previousVelocity: Vector2;

  public startingDragEvent: DragEvent;
  public previousDragEvent: DragEvent;

  public history: DragEvent[];

  public offset: Vector2;

  constructor(polyDrag: PolyDrag) {
    this.polyDrag = polyDrag;

    this.history = [];
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

      this.addToHistory(dragEvent);
    }
  }
}