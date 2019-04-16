import {
  AnimationTimingFunction,
  AnimationTickFunction,
} from './index'

export interface AnimationConfig {
  alternate?: boolean,
  delay?: number,
  duration?: number,
  exports?: any,

  numberOfIterations?: number | 'infinite',

  timingFunction?: AnimationTimingFunction,

  onStart?: Function | Function[],
  onComplete?: Function | Function[],

  onIterationStart?: Function | Function[],
  onIterationComplete?: Function | Function[],

  onTick?: AnimationTickFunction | AnimationTickFunction[],

  callback?: Function,
}