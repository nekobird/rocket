import {
  Vector2,
} from '../rocket';

import {
  MonoDrag
} from './mono-drag';

export type DragEventType = 'start' | 'drag' | 'stop' | 'cancel';

export class DragEvent {
  public monoDrag: MonoDrag;

  public type: DragEventType;

  public isTouch: boolean;

  public touchIdentifier?: number;

  public originalEvent: MouseEvent | TouchEvent;
  public originalTouch?: Touch;

  public targetFromEvent: EventTarget | null;
  public target: HTMLElement | null;

  public offset: Vector2;

  public position: Vector2;
  public velocity: Vector2;
  public acceleration: Vector2;

  public time: number;

  constructor(
    monoDrag: MonoDrag,
    type: DragEventType,
    originalEvent: MouseEvent | TouchEvent,
    isTouch: boolean = false,
    touch?: Touch,
  ) {
    this.monoDrag = monoDrag;

    this.type = type;

    this.isTouch = isTouch;

    this.originalEvent = originalEvent;
    this.targetFromEvent = originalEvent.target;

    let clientX;
    let clientY;

    if (
      isTouch === true
      && typeof touch !== 'undefined'
    ) {
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      const event = originalEvent as MouseEvent;

      clientX = event.clientX;
      clientY = event.clientY;
    }

    this.target = document.elementFromPoint(clientX, clientY) as HTMLElement | null;

    this.position = new Vector2(clientX, clientY);
    this.velocity = new Vector2();
    this.acceleration = new Vector2();

    if (type !== 'start') {
      const { previousPosition, previousVelocity } = this.monoDrag;

      this.velocity.equals(Vector2.subtract(this.position, previousPosition));
      this.acceleration.equals(Vector2.subtract(this.velocity, previousVelocity));
    }

    this.monoDrag.previousPosition.equals(this.position);
    this.monoDrag.previousVelocity.equals(this.velocity);

    this.offset = Vector2.clone(this.monoDrag.offset);

    this.time = Date.now();
  }

  public updateOffset() {
    this.offset = Vector2.clone(this.monoDrag.offset);
  }
}
