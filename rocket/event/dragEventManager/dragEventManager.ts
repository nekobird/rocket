import {
  MouseSensor,
} from './mouseSensor'

import {
  TouchSensor,
} from './touchSensor'

import {
  EventName, 
  SensorHub,
} from './sensorHub'

import {
  DragEvent,
} from './dragEvent'

export interface DragEventManagerConfig {
  isLongPressEnabled?: boolean,
  longPressWait?: number, // In seconds.

  onLongPress?: (event: DragEvent, manager: DragEventManager) => void,

  onDown?: (event: DragEvent, manager: DragEventManager) => void,
  onDrag?: (event: DragEvent, manager: DragEventManager) => void,
  onUp?:   (event: DragEvent, manager: DragEventManager) => void,
}

export const DRAG_EVENT_MANAGER_DEFAULT_CONFIG: DragEventManagerConfig = {
  isLongPressEnabled: false,
  longPressWait: 2,

  onLongPress: (event, manager) => {},
  onDrag:      (event, manager) => {},
  onUp:        (event, manager) => {}
}

export class DragEventManager {
  public config: DragEventManagerConfig

  public mouseSensor: MouseSensor
  public touchSensor: TouchSensor
  public sensorHub  : SensorHub

  constructor() {
    this.mouseSensor = new MouseSensor(this)
    this.touchSensor = new TouchSensor(this)
    this.sensorHub   = new SensorHub(this)
  }

  public initialize() {
    this.mouseSensor.listen()
    this.touchSensor.listen()
  }
}