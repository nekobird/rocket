import {
  Vector2,
} from '../rocket';

import {
  MonoDrag,
} from './mono-drag';

import {
  MonoDragEvent,
} from './mono-drag-event';

export class MonoDragStory {
  public monoDrag: MonoDrag;

  public offset: Vector2;

  public previousPosition: Vector2;
  public previousVelocity: Vector2;

  public history: MonoDragEvent[];

  constructor(monoDrag: MonoDrag) {
    this.monoDrag = monoDrag;

    this.offset = new Vector2();

    this.previousPosition = new Vector2();
    this.previousVelocity = new Vector2();

    this.history = [];
  }

  public addDragEvent(monoDragEvent: MonoDragEvent) {

  }

  private updateHistory(monoDragEvent: MonoDragEvent) {
    const { keepHistory } = this.monoDrag.config;

    if (keepHistory === true) {
      this.history.push(monoDragEvent);
    }
  }
}
