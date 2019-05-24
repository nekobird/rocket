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
  MonoAction,
} from './actionManager';

import {
  MonoController,
} from './monoController';

export interface MonoConfig {
  cooldown: number;

  listenToKeydown: boolean;
  deactivateOnOutsideAction: boolean;
  
  itemsSelector: string;
  items: HTMLElement[] | NodeListOf<HTMLElement> | undefined;

  classNameJsActivate: string;
  classNameJsDeactivate: string;
  classNameJsToggle: string;

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

  itemsSelector: '.js-mono-item',
  items: undefined,

  classNameJsActivate: 'js-mono-item-activate',
  classNameJsDeactivate: 'js-mono-item-deactivate',
  classNameJsToggle: 'js-mono-item-toggle',

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

export const MONO_ACTION_CONFIG_MAP: ActionConfigMapEntries = [
  {
    configProperty: 'classNameJsActivate',
    action: 'activate',
  },
  {
    configProperty: 'classNameJsDeactivate',
    action: 'deactivate',
  },
  {
    configProperty: 'classNameJsToggle',
    action: 'toggle',
  },
];