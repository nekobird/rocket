export interface DragConstraints {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface DraggableConfig {
  target?: HTMLElement;

  directionLock: 'x' | 'y';
}