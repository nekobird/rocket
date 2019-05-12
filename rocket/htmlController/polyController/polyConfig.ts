import {
  AfterActionCallback,
  BeforeActionCallback,
  ConditionHook,
  EventEntry,
  ListenToHook,
  OutsideActionHook,
  PolyAction,
  PolyController,
  PolyGroup,
} from '../index';

// INTERFACE

export interface PolyConfig {
  cooldown?: number,

  listenToKeydown?: boolean,

  closeOnOutsideAction?: boolean,

  selectorItems?: string,

  classNameItemActive?: string,

  classNameJsActivate?: string,
  classNameJsDeactivate?: string,
  classNameJsToggle?: string,
  classNameJsActivateAll?: string,
  classNameJsDeactivateAll?: string,
  classNameJsToggleAll?: string,

  conditionActivate?: ConditionHook<PolyAction, PolyController>,
  conditionDeactivate?: ConditionHook<PolyAction, PolyController>,
  conditionToggle?: ConditionHook<PolyAction, PolyController>,

  conditionActivateAll?: ConditionHook<PolyAction, PolyController>,
  conditionDeactivateAll?: ConditionHook<PolyAction, PolyController>,
  conditionToggleAll?: ConditionHook<PolyAction, PolyController>,

  beforeDeactivate?: BeforeActionCallback<PolyAction, PolyController>,
  afterDeactivate?: AfterActionCallback<PolyAction, PolyController>,

  beforeActivate?: BeforeActionCallback<PolyAction, PolyController>,
  afterActivate?: AfterActionCallback<PolyAction, PolyController>,

  beforeAction?: BeforeActionCallback<PolyAction, PolyController>,
  afterAction?: AfterActionCallback<PolyAction, PolyController>,

  onKeydown?: ListenToHook<KeyboardEvent, PolyGroup, PolyController>,

  onOutsideAction?: OutsideActionHook<PolyGroup, PolyController>,
}

export const POLY_DEFAULT_CONFIG: PolyConfig = {
  cooldown: 200,

  listenToKeydown: false,

  closeOnOutsideAction: false, 

  selectorItems: '.js-poly-item',

  classNameItemActive: 'js-poly-item--active',

  classNameJsActivate  : 'js-poly-item-activate',
  classNameJsDeactivate: 'js-poly-item-deactivate',
  classNameJsToggle    : 'js-poly-item-toggle',

  classNameJsActivateAll  : 'js-poly-item-activate-all',
  classNameJsDeactivateAll: 'js-poly-item-deactivate-all',
  classNameJsToggleAll    : 'js-poly-item-toggle-all',

  conditionActivate  : (action, context) => { return true },
  conditionDeactivate: (action, context) => { return true },
  conditionToggle    : (action, context) => { return true },

  conditionActivateAll  : (action, context) => { return true },
  conditionDeactivateAll: (action, context) => { return true },
  conditionToggleAll    : (action, context) => { return true },

  beforeDeactivate: (action, context) => { return Promise.resolve() },
  afterDeactivate : (action, context) => { return Promise.resolve() },

  beforeActivate: (action, context) => { return Promise.resolve() },
  afterActivate : (action, context) => { return Promise.resolve() },

  beforeAction: (action, context) => { return Promise.resolve() },
  afterAction : (action, context) => { return Promise.resolve() },
  
  onKeydown: (event, group, context) => { },

  onOutsideAction: (group, context) => { },
}

export const POLY_EVENT_ENTRY_LIST: EventEntry[] = [
  {
    name    : 'activate',
    action  : 'activate',
    target  : 'jsActivate',
    event   : ['click', 'touchstart'],
    listener: undefined,
  },
  {
    name    : 'deactivate',
    action  : 'deactivate',
    target  : 'jsDeactivate',
    event   : ['click', 'touchstart'],
    listener: undefined,
  },
  {
    name    : 'toggle',
    action  : 'toggle',
    target  : 'jsToggle',
    event   : ['click', 'touchstart'],
    listener: undefined,
  },
  {
    name    : 'activateAll',
    action  : 'activateAll',
    target  : 'jsActivateAll',
    event   : ['click', 'touchstart'],
    listener: undefined,
  },
  {
    name    : 'deactivateAll',
    action  : 'deactivateAll',
    target  : 'jsDeactivateAll',
    event   : ['click', 'touchstart'],
    listener: undefined,
  },
  {
    name    : 'toggleAll',
    action  : 'toggleAll',
    target  : 'jsToggleAll',
    event   : ['click', 'touchstart'],
    listener: undefined,
  },
]