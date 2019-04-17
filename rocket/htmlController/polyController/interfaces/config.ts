import { Hook } from './hook'
import { ConditionHook } from './conditionHook'
import { BeforeActionCallback } from './beforeActionCallback'
import { AfterActionCallback } from './afterActionCallback'
import { ListenToHook } from './listenToHook'

export interface Config {
  listenTo_clickOutside?: boolean,
  listenTo_keydown?: boolean,

  selector_item?: string,

  className_active?: string,
  className_js_activate?: string,
  className_js_deactivate?: string,
  className_js_toggle?: string,
  className_js_activateAll?: string,
  className_js_deactivateAll?: string,
  className_js_toggleAll?: string,

  condition_activate?: ConditionHook,
  condition_deactivate?: ConditionHook,
  condition_toggle?: ConditionHook,
  condition_activateAll?: ConditionHook,
  condition_deactivateAll?: ConditionHook,
  condition_toggleAll?: ConditionHook,

  before_activate?: Hook,
  before_deactivate?: Hook,
  after_activate?: Hook,
  after_deactivate?: Hook,

  before_action?: BeforeActionCallback,
  after_action?: AfterActionCallback,

  onClickOutside?: ListenToHook,
  onKeydown?: ListenToHook,
}