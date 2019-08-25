import {
  PolyDrag,
} from './poly-drag';

import {
  DragEvent
} from './drag-event';

export interface PolyDragConfig {
  target?: HTMLElement;

  offsetFrom?: HTMLElement;

  preventDefault: boolean;

  keepDragEventHistory: boolean;
  keepDragStoryHistory: boolean;

  condition: (dragEvent: DragEvent) => boolean;

  onEvent: (dragEvent: DragEvent, polyDrag: PolyDrag) => void;

  onStart: (dragEvent: DragEvent, polyDrag: PolyDrag) => void;

  onEachDragStart: (dragEvent: DragEvent, polyDrag: PolyDrag) => void;
  onEachDrag: (dragEvent: DragEvent, polyDrag: PolyDrag) => void;
  onEachDragStop: (dragEvent: DragEvent, polyDrag: PolyDrag) => void;
  onEachDragCancel: (dragEvent: DragEvent, polyDrag: PolyDrag) => void;

  onEnd: (dragEvent: DragEvent, polyDrag: PolyDrag) => void;
}

export const POLY_DRAG_DEFAULT_CONFIG: PolyDragConfig = {
  preventDefault: true,

  keepDragEventHistory: true,
  keepDragStoryHistory: true,

  condition: () => true,

  onEvent: () => {},

  onStart: () => {},
  onEachDragStart: () => {},
  onEachDrag: () => {},
  onEachDragStop: () => {},
  onEachDragCancel: () => {},
  onEnd: () => {},
}