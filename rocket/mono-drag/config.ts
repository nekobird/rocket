import {
  MonoDrag,
} from './mono-drag';

import {
  DragEvent,
} from './drag-event';

export interface MonoDragConfig {
  target?: HTMLElement;

  offsetFrom?: HTMLElement;

  keepHistory: boolean;

  preventDefault: boolean;

  condition: (event: MouseEvent | TouchEvent, monoDrag: MonoDrag) => boolean;

  onEvent: (event: MouseEvent | TouchEvent, monoDrag: MonoDrag) => void;

  onStart: (dragEvent: DragEvent, monoDrag: MonoDrag) => void;
  onDrag: (dragEvent: DragEvent, monoDrag: MonoDrag) => void;
  onEnd: (dragEvent: DragEvent, monoDrag: MonoDrag) => void;
  onCancel: (dragEvent: DragEvent, monoDrag: MonoDrag) => void;
}

export const MONO_DRAG_DEFAULT_CONFIG: MonoDragConfig = {
  target: undefined,

  offsetFrom: undefined,

  keepHistory: false,

  preventDefault: true,

  condition: () => true,

  onEvent: () => {},

  onStart: () => {},
  onDrag: () => {},
  onEnd: () => {},
  onCancel: () => {},
};