import {
  MONO_TAP_DEFAULT_CONFIG,
  MonoTapConfig,
} from './config';

import {
  SensorHub,
} from './sensor-hub';

import {
  TapStory,
} from './tap-story';

export class MonoTap {
  public config: MonoTapConfig;

  public sensorHub: SensorHub;

  constructor(config: Partial<MonoTapConfig>) {
    this.config = {...MONO_TAP_DEFAULT_CONFIG};

    this.setConfig(config);

    this.sensorHub = new SensorHub(this);

    this.sensorHub.attach();
  }

  public setConfig(config: Partial<MonoTapConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }

  public get previousTapStory(): TapStory | null {
    const { previousTapStory } = this.sensorHub;

    if (typeof previousTapStory === 'undefined') {
      return null;
    }

    return previousTapStory;
  }

  public get history(): TapStory[] {
    return this.sensorHub.history;
  }

  public clearHistory() {
    this.sensorHub.history = [];
  }
}
