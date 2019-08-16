import {
  Vector2,
} from '../rocket';

export type DragEventType = 'start' | 'drag' | 'stop' | 'cancel';

export class DragEvent {
  public type: DragEventType;

  public isActive: boolean = false;

  public position: Vector2;
  public velocity: Vector2;
  public acceleration: Vector2;

  constructor() {

  }
}