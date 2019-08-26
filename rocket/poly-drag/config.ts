import {
  PolyDrag,
} from './poly-drag';

import {
  DragStory,
} from './drag-story';

import {
  DragEvent
} from './drag-event';

export interface PolyDragConfig {
  target?: HTMLElement;

  offsetFrom?: HTMLElement;

  preventDefault: boolean;

  disableContextMenu: boolean;

  keepDragEventHistory: boolean;
  keepDragStoryHistory: boolean;

  condition: (dragEvent: DragEvent) => boolean;

  onEvent: (dragEvent: DragEvent, dragStory: DragStory, polyDrag: PolyDrag) => void;

  onStart: (dragEvent: DragEvent, dragStory: DragStory, polyDrag: PolyDrag) => void;
  onEnd: (dragEvent: DragEvent, dragStory: DragStory, polyDrag: PolyDrag) => void;

  onEachDragStart: (dragEvent: DragEvent, dragStory: DragStory, polyDrag: PolyDrag) => void;
  onEachDrag: (dragEvent: DragEvent, dragStory: DragStory, polyDrag: PolyDrag) => void;
  onEachDragStop: (dragEvent: DragEvent, dragStory: DragStory, polyDrag: PolyDrag) => void;
  onEachDragCancel: (dragEvent: DragEvent, dragStory: DragStory, polyDrag: PolyDrag) => void;
}

export const POLY_DRAG_DEFAULT_CONFIG: PolyDragConfig = {
  preventDefault: true,

  disableContextMenu: false,

  keepDragEventHistory: true,
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