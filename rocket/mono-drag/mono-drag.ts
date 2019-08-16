import  {
  DOMUtil,
  Vector2,
} from '../rocket';

import {
  MONO_DRAG_DEFAULT_CONFIG,
  MonoDragConfig,
} from './config';

import {
  DragEvent,
} from './drag-event';

import {
  MouseSensor,
} from './mouse-sensor';

import {
  TouchSensor,
} from './touch-sensor';

export class MonoDrag {
  public config: MonoDragConfig;

  public mouseSensor: MouseSensor;
  public touchSensor: TouchSensor;

  public isActive: boolean = false;
  public isTouch: boolean = false;

  public touchIdentifier: number = 0;

  public startTime: number = 0;

  public history: DragEvent[];

  public offset: Vector2;

  public startingDragEvent?: DragEvent;
  public previousDragEvent?: DragEvent;

  public previousPosition: Vector2;
  public previousVelocity: Vector2;

  constructor(config?: Partial<MonoDragConfig>) {
    this.config = {...MONO_DRAG_DEFAULT_CONFIG};

    this.setConfig(config);

    this.mouseSensor = new MouseSensor(this);
    this.touchSensor = new TouchSensor(this);

    this.offset = new Vector2();

    this.previousPosition = new Vector2();
    this.previousVelocity = new Vector2();

    this.history = [];

    this.attachSensors();
  }

  public setConfig(config?: Partial<MonoDragConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }

  private preventDefault(event: MouseEvent | TouchEvent) {
    if (this.config.preventDefault === true) {
      event.preventDefault();
    }
  }

  private updateOffset(x: number, y: number) {
    const { target, offsetFrom } = this.config;

    if (DOMUtil.isHTMLElement(target) === true) {
      let element = target as HTMLElement;

      if (DOMUtil.isHTMLElement(offsetFrom) === true) {
        element = offsetFrom as HTMLElement;
      }
        
      const { left, top } = element.getBoundingClientRect();

      this.offset.equals(
        x - left,
        y - top,
      );
    }
  }

  private updateHistory(pointerEvent: DragEvent) {
    const { keepHistory } = this.config;

    if (keepHistory === true) {
      if (
        typeof this.history !== 'object'
        || Array.isArray(this.history) === false
      ) {
        this.history = [];
      }

      this.history.push(pointerEvent);
    }
  }

  public dragStart(pointerEvent: DragEvent, isTouch: boolean = false) {
    const { event, position, time } = pointerEvent;

    if (this.isActive === false) {
      this.preventDefault(event);

      this.isActive = true;

      this.isTouch = isTouch;

      if (isTouch === true) {
        this.touchIdentifier = pointerEvent.identifier as number;
      }

      this.startTime = time;

      this.config.onEvent(event, this);

      this.updateOffset(position.x, position.y);

      this.history = [];

      this.updateHistory(pointerEvent);

      this.startingDragEvent = pointerEvent;

      this.config.onStart(pointerEvent, this);

      this.previousDragEvent = pointerEvent;
    }
  }

  public drag(pointerEvent: DragEvent) {
    const { event } = pointerEvent;

    if (this.isActive === false) {
      this.preventDefault(event);

      this.config.onEvent(event, this);

      this.updateHistory(pointerEvent);

      this.config.onDrag(pointerEvent, this);

      this.previousDragEvent = pointerEvent;
    }
  }

  public dragEnd(pointerEvent: DragEvent) {
    const { event } = pointerEvent;

    if (this.isActive === true) {
      this.preventDefault(event);

      this.config.onEvent(event, this);

      this.updateHistory(pointerEvent);

      this.config.onEnd(pointerEvent, this);

      this.end();

      this.previousDragEvent = pointerEvent;
    }
  }

  public dragCancel(pointerEvent: DragEvent) {
    const { event } = pointerEvent;

    if (this.isActive === true) {
      this.preventDefault(event);

      this.config.onEvent(event, this);

      this.updateHistory(pointerEvent);

      this.config.onCancel(pointerEvent, this);

      this.end();

      this.previousDragEvent = pointerEvent;
    }
  }

  private end() {
    this.touchIdentifier = 0;

    this.isActive = false;
  }

  public attachSensors() {
    this.mouseSensor.attach();
    this.touchSensor.attach(); 
  }

  public detachSensors() {
    this.mouseSensor.detach();
    this.touchSensor.detach(); 
  }
}
