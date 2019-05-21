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

  groupSelector: string;
  group?: HTMLElement;

  itemsSelector: string;
  items?: HTMLElement[];
  childIsItem: (child: HTMLElement) => boolean;

  prepareGroup: (group: HTMLElement) => void;
  prepareItems: (item: HTMLElement) => void;

  createDummyFromItem: (item: HTMLElement, context: Sortable) => HTMLElement;
  setDummyElementPropertiesFromItem: (dummyElement: HTMLElement, item: HTMLElement, context: Sortable) => void;

  activateItem: (item: HTMLElement, context: Sortable) => void;
  deactivateItem: (item: HTMLElement, context: Sortable) => void;

  popItem: (item: HTMLElement, group: HTMLElement, context: Sortable) => void;
  unpopItem: (item: HTMLElement, group: HTMLElement, context: Sortable) => void;

  moveItem: (item: HTMLElement, to: Point, context: Sortable) => void;

  onComplete: (context: Sortable) => void;

  onDown: (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => void;
  onDrag: (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => void;
  onUp: (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => void;
  onCancel: (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => void;
  onLongPress: (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => void;
}

export const SORTABLE_DEFAULT_CONFIG: SortableConfig = {
  activateOnLongPress: false,
  listenToLongPress: true,
  longPressWait: 0.5,

  disableTouchEventsWhileActive: true,
  disableEventsOnItemWhileActive: true,

  groupSelector: '.sortableContainer',
  group: undefined,

  itemsSelector: '.sortableItem',
  items: undefined,
  childIsItem: element => true,

  prepareGroup: group => {
    group.style.position = 'relatiev';
  },
  prepareItems: item => {
    item.style.touchAction = 'none';
    item.style.userSelect = 'none';
  },

  createDummyFromItem: item => document.createElement('DIV'),
  setDummyElementPropertiesFromItem: (dummy, item) => {
    DOMStyle.applyStyle(dummy, {
      position: 'relative',
      boxSizing: 'border-box',
      width: `${item.offsetWidth}px`,
      height: `${item.offsetHeight}px`,
      backgroundColor: 'black',
    });
    DOMStyle.copyStyleFrom(
      item,
      ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
      dummy
    );
  },

  activateItem: item => {
    item.classList.add('sortableItem--active');
  },
  moveItem: (item, { x, y }) => {
    item.style.transform = `translateX(${x}px) translateY(${y}px)`;
  },
  deactivateItem: item => {
    item.classList.remove('sortableItem--active');
  },
  popItem: (item, group) => {
    group.style.position = 'relative';

    const width = item.offsetWidth;
    const height = item.offsetHeight;

    DOMStyle.applyStyle(item, {
      boxSizing: 'border-box',
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: `${width}px`,
      height: `${height}px`,
    });
  },
  unpopItem: item => DOMStyle.clearStyles(item),

  onComplete: () => {},
  onDown: () => {},
  onDrag: () => {},
  onUp: () => {},
  onCancel: () => {},
  onLongPress: () => {},
};
