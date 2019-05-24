import {
  AfterActionCallback,
  BeforeActionCallback,
  ConditionHook,
  Hook,
} from '../index';

import {
  ActionConfigMapEntries,
} from './eventManager';

import {
  SequenceController,
} from './sequenceController';

import {
  SequenceAction,
} from './actionManager';

export interface SequenceConfig {
  cooldown: number;

  listenToKeydown: boolean;

  itemsSelector: string | undefined;
  items: HTMLElement[] | NodeListOf<HTMLElement> | undefined;

  classNameJsPrevious: string;
  classNameJsNext: string;
  classNameJsJump: string;

  conditionPrevious: ConditionHook<SequenceAction, SequenceController>;
  conditionNext: ConditionHook<SequenceAction, SequenceController>;
  conditionJump: ConditionHook<SequenceAction, SequenceController>;

  beforeActivate: Hook<SequenceAction, SequenceController>;
  beforeDeactivate: Hook<SequenceAction, SequenceController>;

  itemIsActive: (item: HTMLElement, controller: SequenceController) => boolean;
  activateItem: (item: HTMLElement, controller: SequenceController) => void;
  deactivateItem: (item: HTMLElement, controller: SequenceController) => void;

  afterActivate: Hook<SequenceAction, SequenceController>;
  afterDeactivate: Hook<SequenceAction, SequenceController>;

  beforeAction: BeforeActionCallback<SequenceAction, SequenceController>;
  afterAction: AfterActionCallback<SequenceAction, SequenceController>;

  onKeydown: (event: KeyboardEvent, context: SequenceController) => void;
}

export const DEFAULT_CONFIG: SequenceConfig = {
  cooldown: 100,

  listenToKeydown: false,

  itemsSelector: '.js-sequence-item',
  items: undefined,

  classNameJsPrevious: 'js-sequence-item-previous',
  classNameJsNext: 'js-sequence-item-next',
  classNameJsJump: 'js-sequence-item-jump',

  conditionPrevious: (action, context) => true,
  conditionNext: (action, context) => true,
  conditionJump: (action, context) => true,

  beforeDeactivate: (action, context) => Promise.resolve(),
  beforeActivate: (action, context) => Promise.resolve(),

  itemIsActive: item => item.classList.contains('js-sequence-item--active'),
  activateItem: item => item.classList.add('js-sequence-item--active'),
  deactivateItem: item => item.classList.remove('js-sequence-item--active'),

  afterDeactivate: (action, context) => Promise.resolve(),
  afterActivate: (action, context) => Promise.resolve(),

  beforeAction: (action, context) => Promise.resolve(),
  afterAction: (action, context) => {},

  onKeydown: (event, context) => {},
};

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
];