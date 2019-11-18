import {
  MonoTap,
} from './mono-tap';

import {
  MonoTapStory,
} from './mono-tap-story';

import {
  MonoTapEvent,
} from './mono-tap-event';

export interface MonoTapConfig {
  target?: HTMLElement;

  offsetFrom?: HTMLElement;

  positionThreshold: number;

  keepHistory: boolean;

  preventDefault: boolean;

  condition: (
    event: MonoTapEvent,
    monoTap: MonoTap,
  ) => boolean;

  isValidTap: (
    event: MonoTapEvent,
    story: MonoTapStory,
    monoTap: MonoTap,
  ) => boolean;

  onTap: (
    event: MonoTapEvent,
    story: MonoTapStory,
    monoTap: MonoTap,
  ) => void;

  onEvent: (
    event: MonoTapEvent,
    monoTap: MonoTap,
  ) => void;

  onDown: (
    event: MonoTapEvent,
    story: MonoTapStory,
    monoTap: MonoTap,
  ) => void;

  onUp: (
    event: MonoTapEvent,
    story: MonoTapStory,
    monoTap: MonoTap,
  ) => void;

  onCancel: (
    event: MonoTapEvent,
    story: MonoTapStory,
    monoTap: MonoTap,
  ) => void;
}

export const MONO_TAP_DEFAULT_CONFIG = {
  positionThreshold: 10,

  keepHistory: false,

  preventDefault: true,

  condition: () => true,

  isValidTap: () => true,

  onTap: () => {},

  onEvent: () => {},

  onDown: () => {},
  onUp: () => {},
  onCancel: () => {},
}