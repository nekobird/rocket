import {
  Vector2,
} from '../rocket';

import {
  PolyDrag,
} from './poly-drag';

export type PolyDragEventIdentifier = number | 'mouse';

export type PolyDragEventType = 'start' | 'drag' | 'stop' | 'cancel';

export class PolyDragEvent {
  public polyDrag: PolyDrag;

  public type?: PolyDragEventType;

  public isTouch: boolean = false;

  public touch?: Touch;

  public position: Vector2;
  public velocity: Vector2;
  public acceleration: Vector2;

  public time?: number;

  public originalEvent?: MouseEvent | TouchEvent;

  public targetFromEvent?: EventTarget | null;
  public target?: HTMLElement | null;

  public identifier?: PolyDragEventIdentifier;

  constructor(polyDrag: PolyDrag) {
    this.polyDrag = polyDrag;

    this.position = new Vector2();
    this.velocity = new Vector2();
    this.acceleration = new Vector2();
  }

  public setFromMouseEvent(type: PolyDragEventType, event: MouseEvent) {
    this.type = type;

    this.isTouch = false;

    this.time = Date.now();

    this.originalEvent = event;

    this.targetFromEvent = event.target;

    const { clientX, clientY } = this.originalEvent;

    this.target = document.elementFromPoint(clientX, clientY) as HTMLElement | null;

    this.identifier = 'mouse';
  }

  public setFromTouchEvent(type: PolyDragEventType, event: TouchEvent, touch: Touch) {
    this.type = type;

    this.isTouch = true;

    this.time = Date.now();

    this.originalEvent = event;

    this.targetFromEvent = touch.target;

    const { clientX, clientY } = touch;

    this.target = document.elementFromPoint(clientX, clientY) as HTMLElement | null;

    this.identifier = touch.identifier;
  }
}