import {
  Vector2,
} from '../rocket';

import {
  MonoDrag
} from './mono-drag';

export type MonoDragEventIdentifier = 'mouse' | number;

export type MonoDragEventType = 'start' | 'drag' | 'stop' | 'cancel';

export class MonoDragEvent {
  public monoDrag: MonoDrag;

  public identifier: MonoDragEventIdentifier;

  public type: MonoDragEventType;

  public isTouch: boolean;

  public originalEvent: MouseEvent | TouchEvent;
  public originalTouch?: Touch;

  public targetFromEvent: EventTarget | null;
  public target: HTMLElement | null;

  public position: Vector2;
  public velocity: Vector2;
  public acceleration: Vector2;

  public time: number;

  constructor(
    monoDrag: MonoDrag,
    type: MonoDragEventType,
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
      this.identifier = touch.identifier;

      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      this.identifier = 'mouse';

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

    this.preventDefault();
  }

  public updateOffset() {
    this.offset = Vector2.clone(this.monoDrag.offset);
  }

  private preventDefault() {
    const { preventDefault } = this.monoDrag.config;

    if (preventDefault === true) {
      this.originalEvent.preventDefault();
    }
  }
}
