import {
  MonoTap,
} from './mono-tap';

import {
  TapStory,
} from './tap-story';

import {
  TapEvent,
} from './tap-event';

export interface MonoTapConfig {
  target?: HTMLElement;
  offsetFrom?: HTMLElement;

  keepHistory: boolean;

  preventDefault: boolean;

  isValidTap: (
    event: TapEvent,
    story: TapStory,
    monoTap: MonoTap,
  ) => boolean;

  onTap: (
    event: TapEvent,
    story: TapStory,
    monoTap: MonoTap,
  ) => void;

  onDown: (
    event: TapEvent,
    story: TapStory,
    monoTap: MonoTap,
  ) => void;

  onUp: (
    event: TapEvent,
    story: TapStory,
    monoTap: MonoTap,
  ) => void;

  onCancel: (
    event: TapEvent,
    story: TapStory,
    monoTap: MonoTap,
  ) => void;
}

export const MONO_TAP_DEFAULT_CONFIG = {
  isValidTap: () => true,
  onTap: () => {},

  keepHistory: false,

  preventDefault: false,

  onDown: () => {},
  onUp: () => {},
  onCancel: () => {},
}