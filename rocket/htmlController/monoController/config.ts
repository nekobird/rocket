import {
  Action,
  EventEntry,
  SequenceController,
} from './index'

export interface Hook {
  (
    action: Action,
    context?: SequenceController,
  ): Promise<any>
}

export interface ConditionHook {
  (
    action: Action,
    context?: SequenceController,
  ): boolean
}

export interface BeforeActionCallback {
  (
    action: Action,
    context?: SequenceController,
  ): Promise<any>
}

export interface AfterActionCallback {
  (
    action: Action,
    context?: SequenceController,
  ): void
}

export interface Config {
  selectorItems?: string,

  classNameItemActive?: string,
  classNameJsPrevious?: string,
  classNameJsNext?: string,
  classNameJsJump?: string,

  beforeActivate?: Hook,
  beforeDeactivate?: Hook,

  afterActivate?: Hook,
  afterDeactivate?: Hook,

  conditionPrevious?: ConditionHook,
  conditionNext?: ConditionHook,
  conditionJump?: ConditionHook,

  beforeAction?: BeforeActionCallback,
  afterAction?: AfterActionCallback,
}

export const DEFAULT_CONFIG: Config = {
  selectorItems: '.item',

  classNameItemActive: '__active',
  classNameJsPrevious: 'js_previous',
  classNameJsNext: 'js_next',
  classNameJsJump: 'js_jump',

  beforeDeactivate: (action, context) => { return Promise.resolve() },
  beforeActivate: (action, context) => { return Promise.resolve() },
  afterDeactivate: (action, context) => { return Promise.resolve() },
  afterActivate: (action, context) => { return Promise.resolve() },

  conditionPrevious: (action, context) => { return true },
  conditionNext: (action, context) => { return true },
  conditionJump: (action, context) => { return true },

  beforeAction: (action, context) => { return Promise.resolve() },
  afterAction: (action, context) => { },
}

export const EVENT_ENTRY_LIST: EventEntry[] = [
  {
    name: 'previous',
    action: 'previous',
    target: 'jsPrevious',
    event: ['click', 'touch'],
    listener: undefined,
  },
  {
    name: 'next',
    action: 'next',
    target: 'jsNext',
    event: ['click', 'touch'],
    listener: undefined,
  },
  {
    name: 'jump',
    action: 'jump',
    target: 'jsJump',
    event: ['click', 'touch'],
    listener: undefined,
  },
]