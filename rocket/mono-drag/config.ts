import {
  MonoDrag,
} from './mono-drag';

import {
  MonoDragStory,
} from './mono-drag-story';

import {
  MonoDragEvent,
} from './mono-drag-event';

export interface MonoDragConfig {
  target?: HTMLElement;

  offsetFrom?: HTMLElement;

  keepHistory: boolean;

  preventDefault: boolean;

  disableContextMenu: boolean;

  condition: (
    monoDragEvent: MonoDragEvent,
    monoDrag: MonoDrag,
  ) => boolean;

  onEvent: (
    event: MouseEvent | TouchEvent,
    monoDrag: MonoDrag,
  ) => void;

  onDragStart: (
    monoDragEvent: MonoDragEvent,
    monoDragStory: MonoDragStory,
    monoDrag: MonoDrag
  ) => void;

  onDrag: (
    monoDragEvent: MonoDragEvent,
    monoDragStory: MonoDragStory,
    monoDrag: MonoDrag
  ) => void;

  onDragStop: (
    monoDragEvent: MonoDragEvent,
    monoDragStory: MonoDragStory,
    monoDrag: MonoDrag
  ) => void;

  onDragCancel: (
    monoDragEvent: MonoDragEvent,
    monoDragStory: MonoDragStory,
    monoDrag: MonoDrag
  ) => void;
}

export const MONO_DRAG_DEFAULT_CONFIG: MonoDragConfig = {
  target: undefined,

  offsetFrom: undefined,

  keepHistory: false,

  preventDefault: true,

  disableContextMenu: false,

  condition: () => true,

  onEvent: () => {},

  onDragStart: () => {},
  onDrag: () => {},
  onDragStop: () => {},
  onDragCancel: () => {},
};
