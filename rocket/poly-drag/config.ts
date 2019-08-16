export interface PolyDragConfig {
  dragCondition: () => boolean;
  condition: () => boolean;

  onDrag: () => void;
}