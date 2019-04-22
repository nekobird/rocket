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

  listenToClickOutside?: boolean,
  listenToTouchOutside?: boolean,
  listenToKeydown?: boolean,

  selectorItems?: string,

  classNameItemActive?: string,
  classNameJsActivate?: string,
  classNameJsDeactivate?: string,
  classNameJsToggle?: string,

  beforeActivate?: Hook<MonoAction, MonoController>,
  beforeDeactivate?: Hook<MonoAction, MonoController>,

  afterActivate?: Hook<MonoAction, MonoController>,
  afterDeactivate?: Hook<MonoAction, MonoController>,

  conditionActivate?: ConditionHook<MonoAction, MonoController>,
  conditionDeactivate?: ConditionHook<MonoAction, MonoController>,

  beforeAction?: BeforeActionCallback<MonoAction, MonoController>,
  afterAction?: AfterActionCallback<MonoAction, MonoController>,

  onClickOutside?: ListenToHook<MouseEvent, MonoGroup, MonoController>,
  onTouchOutside?: ListenToHook<TouchEvent, MonoGroup, MonoController>,
  onKeydown?: ListenToHook<KeyboardEvent, MonoGroup, MonoController>,
}

export const MONO_DEFAULT_CONFIG: MonoConfig = {
  cooldown: 100,

  listenToClickOutside: false,
  listenToTouchOutside: false,
  listenToKeydown: false,

  selectorItems: '.item',

  classNameItemActive: '__active',
  classNameJsActivate: 'js_activate',
  classNameJsDeactivate: 'js_deactivate',
  classNameJsToggle: 'js_toggle',

  beforeActivate: (action, context) => { return Promise.resolve() },
  beforeDeactivate: (action, context) => { return Promise.resolve() },

  afterActivate: (action, context) => { return Promise.resolve() },
  afterDeactivate: (action, context) => { return Promise.resolve() },

  conditionActivate: (action, context) => { return true },
  conditionDeactivate: (action, context) => { return true },

  beforeAction: (action, context) => { return Promise.resolve() },
  afterAction: (action, context) => { },

  onClickOutside: (event, group, context) => { },
  onTouchOutside: (event, group, context) => { },
  onKeydown: (event, group, context) => { },
}

export const MONO_EVENT_ENTRY_LIST: EventEntry[] = [
  {
    name: 'activate',
    action: 'activate',
    target: 'jsActivate',
    event: ['click', 'touchstart'],
    listener: undefined,
  },
  {
    name: 'deactivate',
    action: 'deactivate',
    target: 'jsDeactivate',
    event: ['click', 'touchstart'],
    listener: undefined,
  },
  {
    name: 'toggle',
    action: 'toggle',
    target: 'jsToggle',
    event: ['click', 'touchstart'],
    listener: undefined,
  },
]