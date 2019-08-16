import {
  Vector2,
} from '../rocket';

import {
  DragEvent,
} from './drag-event';


export class DragStory {
  public isActive: boolean;

  public dragEvents: DragEvent[];
  public activeDragEvent: DragEvent;

  public previousPosition: Vector2;
  public previousVelocity: Vector2;

  constructor() {
    
  }


  private createDragEvent(type: DragEventType, event: TouchEvent, touch: Touch): DragEvent {
    const { identifier, clientX, clientY, target } = touch;

    const position = new Vector2(clientX, clientY);

    let velocity = new Vector2();
    let acceleration = new Vector2();

    if (type !== 'start') {
      velocity = Vector2.subtract(position, this.previousPosition);
      acceleration = Vector2.subtract(velocity, this.previousVelocity);
    }

    const offset = Vector2.clone(this.polyDrag.offset);

    this.polyDrag.previousPosition.equals(position);
    this.polyDrag.previousVelocity.equals(velocity);

    return {
      type,
      event,
      target,
      isTouch: true,
      touch,
      identifier,
      offset,
      position,
      velocity,
      acceleration,
      time: Date.now(),
    };
  }
}