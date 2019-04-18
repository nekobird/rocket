import {
  AfterActionCallback,
  BeforeActionCallback,
  ConditionHook,
  Hook,
  ListenToHook,
} from './interfaces/index'

import {
  PolyController
} from './polyController';

export interface Config {
  listenToClickOutside: false,
  listenToKeydown: false,
  selector: {
    items: string
  },
  className: {
    itemActive: string,
    jsActivate: string,
    jsDeactivate: string,
    jsToggle: string,
    jsActivateAll: string,
    jsDeactivateAll: string,
    jsToggleAll: string,
  },
  conditionActivate: ConditionHook,
  conditionDeactivate: ConditionHook,
  conditionToggle: ConditionHook,
  conditionActivateAll: ConditionHook,
  conditionDeactivateAll: ConditionHook,
  conditionToggleAll: ConditionHook,
  beforeActivate: BeforeActionCallback,
  afterActivate: AfterActionCallback,
  beforeDeactivate: BeforeActionCallback,
  afterDeactivate: AfterActionCallback,
  beforeAction: BeforeActionCallback,
  afterAction: AfterActionCallback,
}

// Add maps here...

export const map = {
  'items': this.config.selector.items,
  'jsActivate': `.${this.config.className.jsActivate}`,
  'jsDeactivate': `.${this.config.className.jsDeactivate}`,
  'jsToggle': `.${this.config.className.jsToggle}`,
  'jsActivateAll': `.${this.config.className.jsActivateAll}`,
  'jsDeactivateAll': `.${this.config.className.jsDeactivateAll}`,
  'jsToggleAll': `.${this.config.className.jsToggleAll}`,
}

export const mapActionToEvent = {
  jsActivate: ['click', 'touch'],
  jsDeactivate: ['click', 'touch'],
  jsToggle: ['click', 'touch'],
  jsActivateAll: ['click', 'touch'],
  jsDeactivateAll: ['click', 'touch'],
  jsToggleAll: ['click', 'touch'],
}

export const DEFAULT_CONFIG: Config = {
  listenToClickOutside: false,
  listenToKeydown: false,

  selector: {
    items: '.item',
  },

  className: {
    itemActive: '__active',
    jsActivate: 'js_activate',
    jsDeactivate: 'js_deactivate',
    jsToggle: 'js_toggle',
    jsActivateAll: 'js_activateAll',
    jsDeactivateAll: 'js_deactivateAll',
    jsToggleAll: 'js_toggleAll',
  },

  conditionActivate: (action, context) => {
    return true
  },
  conditionDeactivate: (action, context) => {
    return true
  },
  conditionToggle: (action, context) => {
    return true
  },
  conditionActivateAll: (action, context) => {
    return true
  },
  conditionDeactivateAll: (action, context) => {
    return true
  },
  conditionToggleAll: (action, context) => {
    return true
  },

  beforeActivate: (action, context) => {
    return new Promise(resolve => {
      resolve()
    })
  },
  afterActivate: (action, context) => {
    return new Promise(resolve => {
      resolve()
    })
  },
  beforeDeactivate: (action, context) => {
    return new Promise(resolve => {
      resolve()
    })
  },
  afterDeactivate: (action, context) => {
    return new Promise(resolve => {
      resolve()
    })
  },

  beforeAction: (action, context) => { return Promise.resolve() },
  afterAction: (action, context) => { },

  // onClickOutside: (event, group, context) => { },
  // onKeydown: (event, group, context) => { },
}