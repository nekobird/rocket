import {
  DOMStyle,
  DragEventManager,
  Point,
} from '../../rocket';

import {
  Sortable,
} from './sortable';

export interface SortableConfig {
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

  createDummyFromItem: (item: HTMLElement, context: Sortable) => HTMLElement;
  setDummyElementPropertiesFromItem: (dummyElement: HTMLElement, item: HTMLElement, context: Sortable) => void;

  activateOnLongPress: boolean;
  listenToLongPress: boolean;
  longPressWait: number;
  longPressCondition: (event, manager: DragEventManager, context: Sortable) => boolean,

  condition: (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => boolean;

  beforeActivate: (context: Sortable) => void;
  beforeDeactivate: (context: Sortable) => void;

  activateItem: (item: HTMLElement, context: Sortable) => void;
  deactivateItem: (item: HTMLElement, context: Sortable) => void;

  afterActivate: (context: Sortable) => void;
  afterDeactivate: (context: Sortable) => void;

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

export const SORTABLE_DEFAULT_CONFIG: SortableConfig = {
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
