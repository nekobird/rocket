import {
  Repeater,
  Util,
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

export type EventTypes = 'TOUCH' | 'MOUSE';

export interface DragEventManagerConfig {
  scrollEndDebounceDelay: number;
  leftMouseButtonOnly: boolean;

  parent: HTMLElement | Window;

  listenTo: EventTypes[];

  enableDownRepeater: boolean;
  downRepeaterFrequency: number;
  beforeDownRepeatStart: (repeater: Repeater, event: DragEvent, manager: DragEventManager) => void;
  onDownRepeatStart: (repeater: Repeater, event: DragEvent, manager: DragEventManager) => void;
  onDownRepeat: (repeater: Repeater, event: DragEvent, manager: DragEventManager) => void;
  onDownRepeatEnd: (repeater: Repeater, event: DragEvent, manager: DragEventManager) => void;

  enableLongPress: boolean;
  longPressWait:   number; // In seconds.
  longPressCondition: (event: DragEvent, manager: DragEventManager) => boolean;
  onLongPress: (event: DragEvent, manager: DragEventManager) => void;

  condition: (event: DragEvent, manager: DragEventManager) => boolean;
  onDown: (event: DragEvent, manager: DragEventManager) => void;
  onDrag: (event: DragEvent, manager: DragEventManager) => void;
  onUp: (event: DragEvent, manager: DragEventManager) => void;
  onCancel: (event: DragEvent, manager: DragEventManager) => void;
}

export const DRAG_EVENT_MANAGER_DEFAULT_CONFIG: DragEventManagerConfig = {
  scrollEndDebounceDelay: 0.3,
  leftMouseButtonOnly: true,

  parent: window,

  listenTo: ['TOUCH', 'MOUSE'],

  enableDownRepeater: false,
  downRepeaterFrequency: 60,
  beforeDownRepeatStart: () => {},
  onDownRepeatStart: () => {},
  onDownRepeat: () => {},
  onDownRepeatEnd: () => {},

  enableLongPress: false,
  longPressWait: 2,
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

  public isListeningToScroll: boolean = false;
  public scrollDebounce?: Function;
  public isScrolling: boolean = false;

  constructor(config?: Partial<DragEventManagerConfig>) {
    this.config = Object.assign({}, DRAG_EVENT_MANAGER_DEFAULT_CONFIG);
    this.setConfig(config);
    this.mouseSensor = new MouseSensor(this);
    this.touchSensor = new TouchSensor(this);
    this.sensorHub   = new SensorHub(this);
  }

  public setConfig(config?: Partial<DragEventManagerConfig>): this {
    if (typeof config === 'object') Object.assign(this.config, config);
    return this;
  }

  public initialize(): this {
    this.stopListenToScroll();
    this.mouseSensor.stop();
    this.touchSensor.stop();

    this.listenToScroll();
    this.mouseSensor.listen();
    this.touchSensor.listen();
    return this;
  }

  public eventHandlerScroll = () => this.isScrolling = true;

  public eventHandlerScrollEnd = () => this.isScrolling = false;

  public listenToScroll() {
    if (this.isListeningToScroll === false) {
      this.scrollDebounce = Util.debounce(
        this.config.scrollEndDebounceDelay,
        this.eventHandlerScrollEnd,
      );
      document.body.addEventListener('touchmove', this.eventHandlerScroll);
      document.body.addEventListener('touchmove', this.scrollDebounce as EventListener);
      window.addEventListener('scroll', this.eventHandlerScroll);
      window.addEventListener('scroll', this.scrollDebounce as EventListener);
      this.isListeningToScroll = true;
    }
  }

  public stopListenToScroll() {
    if (this.isListeningToScroll === true) {
      document.body.addEventListener('touchmove', this.eventHandlerScroll);
      document.body.addEventListener('touchmove', this.eventHandlerScrollEnd as EventListener);
      window.removeEventListener('scroll', this.eventHandlerScroll);
      window.removeEventListener('scroll', this.eventHandlerScrollEnd as EventListener);
      this.isListeningToScroll = false;
    }
  }
}
