import {
  AfterActionCallback,
  BeforeActionCallback,
  ConditionHook,
  EventEntry,
  Hook,
  MonoAction,
  MonoActionName,
} from '../index'

export interface MonoConfig {
  selectorItems?: string,

  classNameItemActive?: string,
  classNameJsActivate?: string,
  classNameJsDeactivate?: string,

  beforeActivate?: Hook<MonoAction>,
  beforeDeactivate?: Hook<MonoAction>,

  afterActivate?: Hook<MonoAction>,
  afterDeactivate?: Hook<MonoAction>,

  conditionActivate?: ConditionHook<MonoAction>,
  conditionDeactivate?: ConditionHook<MonoAction>,

  beforeAction?: BeforeActionCallback<MonoAction>,
  afterAction?: AfterActionCallback<MonoAction>,
}

export const MONO_DEFAULT_CONFIG: MonoConfig = {
  selectorItems: '.item',

  classNameItemActive: '__active',
  classNameJsActivate: 'js_activate',
  classNameJsDeactivate: 'js_deactivate',

  beforeActivate: (action, context) => { return Promise.resolve() },
  beforeDeactivate: (action, context) => { return Promise.resolve() },

  afterActivate: (action, context) => { return Promise.resolve() },
  afterDeactivate: (action, context) => { return Promise.resolve() },

  conditionActivate: (action, context) => { return true },
  conditionDeactivate: (action, context) => { return true },

  beforeAction: (action, context) => { return Promise.resolve() },
  afterAction: (action, context) => { },
}

export const MONO_EVENT_ENTRY_LIST: EventEntry<MonoActionName>[] = [
  {
    name: 'activate',
    action: 'activate',
    target: 'jsActivate',
    event: ['click', 'touch'],
    listener: undefined,
  },
  {
    name: 'deactivate',
    action: 'deactivate',
    target: 'jsDeactivate',
    event: ['click', 'touch'],
    listener: undefined,
  },
]