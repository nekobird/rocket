import {
  AfterActionCallback,
  BeforeActionCallback,
  ConditionHook,
} from '../index';

import {
  EventEntry,
} from './eventManager'


import {
  PolyController,
} from './polyController'

import {
  PolyAction,
} from './actionManager'

export interface PolyConfig {
  cooldown?: number,

  deactivateAllOnOutsideAction?: boolean,

  listenToKeydown?: boolean,

  selectorItems?: string,

  classNameItemActive?: string,

  classNameJsActivate?  : string,
  classNameJsDeactivate?: string,
  classNameJsToggle?    : string,

  classNameJsActivateAll?  : string,
  classNameJsDeactivateAll?: string,
  classNameJsToggleAll?    : string,

  conditionActivate?  : ConditionHook<PolyAction, PolyController>,
  conditionDeactivate?: ConditionHook<PolyAction, PolyController>,
  conditionToggle?    : ConditionHook<PolyAction, PolyController>,

  conditionActivateAll?  : ConditionHook<PolyAction, PolyController>,
  conditionDeactivateAll?: ConditionHook<PolyAction, PolyController>,
  conditionToggleAll?    : ConditionHook<PolyAction, PolyController>,

  beforeDeactivate?: BeforeActionCallback<PolyAction, PolyController>,
  afterDeactivate? : AfterActionCallback<PolyAction, PolyController>,

  beforeActivate?: BeforeActionCallback<PolyAction, PolyController>,
  afterActivate? : AfterActionCallback<PolyAction, PolyController>,

  beforeAction?: BeforeActionCallback<PolyAction, PolyController>,
  afterAction? : AfterActionCallback<PolyAction, PolyController>,

  onOutsideAction?: (context: PolyController) => void,

  onKeydown?: (event: KeyboardEvent, context: PolyController) => void,
}

export const DEFAULT_CONFIG: PolyConfig = {
  cooldown: 200,

  deactivateAllOnOutsideAction: false,
  listenToKeydown: false,

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
  
  onOutsideAction: (context) => { },
  onKeydown: (event, context) => { },
}

export const POLY_EVENT_ENTRY_LIST: EventEntry[] = [
  {
    name    : 'activate',
    action  : 'activate',
    target  : 'jsActivate',
  },
  {
    name    : 'deactivate',
    action  : 'deactivate',
    target  : 'jsDeactivate',
  },
  {
    name    : 'toggle',
    action  : 'toggle',
    target  : 'jsToggle',
  },
  {
    name    : 'activateAll',
    action  : 'activateAll',
    target  : 'jsActivateAll',
  },
  {
    name    : 'deactivateAll',
    action  : 'deactivateAll',
    target  : 'jsDeactivateAll',
  },
  {
    name    : 'toggleAll',
    action  : 'toggleAll',
    target  : 'jsToggleAll',
  },
]