import {
  SequenceAction,
  SequenceActionName,
  SequenceController,
} from './index'

import {
  EventEntry,
  Hook,
  ConditionHook,
  BeforeActionCallback,
  AfterActionCallback,
} from '../index'

export interface SequenceConfig {
  selectorItems?: string,

  classNameItemActive?: string,
  classNameJsPrevious?: string,
  classNameJsNext?: string,
  classNameJsJump?: string,

  beforeActivate?: Hook<SequenceAction>,
  beforeDeactivate?: Hook<SequenceAction>,

  afterActivate?: Hook<SequenceAction>,
  afterDeactivate?: Hook<SequenceAction>,

  conditionPrevious?: ConditionHook<SequenceAction>,
  conditionNext?: ConditionHook<SequenceAction>,
  conditionJump?: ConditionHook<SequenceAction>,

  beforeAction?: BeforeActionCallback<SequenceAction>,
  afterAction?: AfterActionCallback<SequenceAction>,
}

export const SEQUENCE_DEFAULT_CONFIG: SequenceConfig = {
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

export const SEQUENCE_EVENT_ENTRY_LIST: EventEntry[] = [
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