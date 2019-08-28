import {
  PolyDrag,
} from './poly-drag';

import {
  PolyDragStory,
} from './poly-drag-story';

import {
  PolyDragEvent
} from './poly-drag-event';

export interface PolyDragConfig {
  target?: HTMLElement;

  offsetFrom?: HTMLElement;

  preventDefault: boolean;

  disableContextMenu: boolean;

  keepPolyDragEventHistory: boolean;

  keepDragStoryHistory: boolean;

  condition: (
    polyDragEvent: PolyDragEvent,
    polyDrag: PolyDrag,
  ) => boolean;

  onEvent: (
    polyDragEvent: PolyDragEvent,
    polyDrag: PolyDrag,
  ) => void;

  onStart: (
    polyDragEvent: PolyDragEvent,
    polyDragStory: PolyDragStory,
    polyDrag: PolyDrag,
  ) => void;

  onEnd: (
    polyDragEvent: PolyDragEvent,
    polyDragStory: PolyDragStory,
    polyDrag: PolyDrag,
  ) => void;

  onEachDragStart: (
    polyDragEvent: PolyDragEvent,
    polyDragStory: PolyDragStory,
    polyDrag: PolyDrag,
  ) => void;

  onEachDrag: (
    polyDragEvent: PolyDragEvent,
    polyDragStory: PolyDragStory,
    polyDrag: PolyDrag,
  ) => void;

  onEachDragStop: (
    polyDragEvent: PolyDragEvent,
    polyDragStory: PolyDragStory,
    polyDrag: PolyDrag,
  ) => void;

  onEachDragCancel: (
    polyDragEvent: PolyDragEvent,
    polyDragStory: PolyDragStory,
    polyDrag: PolyDrag,
  ) => void;
}

export const POLY_DRAG_DEFAULT_CONFIG: PolyDragConfig = {
  preventDefault: true,

  disableContextMenu: false,

  keepPolyDragEventHistory: true,

  keepDragStoryHistory: true,

  condition: () => true,

  onEvent: () => {},

  onStart: () => {},

  onEnd: () => {},

  onEachDragStart: () => {},
  onEachDrag: () => {},
  onEachDragStop: () => {},
  onEachDragCancel: () => {},
}