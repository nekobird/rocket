import {
  SequenceAction,
} from './index'

import {
  AfterActionCallback,
  BeforeActionCallback,
  ConditionHook,
  EventEntry,
  Hook,
  ListenToHook,
  SequenceController,
  SequenceGroup,
} from '../index'

export interface SequenceConfig {
  cooldown?: number,

  listenToKeydown?: boolean,

  selectorItems?: string,

  classNameItemActive?: string,
  classNameJsPrevious?: string,
  classNameJsNext?: string,
  classNameJsJump?: string,

  beforeActivate?  : Hook<SequenceAction, SequenceController>,
  beforeDeactivate?: Hook<SequenceAction, SequenceController>,

  afterActivate?  : Hook<SequenceAction, SequenceController>,
  afterDeactivate?: Hook<SequenceAction, SequenceController>,

  conditionPrevious?: ConditionHook<SequenceAction, SequenceController>,
  conditionNext?    : ConditionHook<SequenceAction, SequenceController>,
  conditionJump?    : ConditionHook<SequenceAction, SequenceController>,

  beforeAction?: BeforeActionCallback<SequenceAction, SequenceController>,
  afterAction? : AfterActionCallback<SequenceAction, SequenceController>,

  onKeydown?: ListenToHook<KeyboardEvent, SequenceGroup, SequenceController>,
}

export const SEQUENCE_DEFAULT_CONFIG: SequenceConfig = {
  cooldown: 100,

  listenToKeydown: false,

  selectorItems: '.js-sequence-item',

  classNameItemActive: 'js-sequence-item--active',
  classNameJsPrevious: 'js-sequence-item-previous',
  classNameJsNext    : 'js-sequence-item-next',
  classNameJsJump    : 'js-sequence-item-jump',

  beforeDeactivate: (action, context) => { return Promise.resolve() },
  beforeActivate  : (action, context) => { return Promise.resolve() },
  afterDeactivate : (action, context) => { return Promise.resolve() },
  afterActivate   : (action, context) => { return Promise.resolve() },

  conditionPrevious: (action, context) => { return true },
  conditionNext    : (action, context) => { return true },
  conditionJump    : (action, context) => { return true },

  beforeAction: (action, context) => { return Promise.resolve() },
  afterAction : (action, context) => { },

  onKeydown: (event, group, context) => { },
}

export const SEQUENCE_EVENT_ENTRY_LIST: EventEntry[] = [
  {
    name    : 'previous',
    action  : 'previous',
    target  : 'jsPrevious',
    event   : ['click', 'touch'],
    listener: undefined,
  },
  {
    name    : 'next',
    action  : 'next',
    target  : 'jsNext',
    event   : ['click', 'touch'],
    listener: undefined,
  },
  {
    name    : 'jump',
    action  : 'jump',
    target  : 'jsJump',
    event   : ['click', 'touch'],
    listener: undefined,
  },
]