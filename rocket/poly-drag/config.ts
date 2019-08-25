export interface PolyDragConfig {
  target?: HTMLElement;

  offsetFrom?: HTMLElement;

  keepHistory: boolean;

  preventDefault: boolean;

  condition: (event: MouseEvent | TouchEvent, ) => boolean;

  onEvent: () => void;

  onStart: () => void;
  onEachDragStart: () => void;
  onEachDrag: () => void;
  onEachDragStop: () => void;
  onEachDragCancel: () => void;
  onEnd: () => void;
}

export const POLY_DRAG_DEFAULT_CONFIG: PolyDragConfig = {
  keepHistory: true,

  preventDefault: true,

  condition: () => true,

  onEvent: () => {},

  onStart: () => {},
  onEachDragStart: () => {},
  onEachDrag: () => {},
  onEachDragStop: () => {},
  onEachDragCancel: () => {},
  onEnd: () => {},
}