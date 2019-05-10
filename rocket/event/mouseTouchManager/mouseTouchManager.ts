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
  MouseTouchEvent,
} from './mouseTouchEvent'

// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent

// isLongPressEnabled
// longPressWait
// onDown
// onDrag
// onMove
// onLongPress
// onUp

export interface MouseTouchManagerConfig {
  isLongPressEnabled?: boolean,
  longPressWait?: number, // In seconds.
  onLongPress?: (event: MouseTouchEvent, manager: MouseTouchManager) => void,
  onDown?: (event: MouseTouchEvent, manager: MouseTouchManager) => void,
  onDrag?: (event: MouseTouchEvent, manager: MouseTouchManager) => void,
  onUp?:   (event: MouseTouchEvent, manager: MouseTouchManager) => void,
}

const MOUSETOUCHMANAGER_DEFAULT_CONFIG: MouseTouchManagerConfig = {
  isLongPressEnabled: true,
  longPressWait: 2,
}

export class MouseTouchManager {
  public config: MouseTouchManagerConfig

  public mouseSensor: MouseSensor
  public touchSensor: TouchSensor
  public sensorHub: SensorHub

  constructor() {
    this.mouseSensor = new MouseSensor(this)
    this.touchSensor = new TouchSensor(this)
    this.sensorHub   = new SensorHub(this)
  }

  public initialize() {
    this.mouseSensor.listen()
    this.touchSensor.listen()
  }

  public receive(name: EventName, event: MouseTouchEvent) {

  }
}