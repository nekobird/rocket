import {
  Animation
} from '../rocket'

export interface AnimationTimingFunction {
  (t: number): number
}

export interface AnimationTickFunction {
  (n: number, context: Animation, data?: any): void
}

export interface BeforeHook<T=void> {
  (context: Animation, data?: any): Promise<T>
}

export interface AnimationConfig {
  alternate?: boolean,
  delay?: number,
  duration?: number,

  iterationDelay?: number,
  numberOfIterations?: number | 'infinite',

  dataExport?: object,

  timingFunction?: AnimationTimingFunction,

  beforeStart?: BeforeHook | BeforeHook[],

  onStart?: Function | Function[],
  onComplete?: Function | Function[],

  onIterationStart?: Function | Function[],
  onIterationComplete?: Function | Function[],

  callback?: Function,
  onTick?: AnimationTickFunction | AnimationTickFunction[],
}

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  alternate: false,
  delay: 0,
  duration: 2,

  iterationDelay: 0,
  numberOfIterations: 1,

  dataExport: undefined,

  timingFunction: (t) => {
    return t
  },

  onStart   : () => { },
  onComplete: () => { },

  onIterationStart   : () => { },
  onIterationComplete: () => { },

  callback: () => { },
  onTick  : (n, fn, data) => { }
}