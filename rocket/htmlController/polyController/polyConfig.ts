import {
  PolyAction,
  EventEntry,
  PolyGroup,
  PolyController,
  Hook,
  ConditionHook,
  BeforeActionCallback,
  AfterActionCallback,
  PolyActionName,
} from '../index';

// INTERFACE

export interface PolyConfig {
  listenToClickOutside?: false,
  listenToTouchOutside?: false,
  listenToKeydown?: false,

  selectorItems?: string,

  classNameItemActive?: string,
  classNameJsActivate?: string,
  classNameJsDeactivate?: string,
  classNameJsToggle?: string,
  classNameJsActivateAll?: string,
  classNameJsDeactivateAll?: string,
  classNameJsToggleAll?: string,

  conditionActivate?: ConditionHook<PolyAction>,
  conditionDeactivate?: ConditionHook<PolyAction>,
  conditionToggle?: ConditionHook<PolyAction>,

  conditionActivateAll?: ConditionHook<PolyAction>,
  conditionDeactivateAll?: ConditionHook<PolyAction>,
  conditionToggleAll?: ConditionHook<PolyAction>,

  beforeDeactivate?: BeforeActionCallback<PolyAction>,
  afterDeactivate?: AfterActionCallback<PolyAction>,

  beforeActivate?: BeforeActionCallback<PolyAction>,
  afterActivate?: AfterActionCallback<PolyAction>,

  beforeAction?: BeforeActionCallback<PolyAction>,
  afterAction?: AfterActionCallback<PolyAction>,

  onClickOutside?: (event: MouseEvent, group: PolyGroup, context: PolyController) => void,
  onTouchOutside?: (event: TouchEvent, group: PolyGroup, context: PolyController) => void,
  onKeydown?: (event: KeyboardEvent, group: PolyGroup, context: PolyController) => void,
}

export const POLY_EVENT_ENTRY_LIST: EventEntry<PolyActionName>[] = [
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

export const POLY_DEFAULT_CONFIG: PolyConfig = {
  listenToClickOutside: false,
  listenToTouchOutside: false,
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

  onClickOutside: (event, group, context) => { },
  onTouchOutside: (event, group, context) => { },
  onKeydown: (event, group, context) => { },
}