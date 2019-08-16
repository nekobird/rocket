import {
  Vector2,
} from '../rocket';

export type DragEventType = 'down' | 'drag' | 'up' | 'cancel';

export interface DragEvent {
  type: DragEventType;

  event: TouchEvent | MouseEvent;

  target: EventTarget | null;

  isTouch: boolean;

  touch?: Touch;

  identifier?: number;

  targetOffset: Vector2;

  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;

  time: number;
}