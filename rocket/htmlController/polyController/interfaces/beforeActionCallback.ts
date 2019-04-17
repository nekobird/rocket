import { PolyController } from '../polyController'
import { Action } from './action'

export interface BeforeActionCallback {
  (
    action: Action,
    context?: PolyController,
  ): Promise<any>
}