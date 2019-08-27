export interface MonoTapConfig {
  target?: HTMLElement;

  isValidTap: () => boolean;
}

export const MONO_TAP_DEFAULT_CONFIG = {

}

export class MonoTap {
  public config: MonoTapConfig;

  constructor(config: MonoTapConfig) {
    this.config = {...MONO_TAP_DEFAULT_CONFIG};

    this.setConfig(config);
  }

  public setConfig(config: MonoTapConfig): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }

  public tapStart() {
  }

  public tapUp() {

  }
}