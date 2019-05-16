import {
  MouseSensor,
} from './mouseSensor'

import {
  TouchSensor,
} from './touchSensor'

import {
  SensorHub,
} from './sensorHub'

import {
  DragEvent,
} from './dragEvent'

export interface DragEventManagerConfig {
  enableLongPress?: boolean,
  longPressWait?: number, // In seconds.

  parent?: HTMLElement | Window,

  onLongPress?: (event: DragEvent, manager: DragEventManager) => void,

  condition?: (event: DragEvent, manager: DragEventManager) => boolean,

  onDown?:   (event: DragEvent, manager: DragEventManager) => void,
  onDrag?:   (event: DragEvent, manager: DragEventManager) => void,
  onUp?:     (event: DragEvent, manager: DragEventManager) => void,
  onCancel?: (event: DragEvent, manager: DragEventManager) => void,
}

export const DRAG_EVENT_MANAGER_DEFAULT_CONFIG: DragEventManagerConfig = {
  enableLongPress: false,
  longPressWait: 2,

  parent: window,

  onLongPress: (event, manager) => {},

  onDown:   (event, manager) => {},
  onDrag:   (event, manager) => {},
  onUp:     (event, manager) => {},
  onCancel: (event, manager) => {},
}

export class DragEventManager {
  public config: DragEventManagerConfig

  public mouseSensor: MouseSensor
  public touchSensor: TouchSensor
  public sensorHub  : SensorHub

  public isActive: boolean = false

  constructor(config?: DragEventManagerConfig) {
    this.config = Object.assign({}, DRAG_EVENT_MANAGER_DEFAULT_CONFIG)
    if (typeof config === 'object') {
      this.config = Object.assign(this.config, config)
    }

    this.mouseSensor = new MouseSensor(this)
    this.touchSensor = new TouchSensor(this)
    this.sensorHub   = new SensorHub(this)

    this.initialize()
  }

  public initialize() {
    this.mouseSensor.listen()
    this.touchSensor.listen()
  }
}