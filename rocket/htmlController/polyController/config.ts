import {
  PolyController
} from '../../rocket';

import {
  Group
} from './groupManager';

import {
  Action
} from './actionManager'

import {
  EventEntry
} from './eventManager';

// INTERFACE
export interface BeforeActionCallback {
  (
    action: Action,
    context?: PolyController,
  ): Promise<any>
}

export interface AfterActionCallback {
  (
    action: Action,
    context?: PolyController,
  ): void
}

export interface Hook {
  (
    action: Action,
    context?: PolyController,
  ): Promise<any>
}

export interface ConditionHook {
  (
    action: Action,
    context?: PolyController,
  ): boolean
}

export interface ListenToHook {
  (
    event: Event,
    group: Group,
    context: PolyController,
  ): void
}

export interface Config {
  listenToClickOutside?: false,
  listenToKeydown?: false,

  selectorItems?: string,

  classNameItemActive?: string,
  classNameJsActivate?: string,
  classNameJsDeactivate?: string,
  classNameJsToggle?: string,
  classNameJsActivateAll?: string,
  classNameJsDeactivateAll?: string,
  classNameJsToggleAll?: string,

  conditionActivate?: ConditionHook,
  conditionDeactivate?: ConditionHook,
  conditionToggle?: ConditionHook,

  conditionActivateAll?: ConditionHook,
  conditionDeactivateAll?: ConditionHook,
  conditionToggleAll?: ConditionHook,

  beforeDeactivate?: BeforeActionCallback,
  afterDeactivate?: AfterActionCallback,

  beforeActivate?: BeforeActionCallback,
  afterActivate?: AfterActionCallback,

  beforeAction?: BeforeActionCallback,
  afterAction?: AfterActionCallback,
}

export const EVENT_ENTRY_LIST: EventEntry[] = [
  {
    name: 'activate',
    action: 'activate',
    target: 'jsActivate',
    event: ['click', 'touch'],
    listener: undefined,
  },
  {
    name: 'deactivate',
    action: 'deactivate',
    target: 'jsDeactivate',
    event: ['click', 'touch'],
    listener: undefined,
  },
  {
    name: 'toggle',
    action: 'toggle',
    target: 'jsToggle',
    event: ['click', 'touch'],
    listener: undefined,
  },
  {
    name: 'activateAll',
    action: 'activateAll',
    target: 'jsActivateAll',
    event: ['click', 'touch'],
    listener: undefined,
  },
  {
    name: 'deactivateAll',
    action: 'deactivateAll',
    target: 'jsDeactivateAll',
    event: ['click', 'touch'],
    listener: undefined,
  },
  {
    name: 'toggleAll',
    action: 'toggleAll',
    target: 'jsToggleAll',
    event: ['click', 'touch'],
    listener: undefined,
  },
]

export const DEFAULT_CONFIG: Config = {
  listenToClickOutside: false,
  listenToKeydown: false,

  selectorItems: '.item',

  classNameItemActive: '__active',
  classNameJsActivate: 'js_activate',
  classNameJsDeactivate: 'js_deactivate',
  classNameJsToggle: 'js_toggle',
  classNameJsActivateAll: 'js_activateAll',
  classNameJsDeactivateAll: 'js_deactivateAll',
  classNameJsToggleAll: 'js_toggleAll',


  conditionActivate: (action, context) => { return true },
  conditionDeactivate: (action, context) => { return true },
  conditionToggle: (action, context) => { return true },
  conditionActivateAll: (action, context) => { return true },
  conditionDeactivateAll: (action, context) => { return true },
  conditionToggleAll: (action, context) => { return true },

  beforeDeactivate: (action, context) => { return Promise.resolve() },
  afterDeactivate: (action, context) => { return Promise.resolve() },

  beforeActivate: (action, context) => { return Promise.resolve() },
  afterActivate: (action, context) => { return Promise.resolve() },

  beforeAction: (action, context) => { return Promise.resolve() },
  afterAction: (action, context) => { return Promise.resolve() },

  // onClickOutside: (event, group, context) => { },
  // onKeydown: (event, group, context) => { },
}