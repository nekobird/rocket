import {
  MouseSensor,
} from './mouseSensor'

import {
  TouchSensor,
} from './touchSensor'

import {
  SensorHub,
} from './sensorHub'

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
  onLongPress?: () => void,
  onDown?: () => void,
  onDrag?: () => void,
  onUp?:   () => void,
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
  } 
}