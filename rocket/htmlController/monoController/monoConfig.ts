import {
  AfterActionCallback,
  BeforeActionCallback,
  ConditionHook,
  EventEntry,
  Hook,
  ListenToHook,
  MonoAction,
  MonoController,
  MonoGroup,
} from '../index'

export interface MonoConfig {
  cooldown?: number,

  closeOnOutsideAction?: boolean,
  listenToKeydown?: boolean,

  selectorItems?: string,

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

  onOutsideAction?: ListenToHook<MouseEvent, MonoGroup, MonoController>,
  onKeydown?      : ListenToHook<KeyboardEvent, MonoGroup, MonoController>,
}

export const MONO_DEFAULT_CONFIG: MonoConfig = {
  cooldown: 200,

  closeOnOutsideAction: true,
  listenToKeydown: false,

  selectorItems: '.js-mono-item',

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

  onOutsideAction: (event, group, context) => { },
  onKeydown     : (event, group, context) => { },
}

export const MONO_EVENT_ENTRY_LIST: EventEntry[] = [
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
]