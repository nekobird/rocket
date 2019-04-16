import { PolyHTMLController } from '../polyHTMLController'
import { Action } from './action'

export interface Hook {
  (
    action: Action,
    context?: PolyHTMLController,
  ): Promise<any>
}