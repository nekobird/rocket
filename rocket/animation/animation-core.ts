import {
  Num,
} from '../rocket';

import {
  Animation,
} from './animation';

export type AnimationState = 'READY' | 'INITIAL' | 'BETWEEN' | 'ANIMATING' | 'PAUSED';

export class AnimationCore {
  public animation: Animation;

  public isActive: boolean = false;
  public isAnimating: boolean = false;
  public isPaused: boolean = false;

  public state: AnimationState = 'READY';

  public currentDirection: 1 | -1 = 1;

  public iterationCount: number = 0;

  private progress: number = 0;
  private progressTimeOffset: number = 0;

  private startTime: number = 0;
  private endTime: number = 0;
  private pauseTime: number = 0;

  private animationFrameId?: number;
  private startTimeoutId?: number;
  private iterationTimeoutId?: number;

  public callback?: Function;

  constructor(animation: Animation) {
    this.animation = animation;
  }

  private getTimeInMilliseconds(time: number) {
    const { config } = this.animation;

    if (config.timeUnit === 's') {
      return time * 1000;
    }

    return time;
  }

  public async start(delay?: number): Promise<void> {
    if (
      this.isActive === false
      && this.isAnimating === false
      && this.isPaused === false
    ) {
      const { config } = this.animation;

      this.state = 'INITIAL';

      this.isActive = true;

      if (typeof delay !== 'number') {
        delay = 0;

        if (typeof config.delay === 'number') {
          delay = config.delay;
        }
      }

      if (delay > 0) {
        try {
          await config.beforeStart(this.animation, config.dataExport);

          await config.beforeStartWithDelay(this.animation, config.dataExport);

          this.startTimeoutId = setTimeout(this.begin, this.getTimeInMilliseconds(delay));

          return Promise.resolve();
        } catch (error) {
          this.end();

          return Promise.reject(error);
        }
      } else {
        try {
          await config.beforeStart(this.animation, config.dataExport);

          this.begin();

          return Promise.resolve();
        } catch (error) {
          this.end();

          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(
      new Error('@nekobird/rocket: Animation.core.start: Animation is already active.'),
    );
  }

  private begin = () => {
    if (
      this.isActive === true
      && this.isAnimating === false
      && this.isPaused === false
    ) {
      this.setStartingDirection();

      this.runCallbacks('onStart');

      this.startIteration();
    }
  };

  private setStartingDirection() {
    const { config } = this.animation;

    this.currentDirection = config.direction;
  }

  private async startIteration() {
    const { config } = this.animation;

    try {
      await config.beforeIterationStart(this.animation, config.dataExport);

      this.state = 'BETWEEN';

      this.runCallbacks('onIterationStart');

      this.prepareIteration();

      this.continueLoop();

      return Promise.resolve();
    } catch (error) {
      this.end();

      return Promise.reject(error);
    }
  }

  private prepareIteration(): this {
    const { config } = this.animation;

    this.progress = 0;
    this.progressTimeOffset = 0;

    this.startTime = Date.now();
    this.endTime = this.startTime + this.getTimeInMilliseconds(config.duration);

    return this;
  }

  private continueLoop(): this {
    if (this.isActive === true) {
      if (typeof this.animationFrameId === 'number') {
        window.cancelAnimationFrame(this.animationFrameId);
      }

      this.state = 'ANIMATING';

      this.isAnimating = true;

      this.animationFrameId = window.requestAnimationFrame(this.loop);
    }

    return this;
  }

  public loop = () => {
    if (
      this.isActive === true
      && this.isAnimating === true
      && this.isPaused === false
    ) {
      // Progress always starts from 0
      // regardless of direction.
      if (this.progress < 1) {
        this.tick();

        this.continueLoop();
      } else {
        this.completeIteration();
      }
    }
  };

  public completeIteration() {
    const { config } = this.animation;

    this.state = 'BETWEEN';

    this.isAnimating = false;

    this.iterationCount++;

    this.runCallbacks('onIterationComplete');

    // Complete animation if iterationCount exceeds numberOfIterations.
    if (
      typeof config.numberOfIterations === 'number'
      && this.iterationCount >= config.numberOfIterations
    ) {
      this.complete();
    } else {
      this.continueIteration();
    }
  }

  public async continueIteration() {
    const { config } = this.animation;

    try {
      await config.beforeSubsequentIteration(this.animation, config.dataExport);

      this.iterationTimeoutId = setTimeout(
        () => {
          if (config.alternate === true) {
            this.toggleCurrentDirection();
          }

          this.startIteration();
        },
        this.getTimeInMilliseconds(config.iterationDelay)
      );
    } catch (error) {
      this.end();

      return Promise.reject(error);
    }
  }

  public pause(): this {
    if (
      this.isActive === true
      && this.isPaused === false
    ) {
      this.clearTimeoutsAndAnimationFrames();

      this.state = 'PAUSED';

      this.isAnimating = false;
      this.isPaused = true;

      this.pauseTime = Date.now();

      this.runCallbacks('onPause');
    }

    return this;
  }

  public continueAnimation = () => {
    if (
      this.isActive === true
      && this.isPaused === true
    ) {
      const startTimeDelta = this.pauseTime - this.startTime;
      const endTimeDelta = this.endTime - this.pauseTime;

      const now = Date.now();

      this.startTime = now - startTimeDelta;
      this.endTime = now + endTimeDelta;

      this.state = 'BETWEEN';

      this.isPaused = false;

      this.runCallbacks('onContinue');

      this.continueLoop();
    }
  };

  public reset(): this {
    this.clearTimeoutsAndAnimationFrames();

    this.isActive = this.isAnimating = this.isPaused = false;

    this.currentDirection = this.animation.config.direction;

    this.iterationCount = 0;

    this.startTime = this.endTime = this.pauseTime = 0;

    this.progress = 0;

    this.state = 'READY';

    return this;
  }

  public complete(): this {
    this.reset();

    if (this.isActive === true) {
      this.runCallbacks('onComplete');

      this.end();
    }

    return this;
  }

  public end(): this {
    this.reset();

    if (this.isActive === true) {
      this.runCallbacks('onEnd');

      this.animation.config.callback();

      if (typeof this.callback === 'function') {
        this.callback();
      }
    }

    return this;
  }

  public tick(): this {
    if (this.isActive === true && this.isAnimating === true) {
      const { config } = this.animation;

      this.progress = this.getCurrentProgress();

      let n = config.timingFunction(this.progress);

      if (this.currentDirection === -1) {
        n = 1 - n;
      }

      this.callOnTick(n);
    }

    return this;
  }

  public inactiveTick(to: number): this {
    if (this.isActive === false) {
      const { config } = this.animation;

      let n = Num.constrain(to, 1);

      if (config.direction === -1) {
        n = 1 - n;
      }

      this.callOnTick(n);
    }

    return this;
  }

  public callOnTick(n: number): this {
    const { config } = this.animation;

    if (typeof config.onTick === 'function') {
      config.onTick(n, this.iterationCount, this.animation, config.dataExport);
    } else if (Array.isArray(config.onTick) === true) {
      config.onTick.forEach(tick => {
        tick(n, this.iterationCount, this.animation, config.dataExport);
      });
    }

    return this;
  }

  private getCurrentProgress(): number {
    return Num.transform(
      Date.now() + this.progressTimeOffset,
      [this.startTime, this.endTime],
      1,
      true
    );
  }

  // TODO: Rename this to something better.
  public setProgressTimeOffsetFromProgressTarget(target: number) {
    let offset = this.getCurrentProgress() - target;

    let sign = Num.getSign(offset) * -1;

    let timeOffset = Num.transform(
      Math.abs(offset),
      1,
      [this.startTime, this.endTime],
      true
    );

    this.progressTimeOffset += (timeOffset - this.startTime) * sign;
  }

  private toggleCurrentDirection(): this {
    this.currentDirection *= -1;

    return this;
  }

  public clearTimeoutsAndAnimationFrames(): this {
    if (typeof this.startTimeoutId === 'number') {
      clearTimeout(this.startTimeoutId);
    }

    if (typeof this.iterationTimeoutId === 'number') {
      clearTimeout(this.iterationTimeoutId);
    }

    if (typeof this.animationFrameId === 'number') {
      window.cancelAnimationFrame(this.animationFrameId);
    }

    return this;
  }

  public runCallbacks(name: string): this {
    const { config } = this.animation;

    if (typeof config[name] === 'function') {
      config[name](this.animation, config.dataExport);
    } else if (Array.isArray(config[name]) === true) {
      config[name].forEach(callback => {
        if (typeof callback === 'function') {
          callback(this.animation, config.dataExport);
        }
      });
    }

    return this;
  }
}
