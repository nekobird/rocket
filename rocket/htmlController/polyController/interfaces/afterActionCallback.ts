import { PolyController } from '../polyController'
import { Action } from './action'

export interface AfterActionCallback {
  (
    action: Action,
    context?: PolyController,
  ): void
}