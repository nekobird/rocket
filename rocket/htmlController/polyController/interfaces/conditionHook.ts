import { PolyController } from '../polyController'
import { Action } from './action'

export interface ConditionHook {
  (
    action: Action,
    context?: PolyController,
  ): boolean
}