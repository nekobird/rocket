import {
  MONO_DRAG_DEFAULT_CONFIG,
  MonoDragConfig,
} from './config';

import {
  SensorHub,
} from './sensor-hub';

import {
  MonoDragStory
} from './mono-drag-story';

export class MonoDrag {
  public config: MonoDragConfig;

  public sensorHub: SensorHub;

  constructor(config?: Partial<MonoDragConfig>) {
    this.config = {...MONO_DRAG_DEFAULT_CONFIG};

    this.setConfig(config);

    this.sensorHub = new SensorHub(this);

    this.sensorHub.listen();
  }

  public setConfig(config?: Partial<MonoDragConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }

  public listen() {
    this.sensorHub.listen();
  }

  public stopListening() {
    this.sensorHub.stopListening();
  }

  public get history(): MonoDragStory[] {
    return this.sensorHub.history;
  }

  public get activeStory(): MonoDragStory | null {
    return this.sensorHub.activeStory;
  }

  public get currentStory(): MonoDragStory | null {
    return this.sensorHub.currentStory;
  }

  public get previousStory(): MonoDragStory | null {
    return this.sensorHub.previousStory;
  }
}
