export interface PolyDragConfig {
  preventDefault: boolean;

  condition: () => boolean;

  onDragStart: () => void;
  onDrag: () => void;
  onDragStop: () => void;
  onDragCancel: () => void;
}

export const POLY_DRAG_DEFAULT_CONFIG: PolyDragConfig = {
  preventDefault: true,

  condition: () => true,

  onDragStart: () => {},
  onDrag: () => {},
  onDragStop: () => {},
  onDragCancel: () => {},
}