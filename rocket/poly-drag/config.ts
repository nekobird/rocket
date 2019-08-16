import {
  Repeater,
} from '../rocket';

import {
  DragEventManager,
} from './poly-drag';

import {
  DragEvent,
} from './event-story';

export type EventTypes = 'TOUCH' | 'MOUSE';

export interface PolyDragEventConfig {
  scrollEndDebounceDelay: number;

  leftMouseButtonOnly: boolean;

  parent: HTMLElement | Window;

  listenTo: EventTypes[];

  enableDownRepeater: boolean;

  downRepeaterFrequency: number;

  beforeDownRepeatStart: (repeater: Repeater, event: DragEvent, manager: DragEventManager) => void;

  onDownRepeatStart: (repeater: Repeater, event: DragEvent, manager: DragEventManager) => void;

  onDownRepeat: (repeater: Repeater, event: DragEvent, manager: DragEventManager) => void;

  onDownRepeatEnd: (repeater: Repeater, event: DragEvent, manager: DragEventManager) => void;

  enableLongPress: boolean;

  longPressWait: number; // In seconds.

  longPressCondition: (event: DragEvent, manager: DragEventManager) => boolean;

  onLongPress: (event: DragEvent, manager: DragEventManager) => void;

  condition: (event: DragEvent, manager: DragEventManager) => boolean;

  onDown: (event: DragEvent, manager: DragEventManager) => void;

  onDrag: (event: DragEvent, manager: DragEventManager) => void;

  onUp: (event: DragEvent, manager: DragEventManager) => void;

  onCancel: (event: DragEvent, manager: DragEventManager) => void;
}

export const DRAG_EVENT_MANAGER_DEFAULT_CONFIG: PolyDragEventConfig = {
  scrollEndDebounceDelay: 0.3,

  leftMouseButtonOnly: true,

  parent: window,

  listenTo: ['TOUCH', 'MOUSE'],

  enableDownRepeater: false,

  downRepeaterFrequency: 60,

  beforeDownRepeatStart: () => {},

  onDownRepeatStart: () => {},

  onDownRepeat: () => {},

  onDownRepeatEnd: () => {},

  enableLongPress: false,
 
  longPressWait: 2,

  longPressCondition: () => true,

  onLongPress: () => {},

  condition: () => true,

  onDown: () => {},

  onDrag: () => {},

  onUp: () => {},

  onCancel: () => {},
};
