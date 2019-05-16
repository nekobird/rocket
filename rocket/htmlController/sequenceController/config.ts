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
  SequenceController,
} from './sequenceController'

import {
  SequenceAction,
} from './actionManager'

export interface SequenceConfig {
  cooldown?: number,

  listenToKeydown?: boolean,

  itemsSelector?: string | undefined,
  items?: HTMLElement[] | NodeListOf<HTMLElement> | undefined,

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

  onKeydown?: (event: KeyboardEvent, context: SequenceController) => void,
}

export const DEFAULT_CONFIG: SequenceConfig = {
  cooldown: 100,

  listenToKeydown: false,

  itemsSelector: '.js-sequence-item',
  items: undefined,

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

  onKeydown: (event, context) => { },
}

export const SEQUENCE_ACTION_CONFIG_MAP: ActionConfigMapEntries = [
  {
    configProperty: 'classNameJsPrevious',
    action: 'previous',
  },
  {
    configProperty: 'classNameJsNext',
    action: 'next',
  },
  {
    configProperty: 'classNameJsJump',
    action: 'jump',
  },
]