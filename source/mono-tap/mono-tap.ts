import {
  MONO_TAP_DEFAULT_CONFIG,
  MonoTapConfig,
} from './config';

import {
  SensorHub,
} from './sensor-hub';

import {
  MonoTapStory,
} from './mono-tap-story';

export class MonoTap {
  public config: MonoTapConfig;

  public isActive: boolean = false;

  public sensorHub: SensorHub;

  constructor(config: Partial<MonoTapConfig>) {
    this.config = {...MONO_TAP_DEFAULT_CONFIG};

    this.setConfig(config);

    this.sensorHub = new SensorHub(this);

    this.listen();
  }

  public setConfig(config: Partial<MonoTapConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }

  public listen(): this {
    if (this.isActive === false) {
      this.sensorHub.attach();

      this.isActive = true;
    }

    return this;
  }

  public stop(): this {
    if (this.isActive === true) {
      this.sensorHub.detach();

      this.isActive = false;
    }

    return this;
  }

  public get previousStory(): MonoTapStory | null {
    const { previousStory } = this.sensorHub;

    if (typeof previousStory === 'undefined') {
      return null;
    }

    return previousStory;
  }

  public get history(): MonoTapStory[] {
    return this.sensorHub.history;
  }

  public clearHistory(): this {
    this.sensorHub.history = [];

    return this;
  }
}
