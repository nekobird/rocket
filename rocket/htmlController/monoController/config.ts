import {
  AfterActionCallback,
  BeforeActionCallback,
  ConditionHook,
  Hook,
} from '../index';

import {
  MonoActionName,
  MonoAction,
} from './actionManager';

import {
  MonoController,
} from './monoController';

export interface MonoTriggerMap {
  trigger: HTMLElement;
  action: MonoActionName;
  payload?: string;
}

export interface MonoConfig {
  cooldown: number;

  listenToKeydown: boolean;
  deactivateOnOutsideAction: boolean;
  
  items?: HTMLElement[] | NodeListOf<HTMLElement>;

  isTrigger: (element: HTMLElement) => boolean;
  mapTriggerToAction: (trigger: HTMLElement) => MonoTriggerMap | false;
  getItemId: (item: HTMLElement) => string | false;

  conditionActivate: ConditionHook<MonoAction, MonoController>;
  conditionDeactivate: ConditionHook<MonoAction, MonoController>;

  beforeActivate: Hook<MonoAction, MonoController>;
  beforeDeactivate: Hook<MonoAction, MonoController>;

  itemIsActive: (item: HTMLElement, context: MonoController) => boolean;
  activateItem: (item: HTMLElement, context: MonoController) => void;
  deactivateItem: (item: HTMLElement, context: MonoController) => void;

  afterActivate: Hook<MonoAction, MonoController>;
  afterDeactivate: Hook<MonoAction, MonoController>;

  beforeAction: BeforeActionCallback<MonoAction, MonoController>;
  afterAction: AfterActionCallback<MonoAction, MonoController>;

  onKeydown: (event: KeyboardEvent, context: MonoController) => void;
  onOutsideAction: (context: MonoController) => void;
}

export const DEFAULT_CONFIG: MonoConfig = {
  cooldown: 200,

  listenToKeydown: false,
  deactivateOnOutsideAction: true,

  items: undefined,

  isTrigger: element => element.classList.contains('js-mono-item-trigger'),
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
    }
    return false;
  },
  getItemId: item => typeof item.dataset.id === 'string' ? item.dataset.id : false,

  conditionActivate: (action, context) => true,
  conditionDeactivate: (action, context) => true,

  beforeActivate: (action, context) => Promise.resolve(),
  beforeDeactivate: (action, context) => Promise.resolve(),

  itemIsActive: item => item.classList.contains('js-mono-item--active'),
  activateItem: (item: HTMLElement, context: MonoController) => {
    item.classList.add('js-mono-item--active');
  },
  deactivateItem: (item: HTMLElement, context: MonoController) => {
    item.classList.remove('js-mono-item--active');
  },

  afterActivate: (action, context) => Promise.resolve(),
  afterDeactivate: (action, context) => Promise.resolve(),

  beforeAction: (action, context) => Promise.resolve(),
  afterAction: (action, context) => {},

  onKeydown: (event, context) => {},
  onOutsideAction: (context) => {},
};
