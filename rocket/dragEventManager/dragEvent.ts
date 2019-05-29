import {
  Vector2,
} from '../rocket';

import {
  DragEventManager,
} from './dragEventManager';

import {
  EventName,
  Identifier,
  SensorData,
} from './sensorHub';

export class DragEvent {
  public manager: DragEventManager;

  public downIntervalID?: number;

  public identifier: Identifier = '';

  public previousEvent?: EventName;
  public currentEvent?: EventName;

  public downData?: SensorData;
  public dragData?: SensorData;
  public upData?: SensorData;
  public cancelData?: SensorData;

  public condition: boolean = false;
  public isActive: boolean = false;
  public isLongPress: boolean = false;
  public isCancelled: boolean = false;

  public longPressTimeout;
  public longPressIsCleared: boolean = false;

  public position: Vector2;
  public lastPosition: Vector2;

  public velocity: Vector2;
  public lastVelocity: Vector2;

  public acceleration: Vector2;
  public lastAcceleration: Vector2;

  constructor(manager: DragEventManager) {
    this.manager = manager;

    this.position = new Vector2();
    this.lastPosition = new Vector2();

    this.velocity = new Vector2();
    this.lastVelocity = new Vector2();

    this.acceleration = new Vector2();
    this.lastAcceleration = new Vector2();
  }
  
  public get duration(): number | undefined {
    if (typeof this.downData === 'object') {
      if (
        this.isActive === true
        && typeof this.dragData === 'object'
      ) {
        return (this.dragData.time - this.downData.time) / 1000;
      }

      if (
        this.isCancelled === true
        && typeof this.cancelData === 'object'
      ) {
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
    return <HTMLElement>document.elementFromPoint(data.clientX, data.clientY);
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

  public initializeVectors(data: SensorData) {
    this.position = new Vector2(data.clientX, data.clientY);
    this.lastPosition = new Vector2(data.clientX, data.clientY);

    this.velocity = new Vector2();
    this.lastVelocity = new Vector2();

    this.acceleration = new Vector2();
    this.lastAcceleration = new Vector2();
  }

  public updateVectors(data: SensorData) {
    const point = {
      x: data.clientX,
      y: data.clientY,
    };
    this.position.equals(point);
    this.velocity.equals(
      Vector2.subtract(this.position, this.lastPosition)
    );
    this.acceleration.equals(
      Vector2.subtract(this.velocity, this.lastVelocity)
    );
  }

  public updateLastVectors() {
    this.lastPosition.equals(this.position);
    this.lastVelocity.equals(this.velocity);
    this.lastAcceleration.equals(this.acceleration);
  }

  public onDown(data: SensorData) {
    const { config } = this.manager;

    this.isActive = true;
    this.identifier = data.identifier;
    this.downData = data;

    this.initializeVectors(data);

    this.currentEvent = data.name;

    this.condition = config.condition(this, this.manager)
    if (this.condition === true) {
      this.manager.config.onDown(this, this.manager);

      if (config.enableDownRepeater === true) {
        this.downIntervalID = setInterval(
          () => config.onDownRepeat(this, this.manager),
          config.downRepeaterDelay * 1000
        );
      }

      if (this.manager.config.enableLongPress === true) {
        this.longPressTimeout = setTimeout(
          () => this.onLongPress(data),
          this.manager.config.longPressWait * 1000
        );
      }
    } else {
      this.isActive = false;
    }
  }

  public onDrag(data: SensorData) {
    if (this.isActive  === true) {
      this.dragData = data;

      this.updateVectors(data);

      this.previousEvent = this.currentEvent;
      this.currentEvent = data.name;

      this.manager.config.onDrag(this, this.manager);
      this.updateLastVectors();
    }
  }

  public onUp(data: SensorData) {
    if (this.isActive === true) {
      this.clearDownRepeater();
      this.clearLongPress();

      this.isActive = false;
      this.upData = data;

      this.updateVectors(data);

      this.previousEvent = this.currentEvent;
      this.currentEvent = data.name;

      this.manager.config.onUp(this, this.manager);
      this.updateLastVectors();
    }
  }

  public onCancel(data: SensorData) {
    if (this.isActive === true) {
      this.clearDownRepeater();
      this.clearLongPress();

      this.isCancelled = true;
      this.isActive = false;

      this.cancelData = data;

      this.updateVectors(data);

      this.previousEvent = this.currentEvent;
      this.currentEvent = data.name;

      this.manager.config.onCancel(this, this.manager);
      this.updateLastVectors();
    }
  }

  public onLongPress(data: SensorData) {
    this.isLongPress = true;
    this.manager.config.onLongPress(this, this.manager);
  }

  public clearDownRepeater() {
    clearInterval(this.downIntervalID);
  }

  public clearLongPress() {
    clearTimeout(this.longPressTimeout);
    this.longPressIsCleared = true;
  }
}
