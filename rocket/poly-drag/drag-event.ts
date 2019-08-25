import {
  Vector2,
} from '../rocket';

import {
  PolyDrag,
} from './poly-drag';

export type DragEventIdentifier = number | 'mouse';

export type DragEventType = 'start' | 'drag' | 'stop' | 'cancel';

export class DragEvent {
  public polyDrag: PolyDrag;

  public type: DragEventType;

  public isTouch: boolean = false;

  public position: Vector2;
  public velocity: Vector2;
  public acceleration: Vector2;

  public time: number;

  public event: MouseEvent | TouchEvent;

  public touch?: Touch;

  public identifier: DragEventIdentifier;

  constructor(polyDrag: PolyDrag) {
    this.polyDrag = polyDrag;

    this.position = new Vector2();
    this.velocity = new Vector2();
    this.acceleration = new Vector2();
  }

  public setFromTouchEvent(type: DragEventType, event: TouchEvent, touch: Touch) {
    this.type = type;

    this.isTouch = true;

    this.time = Date.now();

    this.event = event;

    this.identifier = touch.identifier;
  }
}