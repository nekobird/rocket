import {
  Animation
} from '../rocket'

export interface AnimationTimingFunction {
  (t: number): number
}

export interface AnimationTickFunction {
  (n: number, iterationCount:number, context: Animation, data: any): void
}

export interface AnimationBeforeHook<T=void> {
  (context: Animation, data: any): Promise<T>
}

export interface AnimationCallback {
  (context: Animation, data: any): void
}

export interface AnimationConfig {
  alternate?: boolean,
  delay?: number,
  duration?: number,

  iterationDelay?: number,
  numberOfIterations?: number | 'infinite',

  dataExport?: object,

  timingFunction?: AnimationTimingFunction,

  beforeStart?: AnimationBeforeHook,
  beforeStartWithDelay?: AnimationBeforeHook,
  beforeIterationStart?: AnimationBeforeHook,
  beforeSubsequentIteration?: AnimationBeforeHook,

  onStart?: AnimationCallback | AnimationCallback[],
  onComplete?: AnimationCallback | AnimationCallback[],

  onIterationStart?: AnimationCallback | AnimationCallback[],
  onIterationComplete?: AnimationCallback | AnimationCallback[],

  callback?: Function,

  onTick?: AnimationTickFunction | AnimationTickFunction[],
}

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  alternate: false,
  delay: 0,
  duration: 0.4,

  iterationDelay: 0,
  numberOfIterations: 1,

  dataExport: undefined,

  timingFunction: (t) => { return t },

  beforeStart: () => { return Promise.resolve() },
  beforeStartWithDelay: () => { return Promise.resolve() },
  beforeIterationStart: () => { return Promise.resolve() },
  beforeSubsequentIteration: () => { return Promise.resolve() },

  onStart   : () => { },
  onComplete: () => { },

  onIterationStart   : () => { },
  onIterationComplete: () => { },

  callback: () => { },

  onTick  : (n, fn, data) => { }
}