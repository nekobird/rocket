import {
  AfterActionCallback,
  BeforeActionCallback,
  ConditionHook,
  Hook,
} from '../index';

import {
  SequenceController,
} from './sequenceController';

import {
  SequenceAction,
  SequenceActionName,
} from './actionManager';

export interface SequenceTriggerMap {
  trigger: HTMLElement;
  action: SequenceActionName;
  payload?: string;
}

export interface SequenceConfig {
  cooldown: number;

  listenToKeydown: boolean;

  items?: HTMLElement[] | NodeListOf<HTMLElement>;

  isTrigger: (element: HTMLElement) => boolean;
  mapTriggerToAction: (trigger: HTMLElement) => SequenceTriggerMap | false;
  getIdFromItem: (item: HTMLElement) => string | false;

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

  items: undefined,

  isTrigger: element => element.classList.contains('js-sequence-item-trigger'),
  mapTriggerToAction: trigger => {
    if (trigger.dataset.action === 'previous') {
      return {
        trigger,
        action: 'previous',
      };
    } else if (trigger.dataset.action === 'next') {
      return {
        trigger,
        action: 'next',
      };
    } else if (trigger.dataset.action === 'jump') {
      return {
        trigger,
        action: 'jump',
        payload: trigger.dataset.target,
      };
    }
    return false;
  },
  getIdFromItem: item => typeof item.dataset.id === 'string' ? item.dataset.id : false,

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