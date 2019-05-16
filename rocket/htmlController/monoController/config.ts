import {
  AfterActionCallback,
  BeforeActionCallback,
  ConditionHook,
  Hook,
} from '../index'

import {
  ActionConfigMapEntries,
} from './eventManager'

import {
  MonoAction,
} from './actionManager'

import {
  MonoController,
} from './monoController'

export interface MonoConfig {
  cooldown?: number,

  listenToKeydown?: boolean,

  deactivateOnOutsideAction?: boolean,
  
  itemsSelector?: string | undefined,
  items?: HTMLElement[] | NodeListOf<HTMLElement> | undefined,

  classNameItemActive?  : string,
  classNameJsActivate?  : string,
  classNameJsDeactivate?: string,
  classNameJsToggle?    : string,

  beforeActivate?  : Hook<MonoAction, MonoController>,
  beforeDeactivate?: Hook<MonoAction, MonoController>,

  afterActivate?  : Hook<MonoAction, MonoController>,
  afterDeactivate?: Hook<MonoAction, MonoController>,

  conditionActivate?  : ConditionHook<MonoAction, MonoController>,
  conditionDeactivate?: ConditionHook<MonoAction, MonoController>,

  beforeAction?: BeforeActionCallback<MonoAction, MonoController>,
  afterAction? : AfterActionCallback<MonoAction, MonoController>,

  onKeydown?: (event: KeyboardEvent, context: MonoController) => void,

  onOutsideAction?: (context: MonoController) => void
}

export const DEFAULT_CONFIG: MonoConfig = {
  cooldown: 200,

  listenToKeydown: false,

  deactivateOnOutsideAction: true,

  itemsSelector: '.js-mono-item',
  items: undefined,

  classNameItemActive: 'js-mono-item--active',

  classNameJsActivate  : 'js-mono-item-activate',
  classNameJsDeactivate: 'js-mono-item-deactivate',
  classNameJsToggle    : 'js-mono-item-toggle',

  beforeActivate  : (action, context) => { return Promise.resolve() },
  beforeDeactivate: (action, context) => { return Promise.resolve() },

  afterActivate  : (action, context) => { return Promise.resolve() },
  afterDeactivate: (action, context) => { return Promise.resolve() },

  conditionActivate  : (action, context) => { return true },
  conditionDeactivate: (action, context) => { return true },

  beforeAction: (action, context) => { return Promise.resolve() },
  afterAction : (action, context) => { },

  onOutsideAction: (context) => { },

  onKeydown: (event, context) => { },
}

export const MONO_ACTION_CONFIG_MAP: ActionConfigMapEntries = [
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
]