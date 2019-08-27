import  {
  DOMUtil,
  Vector2,
} from '../rocket';

import {
  MONO_DRAG_DEFAULT_CONFIG,
  MonoDragConfig,
} from './config';

import {
  MonoDragEvent,
} from './mono-drag-event';

import {
  MouseSensor,
} from './sensors/mouse-sensor';

import {
  TouchSensor,
} from './sensors/touch-sensor';

export class MonoDrag {
  public config: MonoDragConfig;

  public mouseSensor: MouseSensor;
  public touchSensor: TouchSensor;

  public isActive: boolean = false;
  public isTouch: boolean = false;
  public isListening: boolean = false;

  public touchIdentifier: number = 0;

  public startTime: number = 0;

  public history: MonoDragEvent[];

  public offset: Vector2;

  public startingDragEvent?: MonoDragEvent;
  public previousDragEvent?: MonoDragEvent;

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

    this.listen();
  }

  public setConfig(config?: Partial<MonoDragConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }

  public listen() {
    if (this.isListening === false) {
      this.mouseSensor.attach();
      this.touchSensor.attach();

      this.isListening = true;
    }
  }

  public stopListening() {
    if (this.isListening === true) {
      this.mouseSensor.detach();
      this.touchSensor.detach();

      this.isListening = false;
    }
  }

  private preventDefault(event: MouseEvent | TouchEvent) {
    const { preventDefault } = this.config;

    if (preventDefault === true) {
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

  private updateHistory(dragEvent: MonoDragEvent) {
    const { keepHistory } = this.config;

    if (keepHistory === true) {
      if (
        typeof this.history !== 'object'
        || Array.isArray(this.history) === false
      ) {
        this.history = [];
      }

      this.history.push(dragEvent);
    }
  }

  private end() {
    this.touchIdentifier = 0;

    this.isActive = false;
  }

  // Sensors will send MonoDragEvent to these methods.
  public dragStart(dragEvent: MonoDragEvent) {
    const { originalEvent: event, position, time } = dragEvent;

    if (this.isActive === false) {
      this.preventDefault(event);

      this.isActive = true;

      this.isTouch = dragEvent.isTouch;

      if (dragEvent.isTouch === true) {
        this.touchIdentifier = dragEvent.touchIdentifier as number;
      }

      this.startTime = time;

      this.config.onEvent(event, this);

      this.updateOffset(position.x, position.y);

      dragEvent.updateOffset();

      this.history = [];

      this.updateHistory(dragEvent);

      this.startingDragEvent = dragEvent;

      this.config.onDragStart(dragEvent, this);

      this.previousDragEvent = dragEvent;
    }
  }

  public drag(dragEvent: MonoDragEvent) {
    const { originalEvent: event } = dragEvent;

    if (this.isActive === true) {
      this.preventDefault(event);

      this.config.onEvent(event, this);

      this.updateHistory(dragEvent);

      this.config.onDrag(dragEvent, this);

      this.previousDragEvent = dragEvent;
    }
  }

  public dragStop(dragEvent: MonoDragEvent) {
    const { originalEvent: event } = dragEvent;

    if (this.isActive === true) {
      this.preventDefault(event);

      this.config.onEvent(event, this);

      this.updateHistory(dragEvent);

      this.config.onDragStop(dragEvent, this);

      this.end();

      this.previousDragEvent = dragEvent;
    }
  }

  public dragCancel(dragEvent: MonoDragEvent) {
    const { originalEvent: event } = dragEvent;

    if (this.isActive === true) {
      this.preventDefault(event);

      this.config.onEvent(event, this);

      this.updateHistory(dragEvent);

      this.config.onDragCancel(dragEvent, this);

      this.end();

      this.previousDragEvent = dragEvent;
    }
  }
}
