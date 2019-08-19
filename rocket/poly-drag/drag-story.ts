import {
  DOMUtil,
  Vector2,
} from '../rocket';

import {
  DragEvent,
  DragEventType,
} from './drag-event';

import {
  PolyDrag
} from './poly-drag';

export class DragStory {
  public polyDrag: PolyDrag;

  public isActive: boolean;

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

  private addDragEvent(type: DragEventType, event: TouchEvent, touch: Touch): DragEvent {
    const { clientX, clientY, identifier, target } = touch;

    const position = new Vector2(clientX, clientY);

    let velocity = new Vector2();
    let acceleration = new Vector2();

    if (type !== 'start') {
      velocity = Vector2.subtract(position, this.previousPosition);
      acceleration = Vector2.subtract(velocity, this.previousVelocity);
    }

    const offset = Vector2.clone(this.offset);

    this.previousPosition.equals(position);
    this.previousVelocity.equals(velocity);

    return {
      type,
      event,
      target,
      isTouch: true,
      touch,
      identifier,
      offset,
      position,
      velocity,
      acceleration,
      time: Date.now(),
    };
  }

  private addToHistory(dragEvent: DragEvent) {
    const { config } = this.polyDrag;

    if (config.keepHistory === true) {
      this.history.push(dragEvent);
    }
  }

  private setOffset(x: number, y: number) {
    const { target, offsetFrom } = this.polyDrag.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      let element = target as HTMLElement;

      if (DOMUtil.isHTMLElement(offsetFrom) === true) {
        element = offsetFrom as HTMLElement;
      }

      const { left, top } = element.getBoundingClientRect();

      this.offset.equals(
        x - left,
        y - top,
      );
    }
  }
}