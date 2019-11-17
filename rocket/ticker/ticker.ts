import {
  TICKER_DEFAULT_CONFIG,
  TickerConfig,
} from './config';

export class Ticker {
  public config: TickerConfig;

  public isActive: boolean = false;
  public timeStart: number = 0;
  public timeEnd: number = 0;

  private progressTimeStart: number = 0;
  public progress: number = 0;

  public progressIterationCount: number = 0;
  public tickCount: number = 0;

  public callback?: Function;
  private requestAnimationFrameId: number | null = null;

  constructor(config: Partial<TickerConfig>) {
    this.config = {...TICKER_DEFAULT_CONFIG};

    this.setConfig(config);
  }

  public setConfig(config: Partial<TickerConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }

  public start() {
    if (this.isActive === false) {
      this.isActive = true;

      this.timeStart = Date.now();
      this.progressTimeStart = this.timeStart;

      this.config.onStart(this);

      this.continueLoop();
    }
  }

  public stop() {
    if (this.isActive === true) {
      if (typeof this.requestAnimationFrameId === 'number') {
        window.cancelAnimationFrame(this.requestAnimationFrameId);
        this.requestAnimationFrameId = null;
      }

      this.timeEnd = Date.now();

      this.progress = 0;
      this.progressIterationCount = 0;

      this.tickCount = 0;
      this.isActive = false;

      this.config.onComplete(this);
    }
  }

  private loop = () => {
    if (this.isActive === true) {
      this.updateProgress();

      const t = this.config.timingFunction(this.progress);

      const data: [number, number, number] = [t, this.progressIterationCount, this.tickCount];

      this.config.onTick(data, this);

      this.tickCount++;

      if (this.progress < 1) {
        this.continueLoop();
      } else {
        if (this.config.loopForever) {
          this.progress = 0;
          this.progressIterationCount++;
          this.progressTimeStart = Date.now();

          this.continueLoop();
        } else {
          this.stop();
        }
      }
    }
  }

  private continueLoop() {
    if (this.isActive) {
      if (typeof this.requestAnimationFrameId === 'number') {
        window.cancelAnimationFrame(this.requestAnimationFrameId);
      }

      this.requestAnimationFrameId = window.requestAnimationFrame(this.loop);
    }
  }

  private updateProgress() {
    let progress = 1;

    const durationInMilliseconds = this.config.durationInSeconds * 1000;

    if (durationInMilliseconds) {
      const value = (Date.now() - this.progressTimeStart) / durationInMilliseconds;

      if (value < 1) {
        progress = value;
      }
    }

    this.progress = progress;
  }
}
