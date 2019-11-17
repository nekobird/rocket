import {
  DOMUtil,
  Vector2,
} from '~/rocket';

import {
  MonoTap,
} from './mono-tap';

export type MonoTapEventIdentifier = 'mouse' | number;

export type MonoTapEventType = 'down' | 'move' | 'up' | 'cancel';

export class MonoTapEvent {
  public monoTap: MonoTap;

  public type: MonoTapEventType;

  public identifier: MonoTapEventIdentifier;

  public isTouch: boolean;

  public originalEvent: MouseEvent | TouchEvent;
  public originalTouch?: Touch;

  public targetFromEvent: EventTarget | null;
  public target: HTMLElement | null;

  public position: Vector2;
  public offset?: Vector2;

  public time: number;

  constructor(
    monoTap: MonoTap,
    type: MonoTapEventType,
    originalEvent: MouseEvent | TouchEvent,
    isTouch: boolean = false,
    touch?: Touch,
  ) {
    this.monoTap = monoTap;

    this.time = Date.now();

    this.type = type;

    this.isTouch = isTouch;

    this.originalEvent = originalEvent;
    this.targetFromEvent = originalEvent.target;

    let clientX;
    let clientY;

    if (
      isTouch === true
      && typeof touch !== 'undefined'
    ) {
      this.identifier = touch.identifier;

      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      this.identifier = 'mouse';

      const event = originalEvent as MouseEvent;

      clientX = event.clientX;
      clientY = event.clientY;
    }

    this.target = document.elementFromPoint(clientX, clientY) as HTMLElement | null;

    this.position = new Vector2(clientX, clientY);

    this.updateOffset();
  }

  private updateOffset() {
    const { target, offsetFrom } = this.monoTap.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      let element = target as HTMLElement;

      if (DOMUtil.isHTMLElement(offsetFrom) === true) {
        element = offsetFrom as HTMLElement;
      }

      const { left, top } = element.getBoundingClientRect();

      this.offset= new Vector2(
        this.position.x - left,
        this.position.y - top,
      );
    }
  }
}
