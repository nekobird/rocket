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

  items: NodeListOf<HTMLElement> | HTMLElement[];

  isTrigger: (element: HTMLElement) => boolean;
  mapTriggerToAction: (trigger: HTMLElement) => SequenceTriggerMap | false;
  getItemId: (item: HTMLElement) => string | false;

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

  items: [],

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
  getItemId: item => typeof item.dataset.id === 'string' ? item.dataset.id : false,

  conditionPrevious: () => true,
  conditionNext: () => true,
  conditionJump: () => true,

  beforeDeactivate: () => Promise.resolve(),
  beforeActivate: () => Promise.resolve(),

  itemIsActive: item => item.classList.contains('js-sequence-item--active'),
  activateItem: item => item.classList.add('js-sequence-item--active'),
  deactivateItem: item => item.classList.remove('js-sequence-item--active'),

  afterDeactivate: () => Promise.resolve(),
  afterActivate: () => Promise.resolve(),

  beforeAction: () => Promise.resolve(),
  afterAction: () => {},

  onKeydown: () => {},
};
