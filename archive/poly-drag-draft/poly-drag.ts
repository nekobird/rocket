import {
  Util,
} from '../rocket';

import {
  MouseSensor,
} from './mouse-sensor';

import {
  TouchSensor,
} from './touch-sensor';

import {
  SensorHub,
} from './sensor-hub';

import {
  PolyDragConfig,
  DRAG_EVENT_MANAGER_DEFAULT_CONFIG,
} from './config';

export class PolyDrag {
  public config: PolyDragConfig;

  public sensorHub: SensorHub;

  public mouseSensor: MouseSensor;
  public touchSensor: TouchSensor;

  public isActive: boolean = false;

  public isListeningToScroll: boolean = false;
  public isScrolling: boolean = false;
  public scrollDebounce?: Function;

  constructor(config?: Partial<PolyDragConfig>) {
    this.config = {...DRAG_EVENT_MANAGER_DEFAULT_CONFIG};

    this.setConfig(config);

    this.mouseSensor = new MouseSensor(this);
    this.touchSensor = new TouchSensor(this);

    this.sensorHub = new SensorHub(this);
  }

  public setConfig(config?: Partial<PolyDragConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

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

  private eventHandlerScroll = () => {
    this.isScrolling = true;
  }

  private eventHandlerScrollEnd = () => {
    this.isScrolling = false;
  }

  public listenToScroll() {
    if (this.isListeningToScroll === false) {
      const { scrollEndDebounceDelay } = this.config;

      this.scrollDebounce = Util.debounce(
        this.eventHandlerScrollEnd,
        scrollEndDebounceDelay
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
