import {
  DOMUtil,
  Util,
  Vector2,
  Viewport,
} from '~/rocket';

import {
  POINTER_MOVE_DEFAULT_CONFIG,
  PointerMoveConfig,
} from './config';

import {
  MoveEvent,
  MoveEventType,
} from './move-event';

export class PointerMove {
  public config: PointerMoveConfig;

  public isInside: boolean = false;
  public isMoving: boolean = false;

  private debounceMouseMove?: Function;

  private position: Vector2;
  private velocity: Vector2;
  private acceleration: Vector2;

  private previousPosition: Vector2;
  private previousVelocity: Vector2;

  public previousStartEvent?: MoveEvent;
  public previousMoveEvent?: MoveEvent;
  public previousEvent?: MoveEvent;

  constructor(config?: Partial<PointerMoveConfig>) {
    this.config = {...POINTER_MOVE_DEFAULT_CONFIG};

    this.setConfig(config);

    this.position = new Vector2();
    this.velocity = new Vector2();
    this.acceleration = new Vector2();

    this.previousPosition = new Vector2();
    this.previousVelocity = new Vector2();

    this.listen();
  }

  public setConfig(config?: Partial<PointerMoveConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }

  private createMoveEvent(
    type: MoveEventType,
    event: MouseEvent,
  ): MoveEvent {
    this.updateVectors(event);

    return {
      event,
      type,
      time: Date.now(),
      position: Vector2.clone(this.position),
      velocity: Vector2.clone(this.velocity),
      acceleration: Vector2.clone(this.acceleration),
    };
  }

  private updateVectors(event: MouseEvent) {
    this.position = this.getPositionVectorFromEvent(event);

    this.velocity = Vector2.subtract(this.position, this.previousPosition);
    this.acceleration = Vector2.subtract(this.velocity, this.previousVelocity);

    this.previousPosition.equals(this.position);
    this.previousVelocity.equals(this.velocity);
  }

  private getPositionVectorFromEvent(event: MouseEvent): Vector2 {
    const { clientX, clientY } = event;

    return new Vector2(clientX, clientY);
  }

  private eventHandlerMouseEnter = (event: MouseEvent) => {
    const pointerEvent = this.createMoveEvent('enter', event);

    this.previousEvent = pointerEvent;

    this.isInside = true;

    this.config.onEvent(event, this);
    this.config.onEnter(pointerEvent, this);
  };

  private eventHandlerMouseMove = (event: MouseEvent) => {
    const pointerEvent = this.createMoveEvent('move', event);

    this.previousMoveEvent = pointerEvent;
    this.previousEvent = pointerEvent;

    this.isInside = this.checkIfPointerIsInside(event);

    this.config.onEvent(event, this);

    if (this.isMoving === false) {
      this.isMoving = true;

      this.previousStartEvent = pointerEvent;
      
      this.config.onMoveStart(pointerEvent, this);
    }

    this.config.onMove(pointerEvent, this);
  };

  private eventHandlerMouseLeave = (event: MouseEvent) => {
    const pointerEvent = this.createMoveEvent('leave', event);
    
    this.previousEvent = pointerEvent;

    this.isInside = false;

    this.config.onEvent(event, this);
    this.config.onLeave(pointerEvent, this);
  };

  private eventHandlerMouseMoveEnd = () => {
    if (this.isMoving === true) {
      this.isMoving = false;

      this.config.onMoveEnd(this.previousMoveEvent as MoveEvent, this);
    }
  };

  private checkIfPointerIsInside(event: MouseEvent) {
    let { target } = this.config;

    if (target === window) {
      if (
        event.clientX >= 0
        && event.clientX <= Viewport.width
        && event.clientY >= 0
        && event.clientY <= Viewport.height
      ) {
        return true;
      }
    } else if (DOMUtil.isHTMLElement(target) === true) {
      target = target as HTMLElement;

      const { top, bottom, left, right } = target.getBoundingClientRect();

      if (
        event.clientY >= top
        && event.clientY <= bottom
        && event.clientX >= left
        && event.clientX <= right
      ) {
        return true;
      }
    }

    return false;
  }

  public listen() {
    let { target, debounceDelayInSeconds } = this.config;

    if (target === window || DOMUtil.isHTMLElement(target) === true) {
      window.addEventListener('mousemove', this.eventHandlerMouseMove as EventListener);

      this.debounceMouseMove = Util.debounce(this.eventHandlerMouseMoveEnd, debounceDelayInSeconds);
      window.addEventListener('mousemove', this.debounceMouseMove as EventListener);

      target = target as HTMLElement;

      target.addEventListener('mouseenter', this.eventHandlerMouseEnter as EventListener);
      target.addEventListener('mouseleave', this.eventHandlerMouseLeave as EventListener);
    }
  }

  public stopListen() {
    let { target } = this.config;

    if (target === window || DOMUtil.isHTMLElement(target) === true)  {
      window.removeEventListener('mousemove', this.eventHandlerMouseMove as EventListener);
      window.removeEventListener('mousemove', this.debounceMouseMove as EventListener);

      target = target as HTMLElement;

      target.removeEventListener('mouseenter', this.eventHandlerMouseEnter as EventListener);
      target.removeEventListener('mouseleave', this.eventHandlerMouseLeave as EventListener);
    }
  }
}
