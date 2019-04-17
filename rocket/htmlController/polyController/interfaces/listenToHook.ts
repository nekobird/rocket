import { PolyController } from '../polyController'
import { Group } from './group'

export interface ListenToHook {
  (
    event: Event,
    group: Group,
    context: PolyController,
  ): void
}