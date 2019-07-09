import {
  AnimationConfig,
  DEFAULT_ANIMATION_CONFIG,
} from './animationConfig';

import {
  AnimationCore,
} from './animationCore';

export class Animation {

  public config: AnimationConfig;
  public core: AnimationCore;

  constructor(config?: Partial<AnimationConfig>) {
    this.config = Object.assign({}, DEFAULT_ANIMATION_CONFIG);
    this.config.dataExport = {};
    if (typeof config === 'object') this.setConfig(config);
    this.core = new AnimationCore(this);
    return this;
  }

  public setConfig(config: Partial<AnimationConfig>): this {
    Object.assign(this.config, config);
    return this;
  }

  public play(delay?: number): Promise<void> {
    return new Promise(resolve => {
      this.core.callback = () => resolve();
      this.core.startWithDelay(delay);
    });
  }

  public stop(): this {
    this.core.end();
    return this;
  }

  public pause(): this {
    this.core.pause();
    return this;
  }

  public goToBeginning(): this {
    if (typeof this.config.onTick === 'function') {
      this.config.onTick(0, this.core.iterationCount, this, undefined);
    } else if (Array.isArray(this.config.onTick)) {
      this.config.onTick.forEach(tick => {
        tick(0, this.core.iterationCount, this, this.config.dataExport);
      });
    }
    return this;
  }

  public goToEnd(): this {
    let iterationCount = this.core.iterationCount;
    if (typeof this.config.numberOfIterations === 'number')
      iterationCount = this.config.numberOfIterations;
    if (typeof this.config.onTick === 'function') {
      this.config.onTick(1, iterationCount, this, undefined);
    } else if (Array.isArray(this.config.onTick)) {
      this.config.onTick.forEach(tick => {
        tick(1, iterationCount, this, this.config.dataExport);
      });
    }
    return this;
  }

  public stopAndJumptToEnd(): this {
    this.core.end();
    this.goToEnd();
    return this;
  }

  public stopAndJumpToBeginning(): this {
    this.core.end();
    this.goToEnd();
    return this;
  }
}
