import {
  Repeater,
} from './repeater';

export interface RepeaterConfig {
  enableTimeout: boolean;

  timeoutDelayInSeconds: number;

  numberOfRepeatsPerSecond: number;

  condition: (context: Repeater) => boolean;

  onStart: (context: Repeater) => void;

  onRepeat: (context: Repeater) => void;

  onEnd: (context: Repeater) => void;
}

export const REPEATER_DEFAULT_CONFIG: RepeaterConfig = {
  enableTimeout: true,

  timeoutDelayInSeconds: 10,

  numberOfRepeatsPerSecond: 24,

  condition: () => true,

  onStart: () => {},

  onRepeat: () => {},

  onEnd: () => {},
};