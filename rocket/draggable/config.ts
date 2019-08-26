import {
  Vector2,
} from '../rocket';

import {
  Draggable,
} from './draggable';

export interface DragConstraints {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface DraggableConfig {
  target?: HTMLElement;

  lockDirection: boolean;
  lockDirectionAxis: 'x' | 'y';

  preventDefault: boolean;

  move: (target: HTMLElement, to: Vector2, draggable: Draggable) => void;

  onDragStart: () => void;
  onDrag: () => void;
  onDragStop: () => void;
  onDragCancel: () => void;
}

export const DRAGGABLE_DEFAULT_CONFIG: DraggableConfig = {
  lockDirection: false,
  lockDirectionAxis: 'y',

  preventDefault: false,

  move: () => { },

  onDragStart: () => { },
  onDrag: () => { },
  onDragStop: () => { },
  onDragCancel: () => { },
}
