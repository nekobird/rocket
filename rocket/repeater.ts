export interface RepeaterConfig {
  useAnimationFrame: boolean;
  timeout: boolean;
  timeoutDelay: number;
  frequency: number;
  condition: (context: Repeater) => boolean;
  onRepeat: (context: Repeater) => void;
  onStart: (context: Repeater) => void;
  onEnd: (context: Repeater) => void;
}

const REPEATER_DEFAULT_CONFIG: RepeaterConfig = {
  useAnimationFrame: true,
  timeout: true,
  timeoutDelay: 10,
  frequency: 24,
  condition: () => true,
  onRepeat: () => { },
  onStart: () => { },
  onEnd: () => { },
};

export class Repeater {
  public config: RepeaterConfig;

  public duration?: number;
  public startTime?: number;
  public endTime?: number;

  public intervalId: number = 0;
  public timeoutId: number = 0;
  public animationFrameId: number = 0;

  public isActive: boolean = false;
  public count: number = 0;

  constructor(config?: Partial<RepeaterConfig>) {
    this.config = Object.assign({}, REPEATER_DEFAULT_CONFIG);
    if (typeof config === 'object')
      this.setConfig(config);
  }

  public setConfig(config?: Partial<RepeaterConfig>) {
    Object.assign(this.config, config);
  }

  public startTimeout() {
    this.timeoutId = setTimeout(
      () => this.stop(),
      1000 * this.config.timeoutDelay
    );
  }

  public resetTimeout() {
    clearTimeout(this.timeoutId);
    this.startTimeout();
  }

  private onRepeat() {
    this.count++;
    if (this.config.useAnimationFrame === true) {
      this.animationFrameId = window.requestAnimationFrame(
        () => this.config.onRepeat(this)
      );
    } else {
      this.config.onRepeat(this);
    }
  }

  public forceStart() {
    if (this.isActive === true) this.stop();
    this.start();
  }

  public start() {
    if (
      this.isActive === false
      && this.config.condition(this) === true
    ) {
      this.isActive = true;
      this.count = 0;
      this.startTime = Date.now();
      this.config.onStart(this);
      this.intervalId = setInterval(
        () => this.onRepeat(),
        1000 / this.config.frequency
      );
      if (
        this.config.timeout === true
        && typeof this.config.timeoutDelay === 'number'
        && this.config.timeoutDelay > 0
      ) this.startTimeout();
    }
  }

  public stop() {
    if (this.isActive === true) {
      cancelAnimationFrame(this.animationFrameId);
      clearTimeout(this.timeoutId);
      clearInterval(this.intervalId);
      this.endTime = Date.now();
      if (typeof this.startTime === 'number')
        this.duration = this.endTime - this.startTime;
      this.isActive = false;
      this.config.onEnd(this);
    }
  }
}
