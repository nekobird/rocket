import {
  MouseSensor,
} from './mouseSensor';

import {
  TouchSensor,
} from './touchSensor';

import {
  SensorHub,
} from './sensorHub';

import {
  DragEvent,
} from './dragEvent';

export interface DragEventManagerConfig {
  enableDownRepeater: boolean;
  downRepeaterDelay: number;

  enableLongPress: boolean;
  longPressWait: number; // In seconds.

  leftMouseButtonOnly: boolean;

  parent: HTMLElement | Window;

  onDownRepeat: (event: DragEvent, manager: DragEventManager) => void;
  onLongPress: (event: DragEvent, manager: DragEventManager) => void;
  condition: (event: DragEvent, manager: DragEventManager) => boolean;
  onDown: (event: DragEvent, manager: DragEventManager) => void;
  onDrag: (event: DragEvent, manager: DragEventManager) => void;
  onUp: (event: DragEvent, manager: DragEventManager) => void;
  onCancel: (event: DragEvent, manager: DragEventManager) => void;
}

export const DRAG_EVENT_MANAGER_DEFAULT_CONFIG: DragEventManagerConfig = {
  enableDownRepeater: false,
  downRepeaterDelay: 1 / 60,

  enableLongPress: false,
  longPressWait: 2,
  parent: window,

  leftMouseButtonOnly: true,

  onDownRepeat: (event, manager) => {},
  onLongPress: (event, manager) => {},
  condition: (event, manager) => true,
  onDown: (event, manager) => {},
  onDrag: (event, manager) => {},
  onUp: (event, manager) => {},
  onCancel: (event, manager) => {},
};

export class DragEventManager {
  public config: DragEventManagerConfig;

  public mouseSensor: MouseSensor;
  public touchSensor: TouchSensor;
  public sensorHub: SensorHub;

  public isActive: boolean = false;

  constructor(config?: Partial<DragEventManagerConfig>) {
    this.config = Object.assign({}, DRAG_EVENT_MANAGER_DEFAULT_CONFIG);
    if (typeof config === 'object') {
      this.setConfig(config);
    }

    this.mouseSensor = new MouseSensor(this);
    this.touchSensor = new TouchSensor(this);
    this.sensorHub = new SensorHub(this);
  }

  public setConfig(config: Partial<DragEventManagerConfig>): this {
    Object.assign(this.config, config);
    return this;
  }

  public initialize(): this {
    this.mouseSensor.listen();
    this.touchSensor.listen();
    return this;
  }
}