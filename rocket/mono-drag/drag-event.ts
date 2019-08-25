import {
  Vector2,
} from '../rocket';

export type DragEventType = 'start' | 'drag' | 'stop' | 'cancel';

export interface DragEvent {
  type: DragEventType;

  isTouch: boolean;

  touchIdentifier?: number;

  originalEvent: TouchEvent | MouseEvent;
  originalTouch?: Touch;

  targetFromEvent: EventTarget | null;
  target: HTMLElement | null;

  offset: Vector2;

  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;

  time: number;
}

// TODO: Convert this into a class.

// export class DragEvent {
//   public type: DragEventType;

//   public isTouch: boolean = false;

//   constructor() {

//   }
// }