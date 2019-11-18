declare class Animation {};

export interface AnimationTimingFunction {
  (t: number): number;
}

export interface AnimationTickFunction<T = void> {
  (n: number, iterationCount: number, animation: Animation, data: any): Promise<T> | void;
}

export interface AnimationBeforeCallback<T = void> {
  (animation: Animation, data: any): Promise<T> | void;
}

export interface AnimationCallback {
  (animation: Animation, data: any): void;
}

export interface AnimationConfig {
  timeUnit: 's' | 'ms';

  alternate: boolean;

  delay: number;

  iterationDelay: number;

  duration: number;

  direction: 1 | -1;

  numberOfIterations: number | 'infinite';

  dataExport: object;

  timingFunction: AnimationTimingFunction;

  onTick: AnimationTickFunction | AnimationTickFunction[];

  beforeStart: AnimationBeforeCallback;

  beforeStartWithDelay: AnimationBeforeCallback;

  onStart: AnimationCallback | AnimationCallback[];

  beforeIterationStart: AnimationBeforeCallback;

  beforeSubsequentIteration: AnimationBeforeCallback;

  onIterationStart: AnimationCallback | AnimationCallback[];

  onIterationComplete: AnimationCallback | AnimationCallback[];

  onPause: AnimationCallback | AnimationCallback[];

  onContinue: AnimationCallback | AnimationCallback[];

  onComplete: AnimationCallback | AnimationCallback[];

  onEnd: AnimationCallback | AnimationCallback[];

  callback: Function;
}

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  timeUnit: 's',

  alternate: false,

  delay: 0,

  iterationDelay: 0,

  duration: 0.4,

  direction: 1,

  numberOfIterations: 1,

  dataExport: {},

  timingFunction: t => t,

  onTick: (n, fn, data) => {},

  beforeStart: () => Promise.resolve(),

  beforeStartWithDelay: () => Promise.resolve(),

  onStart: () => {},

  beforeIterationStart: () => Promise.resolve(),

  onIterationStart: () => {},

  onIterationComplete: () => {},

  beforeSubsequentIteration: () => Promise.resolve(),

  onPause: () => {},

  onContinue: () => {},

  onComplete: () => {},

  onEnd: () => {},

  callback: () => {},
};
