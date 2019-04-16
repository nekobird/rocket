import { PolyHTMLController } from '../polyHTMLController'
import { Action } from './action'

export interface AfterActionCallback {
  (
    action: Action,
    context?: PolyHTMLController,
  ): void
}