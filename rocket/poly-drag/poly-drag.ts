import {
  POLY_DRAG_DEFAULT_CONFIG,
  PolyDragConfig,
} from './config';

import {
  DragStory,
} from './drag-story';

import {
  SensorHub,
} from './sensor-hub';

export class PolyDrag {
  public config: PolyDragConfig;

  public sensorHub: SensorHub;

  constructor(config: Partial<PolyDragConfig>) {
    this.config = {...POLY_DRAG_DEFAULT_CONFIG};

    this.setConfig(config);

    this.sensorHub = new SensorHub(this);
  }

  public setConfig(config: Partial<PolyDragConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }
}