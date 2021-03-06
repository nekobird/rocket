import {
  Point,
  Repeater,
  Vector2,
} from '../../rocket/rocket';

import {
  DragEventManager,
} from './poly-drag';

import {
  EventName,
  Identifier,
  SensorData,
} from './sensor-hub';

export class EventStory {
  public manager: DragEventManager;

  public repeater: Repeater;

  public identifier: Identifier = '';

  public previousEvent?: EventName;
  public currentEvent?: EventName;

  public downData?: SensorData;
  public dragData?: SensorData;
  public upData?: SensorData;
  public cancelData?: SensorData;

  public isActive: boolean = false;
  public isLongPress: boolean = false;
  public isCancelled: boolean = false;

  public longPressTimeout;

  public longPressIsCleared: boolean = false;

  public position: Vector2;
  public previousPosition: Vector2;

  public velocity: Vector2;
  public previousVelocity: Vector2;

  public acceleration: Vector2;
  public previousAcceleration: Vector2;

  public firstDragPoint: Point | false = false;

  public wasScrolling: boolean = false;
  public wasResizing: boolean = false;

  constructor(manager: DragEventManager) {
    this.manager = manager;

    const { downRepeaterFrequency } = this.manager.config;

    this.repeater = new Repeater({
      frequency: downRepeaterFrequency,
    });

    this.position = new Vector2();
    this.previousPosition = new Vector2();

    this.velocity = new Vector2();
    this.previousVelocity = new Vector2();

    this.acceleration = new Vector2();
    this.previousAcceleration = new Vector2();
  }

  public get downPoint(): Point | false {
    if (typeof this.downData === 'object') {
      const { clientX, clientY } = this.downData;

      return new Point(clientX, clientY);
    }

    return false;
  }

  public get dragPoint(): Point | false {
    if (typeof this.dragData === 'object') {
      const { clientX, clientY } = this.dragData;

      return new Point(clientX, clientY);
    }

    return false;
  }

  public get upPoint(): Point | false {
    if (typeof this.upData === 'object') {
      const { clientX, clientY } = this.upData;

      return new Point(clientX, clientY);
    }

    return false;
  }

  public get isScrolling(): boolean {
    return this.manager.isScrolling;
  }

  public get duration(): number | undefined {
    if (typeof this.downData === 'object') {
      if (this.isActive === true && typeof this.dragData === 'object') {
        return (this.dragData.time - this.downData.time) / 1000;
      }

      if (this.isCancelled === true && typeof this.cancelData === 'object') {
        return (this.cancelData.time - this.downData.time) / 1000;
      }

      if (typeof this.upData === 'object') {
        return (this.upData.time - this.downData.time) / 1000;
      }
    }

    return undefined;
  }

  public get currentTargetElement(): HTMLElement | false {
    if (typeof this.currentEvent === 'string') {
      return this.getTargetElementFromData(this[`${this.currentEvent}Data`]);
    }

    return false;
  }

  public getTargetElementFromData(data: SensorData): HTMLElement {
    const { clientX, clientY } = data;

    return document.elementFromPoint(clientX, clientY) as HTMLElement;
  }

  public get previousEventData(): SensorData | false {
    if (typeof this.previousEvent === 'string') {
      return this[`${this.previousEvent}Data`];
    }

    return false;
  }

  public get currentEventData(): SensorData | false {
    if (typeof this.currentEvent === 'string') {
      return this[`${this.currentEvent}Data`];
    }

    return false;
  }

  // @vectors

  public initializeVectors(data: SensorData) {
    this.position = new Vector2(data.clientX, data.clientY);
    this.previousPosition = new Vector2(data.clientX, data.clientY);

    this.velocity = new Vector2();
    this.previousVelocity = new Vector2();

    this.acceleration = new Vector2();
    this.previousAcceleration = new Vector2();
  }

  public updateVectors(data: SensorData) {
    const { clientX, clientY } = data;

    this.position.equals(clientX, clientY);
    this.velocity.equals(Vector2.subtract(this.position, this.previousPosition));
    this.acceleration.equals(Vector2.subtract(this.velocity, this.previousVelocity));
  }

  public updatePreviousVectors() {
    this.previousPosition.equals(this.position);
    this.previousVelocity.equals(this.velocity);
    this.previousAcceleration.equals(this.acceleration);
  }

  // @eventsHandler

  public update(data: SensorData): this {
    switch (data.name) {
      case 'down': {
        this.onDown(data);
        break;
      }
      case 'drag': {
        this.onDrag(data);
        break;
      }
      case 'up': {
        this.onUp(data);
        break;
      }
      case 'cancel': {
        this.onCancel(data);
        break;
      }
    }

    return this;
  }

  public onDown(data: SensorData) {
    const { config } = this.manager;

    this.isActive = true;
    this.identifier = data.identifier;

    this.downData = data;

    this.initializeVectors(data);

    this.currentEvent = data.name;

    if (config.condition(this, this.manager) === true) {
      this.checkWasScrolling();

      config.onDown(this, this.manager);

      if (config.enableDownRepeater === true) {
        this.repeater.setConfig({
          frequency: config.downRepeaterFrequency,
          onStart: () => config.onDownRepeatStart(this.repeater, this, this.manager),
          onRepeat: () => {
            this.checkWasScrolling();
            config.onDownRepeat(this.repeater, this, this.manager);
          },
          onEnd: () => config.onDownRepeatEnd(this.repeater, this, this.manager),
        });

        config.beforeDownRepeatStart(this.repeater, this, this.manager);

        this.repeater.start();
      }

      if (config.enableLongPress === true) {
        this.checkWasScrolling();

        this.longPressTimeout = setTimeout(() => {
          if (config.longPressCondition(this, this.manager) === true) {
            this.onLongPress(data);
          }
        }, config.longPressWait * 1000);
      }
    } else {
      this.isActive = false;
    }
  }

  public onDrag(data: SensorData) {
    if (this.isActive === true) {
      if (this.firstDragPoint === false) {
        this.firstDragPoint = new Point(data.clientX, data.clientY);
      }

      this.checkWasScrolling();

      this.dragData = data;

      this.updateVectors(data);

      this.previousEvent = this.currentEvent;

      this.currentEvent = data.name;

      this.manager.config.onDrag(this, this.manager);

      this.updatePreviousVectors();
    }
  }

  public onUp(data: SensorData) {
    if (this.isActive === true) {
      this.repeater.stop();

      this.clearLongPress();

      this.isActive = false;

      this.upData = data;

      this.updateVectors(data);

      this.previousEvent = this.currentEvent;

      this.currentEvent = data.name;

      this.manager.config.onUp(this, this.manager);

      this.wasScrolling = false;

      this.updatePreviousVectors();
    }
  }

  public onCancel(data: SensorData) {
    if (this.isActive === true) {
      this.repeater.stop();

      this.clearLongPress();

      this.isCancelled = true;
      this.isActive = false;

      this.cancelData = data;

      this.updateVectors(data);

      this.previousEvent = this.currentEvent;

      this.currentEvent = data.name;

      this.manager.config.onCancel(this, this.manager);

      this.wasScrolling = false;

      this.updatePreviousVectors();
    }
  }

  public onLongPress(data: SensorData) {
    const { config } = this.manager;

    this.isLongPress = true;

    config.onLongPress(this, this.manager);
  }

  public clearLongPress() {
    clearTimeout(this.longPressTimeout);

    this.longPressIsCleared = true;
  }

  private checkWasScrolling() {
    if (this.isScrolling === true) {
      this.wasScrolling = true;
    }
  }
}
