import {
  PointerMove,
} from './pointer-move';

import {
  MoveEvent,
} from './move-event';

export interface PointerMoveConfig {
  target?: HTMLElement | Window;

  debounceDelayInSeconds: number;

  onEvent: (mouseEvent: MouseEvent, context: PointerMove) => void;

  onEnter: (moveEvent: MoveEvent, context: PointerMove) => void;

  onLeave: (moveEvent: MoveEvent, context: PointerMove) => void;

  onMoveStart: (moveEvent: MoveEvent, context: PointerMove) => void;

  onMove: (moveEvent: MoveEvent, context: PointerMove) => void;

  onMoveEnd: (moveEvent: MoveEvent, context: PointerMove) => void;

  onMoveInside: (moveEvent: MoveEvent, context: PointerMove) => void;
}

export const POINTER_MOVE_DEFAULT_CONFIG: PointerMoveConfig = {
  target: window,

  debounceDelayInSeconds: 0.2,

  onEvent: () => {},

  onMoveStart: () => {},

  onMove: () => {},

  onMoveInside: () => {},

  onMoveEnd: () => {},

  onEnter: () => {},

  onLeave: () => {},
};
