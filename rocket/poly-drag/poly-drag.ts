import {
  POLY_DRAG_DEFAULT_CONFIG,
  PolyDragConfig,
} from './config';

import {
  PolyDragStory,
} from './poly-drag-story';

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

    this.sensorHub.attach();
  }

  public setConfig(config: Partial<PolyDragConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }

  public get activeDragStories(): DragStory[] {
    return this.sensorHub.activeDragStories;
  }

  public get history(): DragStory[] {
    return this.sensorHub.history;
  }

  public clearHistory(): this {
    this.sensorHub.history = [];

    return this;
  }

  public attach() {
    this.sensorHub.attach();
  }

  public detach() {
    this.sensorHub.detach();
  }
}