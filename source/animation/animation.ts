import {
  AnimationConfig,
  DEFAULT_ANIMATION_CONFIG,
} from './animation-config';

import {
  AnimationCore,
  AnimationState,
} from './animation-core';

export class Animation {
  public config: AnimationConfig;

  public core: AnimationCore;

  constructor(config?: Partial<AnimationConfig>) {
    this.config = {...DEFAULT_ANIMATION_CONFIG};

    this.config.dataExport = {};

    this.setConfig(config);

    this.core = new AnimationCore(this);

    return this;
  }

  public setConfig(config?: Partial<AnimationConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }

  public get state(): AnimationState {
    return this.core.state;
  }

  public get isActive(): boolean {
    return this.core.isActive;
  }

  public get isAnimating(): boolean {
    return this.core.isAnimating;
  }

  public get isPaused(): boolean {
    return this.core.isPaused;
  }

  public get iterationCount(): number {
    return this.iterationCount;
  }

  public jumpTo(to: number): this {
    if (this.core.isActive === true) {
      this.core.setProgressTimeOffsetFromProgressTarget(to);
    }
    
    if (this.core.isActive === false) {
      this.core.inactiveTick(to);
    }

    return this;
  }

  public play(delay?: number): Promise<void> {
    if (this.core.isPaused === true) {
      this.core.continueAnimation();

      return Promise.resolve();
    } else {
      return new Promise(resolve => {
        this.core.callback = () => resolve();

        this.core.start(delay);
      });
    }
  }

  public pause(): this {
    if (this.core.isActive === true) {
      this.core.pause();
    }

    return this;
  }

  public stop(): this {
    if (this.core.isActive === true) {
      this.core.end();
    }

    return this;
  }
}
