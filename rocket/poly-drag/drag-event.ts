import {
  Vector2,
} from '../rocket';

export type DragEventIdentifier = number | 'mouse';

export type DragEventType = 'start' | 'drag' | 'stop' | 'cancel';

export class DragEvent {
  public type: DragEventType;

  public isActive: boolean = false;
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

  public attachSensors() {

  }

}