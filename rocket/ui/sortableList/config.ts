import {
  DOMStyle,
  DragEventManager,
  Point,
} from '../../rocket';

import {
  SortableList,
} from './sortableList';

export interface SortableListConfig {
  useTransition: boolean;
  transitionDuration: number;
  transitionTimingFunction: string;

  leftMouseButtonOnly: boolean,

  disableTouchEventsWhileActive: boolean;

  autoScroll: boolean;

  groupsSelector?: string;
  groups?: HTMLElement[] | NodeListOf<HTMLElement> | HTMLCollection;
  childIsItem: (child: HTMLElement) => boolean;

  prepareGroup: (group: HTMLElement) => void;
  prepareItems: (item: HTMLElement) => void;

  createDummyFromItem: (item: HTMLElement, context: SortableList) => HTMLElement;
  setDummyElementPropertiesFromItem: (dummyElement: HTMLElement, item: HTMLElement, context: SortableList) => void;

  activateOnLongPress: boolean;
  listenToLongPress: boolean;
  longPressWait: number;
  longPressCondition: (event, manager: DragEventManager, context: SortableList) => boolean,

  condition: (item: HTMLElement, event, manager: DragEventManager, context: SortableList) => boolean;

  beforeActivate: (context: SortableList) => void;
  beforeDeactivate: (context: SortableList) => void;

  activateItem: (item: HTMLElement, context: SortableList) => void;
  deactivateItem: (item: HTMLElement, context: SortableList) => void;

  afterActivate: (context: SortableList) => void;
  afterDeactivate: (context: SortableList) => void;

  popItem: (item: HTMLElement, context: SortableList) => void;
  unpopItem: (item: HTMLElement, context: SortableList) => void;

  moveItem: (item: HTMLElement, to: Point, context: SortableList) => void;

  onComplete: (context: SortableList) => void;

  onDown: (item: HTMLElement, event, manager: DragEventManager, context: SortableList) => void;
  onDrag: (item: HTMLElement, event, manager: DragEventManager, context: SortableList) => void;
  onUp: (item: HTMLElement, event, manager: DragEventManager, context: SortableList) => void;
  onCancel: (item: HTMLElement, event, manager: DragEventManager, context: SortableList) => void;
  onLongPress: (item: HTMLElement, event, manager: DragEventManager, context: SortableList) => void;
}

export const SORTABLE_DEFAULT_CONFIG: SortableListConfig = {
  useTransition: false,
  transitionDuration: 150,
  transitionTimingFunction: 'ease-out',


  leftMouseButtonOnly: true,

  disableTouchEventsWhileActive: true,

  autoScroll: false,

  groupsSelector: '.sortableContainer',
  groups: undefined,
  childIsItem: element => true,

  prepareGroup: group => {
    group.style.position = 'relative';
  },
  prepareItems: item => {},

  createDummyFromItem: item => document.createElement('DIV'),
  setDummyElementPropertiesFromItem: (dummy, item) => {
    DOMStyle.applyStyle(dummy, {
      position: 'relative',
      boxSizing: 'border-box',
      width: `${item.offsetWidth}px`,
      height: `${item.offsetHeight}px`,
    });
    DOMStyle.copyStylesFrom(
      item,
      ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
      dummy
    );
  },

  activateOnLongPress: false,
  listenToLongPress: true,
  longPressWait: 0.4,
  longPressCondition: () => true,

  beforeActivate: () => {},
  beforeDeactivate: () => {},
  afterActivate: () => {},
  afterDeactivate: () => {},

  condition: () => true,

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
