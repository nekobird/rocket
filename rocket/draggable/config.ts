export interface DragConstraints {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface DraggableConfig {
  target?: HTMLElement;

  directionLock: 'x' | 'y';

  move: (target: HTMLElement, to: Vector2, draggable: Draggable) => void;

  onDragStart: () => void;
  onDrag: () => void;
  onDragStop: () => void;
  onDragCancel: () => void;
}