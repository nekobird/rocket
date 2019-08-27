import  {
  DOMUtil,
  Vector2,
} from '../rocket';

import {
  MONO_DRAG_DEFAULT_CONFIG,
  MonoDragConfig,
} from './config';

import {
  MonoDragEvent,
} from './mono-drag-event';

import {
  SensorHub,
} from './sensor-hub';

export class MonoDrag {
  public config: MonoDragConfig;

  public sensorHub: SensorHub;

  constructor(config?: Partial<MonoDragConfig>) {
    this.config = {...MONO_DRAG_DEFAULT_CONFIG};

    this.setConfig(config);

    this.sensorHub = new SensorHub(this);
  }

  public setConfig(config?: Partial<MonoDragConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }
}
