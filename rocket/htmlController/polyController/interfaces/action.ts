import { ActionName } from '../types'
import { Group } from './group'

export interface Action {
  name?: ActionName,

  groupName: string,
  group?: Group,

  targetId?: string,
  targetItem?: HTMLElement,

  trigger?: HTMLElement,
}
