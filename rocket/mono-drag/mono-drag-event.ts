import {
  Vector2,
} from '~/rocket';

import {
  MonoDrag
} from './mono-drag';

export type MonoDragEventIdentifier = 'mouse' | number;

export type MonoDragEventType = 'start' | 'drag' | 'stop' | 'cancel';

export class MonoDragEvent {
  public monoDrag: MonoDrag;

  public type: MonoDragEventType;

  public identifier: MonoDragEventIdentifier;
  
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
    monoDrag: MonoDrag,
    type: MonoDragEventType,
    originalEvent: MouseEvent | TouchEvent,
    isTouch: boolean = false,
    touch?: Touch,
  ) {
    this.time = Date.now();

    this.monoDrag = monoDrag;

    this.type = type;

    this.originalEvent = originalEvent;

    this.isTouch = isTouch;

    let clientX;
    let clientY;

    if (
      isTouch === true
      && typeof touch === 'object'
      && touch instanceof Touch
    ) {
      this.touch = touch;

      this.identifier = this.touch.identifier;

      this.targetFromEvent = this.touch.target;

      clientX = this.touch.clientX;
      clientY = this.touch.clientY;
    } else {
      this.identifier = 'mouse';

      const event = originalEvent as MouseEvent;

      this.targetFromEvent = event.target;

      clientX = event.clientX;
      clientY = event.clientY;
    }

    this.target = document.elementFromPoint(clientX, clientY) as HTMLElement | null;

    this.position = new Vector2(clientX, clientY);
    this.velocity = new Vector2();
    this.acceleration = new Vector2();
  }
}

