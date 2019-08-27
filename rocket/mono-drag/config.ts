import {
  MonoDrag,
} from './mono-drag';

import {
  MonoDragEvent,
} from './mono-drag-event';

export interface MonoDragConfig {
  target?: HTMLElement;

  offsetFrom?: HTMLElement;

  keepHistory: boolean;

  preventDefault: boolean;
  disableContextMenu: boolean;

  condition: (dragEvent: MonoDragEvent, monoDrag: MonoDrag) => boolean;

  onEvent: (event: MouseEvent | TouchEvent, monoDrag: MonoDrag) => void;

  onDragStart: (dragEvent: MonoDragEvent, monoDrag: MonoDrag) => void;
  onDrag: (dragEvent: MonoDragEvent, monoDrag: MonoDrag) => void;
  onDragStop: (dragEvent: MonoDragEvent, monoDrag: MonoDrag) => void;
  onDragCancel: (dragEvent: MonoDragEvent, monoDrag: MonoDrag) => void;
}

export const MONO_DRAG_DEFAULT_CONFIG: MonoDragConfig = {
  target: undefined,

  offsetFrom: undefined,

  keepHistory: false,

  preventDefault: true,
  disableContextMenu: false,

  condition: () => true,

  onEvent: () => {},

  onDragStart: () => {},
  onDrag: () => {},
  onDragStop: () => {},
  onDragCancel: () => {},
};
