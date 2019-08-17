export interface PolyDragConfig {
  preventDefault: boolean;

  dragCondition: () => boolean;

  condition: () => boolean;

  onDrag: () => void;
}

export const POLY_DRAG_DEFAULT_CONFIG: PolyDragConfig = {
  preventDefault: true,

  dragCondition: () => true,

  condition: () => true,

  onDrag: () => {},
}