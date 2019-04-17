import { PolyController } from '../polyController'
import { Action } from './action'

export interface Hook {
  (
    action: Action,
    context?: PolyController,
  ): Promise<any>
}