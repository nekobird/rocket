import {
  DOMUtil,
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

  public startingMonoDragEvent: MonoDragEvent | null = null;
  public endingMonoDragEvent: MonoDragEvent | null = null;
  public previousMonoDragEvent: MonoDragEvent | null = null;

  constructor(monoDrag: MonoDrag) {
    this.monoDrag = monoDrag;

    this.offset = new Vector2();

    this.previousPosition = new Vector2();
    this.previousVelocity = new Vector2();

    this.history = [];
  }

  public addDragEvent(monoDragEvent: MonoDragEvent) {
    this.addEventToHistory(monoDragEvent);

    if (monoDragEvent.type === 'start') {
      this.startingMonoDragEvent = monoDragEvent;

      this.updateOffset(monoDragEvent.position);
    }
  }

  private updateOffset(position: Vector2): boolean {
    const { target, offsetFrom } = this.monoDrag.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      let element = target as HTMLElement;

      if (DOMUtil.isHTMLElement(offsetFrom) === true) {
        element = offsetFrom as HTMLElement;
      }

      const { left, top } = element.getBoundingClientRect();

      this.offset.equals(
        position.x - left,
        position.y - top,
      );

      return true;
    }

    return false;
  }

  private addEventToHistory(monoDragEvent: MonoDragEvent) {
    const { keepHistory } = this.monoDrag.config;

    if (keepHistory === true) {
      this.history.push(monoDragEvent);
    }
  }
}
