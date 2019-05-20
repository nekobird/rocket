import {
  DOMStyle,
  DragEventManager,
  Point,
} from '../../rocket';

import {
  Sortable,
} from './sortable';

export interface SortableConfig {
  activateOnLongPress: boolean;
  listenToLongPress: boolean;
  longPressWait: number;

  disableTouchEventsWhileActive: boolean;
  disableEventsOnItemWhileActive: boolean;

  containerSelector: string;
  container?: HTMLElement;

  itemsSelector: string;
  items?: HTMLElement[];

  prepareItems: (item: HTMLElement) => void;

  createDummyFromItem: (item: HTMLElement, context: Sortable) => HTMLElement;
  setDummyElementPropertiesFromItem: (dummyElement: HTMLElement, item: HTMLElement, context: Sortable) => void;

  activateItem: (item: HTMLElement, context: Sortable) => void;
  deactivateItem: (item: HTMLElement, context: Sortable) => void;

  popItem: (item: HTMLElement, context: Sortable) => void;
  unpopItem: (item: HTMLElement, context: Sortable) => void;

  moveItem: (item: HTMLElement, to: Point, context: Sortable) => void;

  onComplete: (context: Sortable) => void;

  onDown: (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => void;
  onDrag: (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => void;
  onUp: (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => void;
  onCancel: (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => void;
  onLongPress: (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => void;
}

export const SORTABLE_CONFIG: SortableConfig = {
  activateOnLongPress: false,
  listenToLongPress: true,
  longPressWait: 0.5,

  disableTouchEventsWhileActive: true,
  disableEventsOnItemWhileActive: true,

  containerSelector: '.sortableContainer',
  container: undefined,

  itemsSelector: '.sortableItem',
  items: undefined,

  prepareItems: item => {
    item.style.touchAction = 'none';
    item.style.userSelect = 'none';
  },

  createDummyFromItem: item => document.createElement('DIV'),

  setDummyElementPropertiesFromItem: (dummy, item) => {
    dummy.classList.add('sortableItem', 'sortableItem--dummy');
    DOMStyle.applyStyle(dummy, {
      width: `${item.offsetWidth}px`,
      height: `${item.offsetHeight}px`,
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 0,
    });
  },

  activateItem: item => {
    item.classList.add('sortableItem--active');
  },
  deactivateItem: item => {
    item.classList.remove('sortableItem--active');
  },

  popItem: item => {
    const width: number = item.offsetWidth;
    const height: number = item.offsetHeight;
    DOMStyle.applyStyle(item, {
      position: 'absolute',
      left: 0,
      top: 0,
      width : `${width}px`,
      height: `${height}px`,
    });
  },
  unpopItem: item => DOMStyle.clearStyle(item),

  moveItem: (item, { x, y }) => {
    item.style.transform = `translateX(${x}px) translateY(${y}px)`;
  },

  onComplete: () => {},
  onDown: () => {},
  onDrag: () => {},
  onUp: () => {},
  onCancel: () => {},
  onLongPress: () => {},
};
