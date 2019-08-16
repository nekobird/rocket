import {
  Repeater,
} from './repeater';

export interface RepeaterConfig {
  useAnimationFrame: boolean;

  timeUnit: 's' | 'ms',

  enableTimeout: boolean;

  timeoutDelay: number;

  frequency: number;

  condition: (context: Repeater) => boolean;

  onStart: (context: Repeater) => void;

  onRepeat: (context: Repeater) => void;

  onEnd: (context: Repeater) => void;
}

export const REPEATER_DEFAULT_CONFIG: RepeaterConfig = {
  useAnimationFrame: true,

  timeUnit: 's',

  enableTimeout: true,

  timeoutDelay: 10,

  frequency: 24,

  condition: () => true,

  onStart: () => {},

  onRepeat: () => {},

  onEnd: () => {},
};