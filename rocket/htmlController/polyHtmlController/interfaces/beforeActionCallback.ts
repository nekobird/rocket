import { PolyHTMLController } from '../polyHTMLController'
import { Action } from './action'

export interface BeforeActionCallback {
  (
    action: Action,
    context?: PolyHTMLController,
  ): Promise<any>
}