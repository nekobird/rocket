import {
  AfterActionCallback,
  BeforeActionCallback,
  ConditionHook,
} from '../index';

import {
  ActionConfigMapEntries,
} from './eventManager'

import {
  PolyController,
} from './polyController'

import {
  PolyAction,
} from './actionManager'

export interface PolyConfig {
  cooldown: number,

  deactivateAllOnOutsideAction: boolean,

  listenToKeydown: boolean,

  itemsSelector: string | undefined,
  items: HTMLElement[] | NodeListOf<HTMLElement> | undefined,

  classNameItemActive: string,

  classNameJsActivate  : string,
  classNameJsDeactivate: string,
  classNameJsToggle    : string,

  classNameJsActivateAll  : string,
  classNameJsDeactivateAll: string,
  classNameJsToggleAll    : string,

  conditionActivate  : ConditionHook<PolyAction, PolyController>,
  conditionDeactivate: ConditionHook<PolyAction, PolyController>,
  conditionToggle    : ConditionHook<PolyAction, PolyController>,

  conditionActivateAll  : ConditionHook<PolyAction, PolyController>,
  conditionDeactivateAll: ConditionHook<PolyAction, PolyController>,
  conditionToggleAll    : ConditionHook<PolyAction, PolyController>,

  beforeDeactivate: BeforeActionCallback<PolyAction, PolyController>,
  afterDeactivate : AfterActionCallback<PolyAction, PolyController>,

  beforeActivate: BeforeActionCallback<PolyAction, PolyController>,
  afterActivate : AfterActionCallback<PolyAction, PolyController>,

  beforeAction: BeforeActionCallback<PolyAction, PolyController>,
  afterAction : AfterActionCallback<PolyAction, PolyController>,

  onOutsideAction: (context: PolyController) => void,

  onKeydown: (event: KeyboardEvent, context: PolyController) => void,
}

export const DEFAULT_CONFIG: PolyConfig = {
  cooldown: 200,

  deactivateAllOnOutsideAction: false,
  listenToKeydown: false,

  itemsSelector: '.js-poly-item',
  items: undefined,

  classNameItemActive: 'js-poly-item--active',

  classNameJsActivate  : 'js-poly-item-activate',
  classNameJsDeactivate: 'js-poly-item-deactivate',
  classNameJsToggle    : 'js-poly-item-toggle',

  classNameJsActivateAll  : 'js-poly-item-activate-all',
  classNameJsDeactivateAll: 'js-poly-item-deactivate-all',
  classNameJsToggleAll    : 'js-poly-item-toggle-all',

  conditionActivate  : (action, context) => true,
  conditionDeactivate: (action, context) => true,
  conditionToggle    : (action, context) => true,

  conditionActivateAll  : (action, context) => true,
  conditionDeactivateAll: (action, context) => true,
  conditionToggleAll    : (action, context) => true,

  beforeDeactivate: (action, context) => Promise.resolve(),
  afterDeactivate : (action, context) => Promise.resolve(),

  beforeActivate: (action, context) => Promise.resolve(),
  afterActivate : (action, context) => Promise.resolve(),

  beforeAction: (action, context) => Promise.resolve(),
  afterAction : (action, context) => Promise.resolve(),
  
  onOutsideAction: (context) => { },
  onKeydown: (event, context) => { },
}

export const POLY_ACTION_CONFIG_MAP: ActionConfigMapEntries = [
  {
    configProperty: 'classNameJsActivate',
    action: 'activate',
  },
  {
    configProperty: 'classNameJsDeactivate',
    action: 'deactivate',
  },
  {
    configProperty: 'classNameJsToggle',
    action: 'toggle',
  },
  {
    configProperty: 'classNameJsActivateAll',
    action: 'activateAll',
  },
  {
    configProperty: 'classNameJsDeactivateAll',
    action: 'deactivateAll',
  },
  {
    configProperty: 'classNameJsToggleAll',
    action: 'toggleAll',
  },
]