import {
  Repeater,
} from '../rocket';

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

  enableLongPress: boolean;
  longPressWait: number; // In seconds.

  leftMouseButtonOnly: boolean;

  parent: HTMLElement | Window;

  downRepeaterFrequency: number;
  beforeDownRepeatStart: (repeater: Repeater, event: DragEvent, manager: DragEventManager) => void;
  onDownRepeatStart: (repeater: Repeater, event: DragEvent, manager: DragEventManager) => void;
  onDownRepeat: (repeater: Repeater, event: DragEvent, manager: DragEventManager) => void;
  onDownRepeatEnd: (repeater: Repeater, event: DragEvent, manager: DragEventManager) => void;

  longPressCondition: (event: DragEvent, manager: DragEventManager) => boolean;
  onLongPress: (event: DragEvent, manager: DragEventManager) => void;

  condition: (event: DragEvent, manager: DragEventManager) => boolean;
  onDown: (event: DragEvent, manager: DragEventManager) => void;
  onDrag: (event: DragEvent, manager: DragEventManager) => void;
  onUp: (event: DragEvent, manager: DragEventManager) => void;
  onCancel: (event: DragEvent, manager: DragEventManager) => void;
}

export const DRAG_EVENT_MANAGER_DEFAULT_CONFIG: DragEventManagerConfig = {
  enableDownRepeater: false,

  enableLongPress: false,
  longPressWait: 2,

  leftMouseButtonOnly: true,

  parent: window,

  downRepeaterFrequency: 60,
  beforeDownRepeatStart: () => {},
  onDownRepeatStart: () => {},
  onDownRepeat: () => {},
  onDownRepeatEnd: () => {},

  longPressCondition: () => true,
  onLongPress: () => {},

  condition: () => true,
  onDown: () => {},
  onDrag: () => {},
  onUp: () => {},
  onCancel: () => {},
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
    this.mouseSensor.stop();
    this.touchSensor.stop();
    this.mouseSensor.listen();
    this.touchSensor.listen();
    return this;
  }
}
