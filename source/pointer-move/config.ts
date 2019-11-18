import {
  PointerMove,
} from './pointer-move';

import {
  MoveEvent,
} from './move-event';

export interface PointerMoveConfig {
  target?: HTMLElement | Window;

  preventDefault: boolean;

  debounceDelayInSeconds: number;

  onEvent: (mouseEvent: MouseEvent, pointerMove: PointerMove) => void;

  onEnter: (moveEvent: MoveEvent, pointerMove: PointerMove) => void;
  onLeave: (moveEvent: MoveEvent, pointerMove: PointerMove) => void;

  onMoveStart: (moveEvent: MoveEvent, pointerMove: PointerMove) => void;
  onMove: (moveEvent: MoveEvent, pointerMove: PointerMove) => void;
  onMoveEnd: (moveEvent: MoveEvent, pointerMove: PointerMove) => void;

  onMoveInside: (moveEvent: MoveEvent, pointerMove: PointerMove) => void;
}

export const POINTER_MOVE_DEFAULT_CONFIG: PointerMoveConfig = {
  target: window,

  preventDefault: true,

  debounceDelayInSeconds: 0.2,

  onEvent: () => {},

  onEnter: () => {},
  onLeave: () => {},

  onMoveStart: () => {},
  onMove: () => {},
  onMoveEnd: () => {},

  onMoveInside: () => {},
};
