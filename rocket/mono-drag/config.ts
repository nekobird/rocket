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

  condition: (event: MouseEvent | TouchEvent, manager: MonoDrag) => boolean;

  onEvent: (event: MouseEvent | TouchEvent, manager: MonoDrag) => void;

  onStart: (dragEvent: DragEvent, manager: MonoDrag) => void;

  onDrag: (dragEvent: DragEvent, manager: MonoDrag) => void;

  onEnd: (dragEvent: DragEvent, manager: MonoDrag) => void;

  onCancel: (dragEvent: DragEvent, manager: MonoDrag) => void;
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