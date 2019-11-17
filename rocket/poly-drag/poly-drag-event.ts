import {
  Vector2,
} from '~/rocket';

import {
  PolyDrag,
} from './poly-drag';

export type PolyDragEventIdentifier = 'mouse' | number;

export type PolyDragEventType = 'start' | 'drag' | 'stop' | 'cancel';

export class PolyDragEvent {
  public polyDrag: PolyDrag;

  public type: PolyDragEventType;

  public identifier: PolyDragEventIdentifier;

  public originalEvent: MouseEvent | TouchEvent;

  public isTouch: boolean = false;

  public touch?: Touch;

  public targetFromEvent: EventTarget | null;

  public target: HTMLElement | null;

  public position: Vector2;
  public velocity: Vector2;
  public acceleration: Vector2;

  public time: number;

  constructor(
    polyDrag: PolyDrag,
    type: PolyDragEventType,
    event: MouseEvent | TouchEvent,
    isTouch: boolean = false,
    touch?: Touch,
  ) {
    this.time = Date.now();

    this.polyDrag = polyDrag;

    this.type = type;

    this.originalEvent = event;

    this.isTouch = isTouch;

    let clientX;
    let clientY;

    if (
      isTouch === true
      && typeof touch === 'object'
      && touch instanceof Touch
    ) {
      this.touch = touch as Touch;

      this.identifier = this.touch.identifier;

      this.targetFromEvent = this.touch.target;

      clientX = this.touch.clientX;
      clientY = this.touch.clientY;
    } else {
      this.identifier = 'mouse';

      const event = this.originalEvent as MouseEvent;

      this.targetFromEvent = event.target;

      clientX = event.clientX;
      clientY = event.clientY;
    }

    this.target = document.elementFromPoint(clientX, clientY) as HTMLElement | null;

    this.position = new Vector2(clientX, clientY);
    this.velocity = new Vector2();
    this.acceleration = new Vector2();

    this.preventDefault();    
  }

  private preventDefault() {
    const { preventDefault } = this.polyDrag.config;

    if (preventDefault === true) {
      this.originalEvent.preventDefault();
    }
  }
}
