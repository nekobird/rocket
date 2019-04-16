import { PolyHTMLController } from '../polyHTMLController'
import { Action } from './action'

export interface ConditionHook {
  (
    action: Action,
    context?: PolyHTMLController,
  ): boolean
}