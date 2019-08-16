import {
  REPEATER_DEFAULT_CONFIG,
  RepeaterConfig,
} from './config';

export class Repeater {
  public config: RepeaterConfig;

  public isActive: boolean = false;

  public duration?: number;

  public startTime?: number;
  public endTime?: number;

  public intervalId: number = 0;
  public timeoutId: number = 0;

  public count: number = 0;

  constructor(config?: Partial<RepeaterConfig>) {
    this.config = {...REPEATER_DEFAULT_CONFIG};

    this.setConfig(config);
  }

  public setConfig(config?: Partial<RepeaterConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }

  public startTimeout(): this {
    const { timeoutDelay } = this.config;

    this.timeoutId = setTimeout(
      () => this.stop(),
      timeoutDelay * 1000
    );

    return this;
  }

  public resetTimeout(): this {
    clearTimeout(this.timeoutId);

    this.startTimeout();

    return this;
  }

  private onRepeat(): this {
    this.count++;

    this.config.onRepeat(this);

    return this;
  }

  public forceStart(): this {
    if (this.isActive === true) {
      this.stop();
    }

    this.start();

    return this;
  }

  public start(): this {
    if (
      this.isActive === false
      && this.config.condition(this) === true
    ) {
      this.isActive = true;

      this.count = 0;

      this.startTime = Date.now();

      this.config.onStart(this);

      const { enableTimeout, timeoutDelay, frequency } = this.config;

      this.intervalId = setInterval(
        () => this.onRepeat(),
        1000 / frequency
      );

      if (
        enableTimeout === true
        && typeof timeoutDelay === 'number'
        && timeoutDelay > 0
      ) {
        this.startTimeout();
      }
    }

    return this;
  }

  public stop(): this {
    if (this.isActive === true) {
      clearTimeout(this.timeoutId);

      clearInterval(this.intervalId);

      this.endTime = Date.now();

      if (typeof this.startTime === 'number') {
        this.duration = this.endTime - this.startTime;
      }

      this.isActive = false;

      this.config.onEnd(this);
    }

    return this;
  }
}
