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
  listenToClickOutside?: boolean,
  listenToTouchOutside?: boolean,
  listenToKeydown?: boolean,

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

  onClickOutside?: ListenToHook<MouseEvent, SequenceGroup, SequenceController>,
  onTouchOutside?: ListenToHook<TouchEvent, SequenceGroup, SequenceController>,
  onKeydown?: ListenToHook<KeyboardEvent, SequenceGroup, SequenceController>,
}

export const SEQUENCE_DEFAULT_CONFIG: SequenceConfig = {
  listenToClickOutside: false,
  listenToTouchOutside: false,
  listenToKeydown: false,

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

  onClickOutside: (event, group, context) => { },
  onTouchOutside: (event, group, context) => { },
  onKeydown: (event, group, context) => { },
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