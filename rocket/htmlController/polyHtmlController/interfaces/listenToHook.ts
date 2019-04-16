import { PolyHTMLController } from '../polyHTMLController'
import { Group } from './group'

export interface ListenToHook {
  (
    event: Event,
    group: Group,
    context: PolyHTMLController
  ): void
}