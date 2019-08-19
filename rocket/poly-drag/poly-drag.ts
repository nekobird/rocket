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

  public isActive: boolean = false;

  public activeDragStories: DragStory[];

  constructor(config: Partial<PolyDragConfig>) {
    this.config = {...POLY_DRAG_DEFAULT_CONFIG};

    this.setConfig(config);

    this.sensorHub = new SensorHub(this);
  }

  public setConfig(config: Partial<PolyDragConfig>) {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }
  }

  public addStory() {
    this.activeDragStories.push(new DragStory(this));
  }
}