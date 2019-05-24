import {
  AfterActionCallback,
  BeforeActionCallback,
  ConditionHook,
} from '../index';

import {
  PolyController,
} from './polyController';

import {
  PolyAction,
  PolyActionName,
} from './actionManager';

export interface PolyTriggerMap {
  trigger: HTMLElement;
  action: PolyActionName;
  payload?: string;
}

export interface PolyConfig {
  cooldown: number;

  deactivateAllOnOutsideAction: boolean;

  listenToKeydown: boolean;

  items?: HTMLElement[] | NodeListOf<HTMLElement>;

  isTrigger: (element: HTMLElement) => boolean;
  mapTriggerToAction: (trigger: HTMLElement) => PolyTriggerMap | false;
  getItemId: (item: HTMLElement) => string | false;

  conditionActivate: ConditionHook<PolyAction, PolyController>;
  conditionDeactivate: ConditionHook<PolyAction, PolyController>;
  conditionToggle: ConditionHook<PolyAction, PolyController>;

  conditionActivateAll: ConditionHook<PolyAction, PolyController>;
  conditionDeactivateAll: ConditionHook<PolyAction, PolyController>;
  conditionToggleAll: ConditionHook<PolyAction, PolyController>;

  beforeDeactivate: BeforeActionCallback<PolyAction, PolyController>;
  afterDeactivate: AfterActionCallback<PolyAction, PolyController>;

  itemIsActive: (item: HTMLElement, context: PolyController) => boolean;
  activateItem: (item: HTMLElement, context: PolyController) => void;
  deactivateItem: (item: HTMLElement, context: PolyController) => void;

  beforeActivate: BeforeActionCallback<PolyAction, PolyController>;
  afterActivate: AfterActionCallback<PolyAction, PolyController>;

  beforeAction: BeforeActionCallback<PolyAction, PolyController>;
  afterAction: AfterActionCallback<PolyAction, PolyController>;

  onOutsideAction: (context: PolyController) => void;

  onKeydown: (event: KeyboardEvent, context: PolyController) => void;
}

export const DEFAULT_CONFIG: PolyConfig = {
  cooldown: 200,

  deactivateAllOnOutsideAction: false,
  listenToKeydown: false,

  items: undefined,

  isTrigger: element => element.classList.contains('js-poly-item-trigger'),
  mapTriggerToAction: trigger => {
    if (trigger.dataset.action === 'activate') {
      return {
        trigger,
        action: 'activate',
        payload: trigger.dataset.target,
      };
    } else if (trigger.dataset.action === 'deactivate') {
      return {
        trigger,
        action: 'deactivate',
      };
    } else if (trigger.dataset.action === 'toggle') {
      return {
        trigger,
        action: 'toggle',
        payload: trigger.dataset.target,
      };
    } else if (trigger.dataset.action === 'activate-all') {
      return {
        trigger,
        action: 'activate-all',
      };
    } else if (trigger.dataset.action === 'deactivate-all') {
      return {
        trigger,
        action: 'deactivate-all',
      };
    } else if (trigger.dataset.action === 'toggle-all') {
      return {
        trigger,
        action: 'toggle-all',
      };
    }
    return false;
  },
  getItemId: item => typeof item.dataset.id === 'string' ? item.dataset.id : false,

  conditionActivate: (action, context) => true,
  conditionDeactivate: (action, context) => true,
  conditionToggle: (action, context) => true,

  conditionActivateAll: (action, context) => true,
  conditionDeactivateAll: (action, context) => true,
  conditionToggleAll: (action, context) => true,

  beforeDeactivate: (action, context) => Promise.resolve(),
  afterDeactivate: (action, context) => Promise.resolve(),

  itemIsActive: item => item.classList.contains('js-poly-item--active'),
  activateItem: item => item.classList.add('js-poly-item--active'),
  deactivateItem: item => item.classList.remove('js-poly-item--active'),

  beforeActivate: (action, context) => Promise.resolve(),
  afterActivate: (action, context) => Promise.resolve(),

  beforeAction: (action, context) => Promise.resolve(),
  afterAction: (action, context) => Promise.resolve(),
  
  onOutsideAction: (context) => {},
  onKeydown: (event, context) => {},
};
