import {
  TICKER_DEFAULT_CONFIG,
  TickerConfig,
} from './config';

export class Ticker {
  public config: TickerConfig;

  public isActive: boolean = false;

  public timeStart: number = 0;
  public timeEnd: number = 0;

  public progress: number = 0;

  public count: number = 0;

  public callback?: Function;

  private requestAnimationFrameId?: number;

  constructor(config: Partial<TickerConfig>) {
    this.config = {...TICKER_DEFAULT_CONFIG};

    this.setConfig(config);
  }

  public setConfig(config: Partial<TickerConfig>) {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }
  }

  public play() {
    if (this.isActive === false) {
      this.isActive = true;

      this.timeStart = Date.now();

      this.config.onStart(this);

      this.continueLoop();
    }
  }

  public stop() {
    if (this.isActive === true) {
      if (typeof this.requestAnimationFrameId === 'number') {
        window.cancelAnimationFrame(this.requestAnimationFrameId);

        this.requestAnimationFrameId = undefined
      }

      this.timeEnd = Date.now();

      this.progress = 0;

      this.count = 0;

      this.isActive = false;

      this.config.onComplete(this);
    }
  }

  private loop = () => {
    if (this.isActive === true) {
      this.updateProgress();

      const n = this.config.timingFunction(this.progress);

      this.config.onTick(n, this.count, this);

      this.count++;

      if (this.progress < 1) {
        this.continueLoop();
      } else {
        this.stop();
      }
    }
  }

  private continueLoop() {
    if (this.isActive === true) {
      if (typeof this.requestAnimationFrameId === 'number') {
        window.cancelAnimationFrame(this.requestAnimationFrameId);
      }

      this.requestAnimationFrameId = window.requestAnimationFrame(this.loop);
    }
  }

  private updateProgress() {
    const { durationInSeconds, isForever } = this.config;

    if (isForever === true) {
      this.progress = 0;
    } else {
      const now = Date.now();

      const durationInMilliseconds = durationInSeconds * 1000;

      this.progress = (now - this.timeStart) / durationInMilliseconds;

      if (this.progress > 1) {
        this.progress = 1;
      }
    }
  }
}