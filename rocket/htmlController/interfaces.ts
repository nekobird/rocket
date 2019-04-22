import {
  MonoAction,
  MonoActionName,
  MonoConfig,
  MonoController,
  PolyAction,
  PolyActionName,
  PolyConfig,
  PolyController,
  SequenceAction,
  SequenceActionName,
  SequenceConfig,
  SequenceController,
} from './index'

export type HTMLController = MonoController | PolyController | SequenceController

export type Config = MonoConfig | PolyConfig | SequenceConfig

export type ActionName = MonoActionName | PolyActionName | SequenceActionName
export type Action = MonoAction | PolyAction | SequenceAction

export interface Hook<A, C> {
  (
    action: A,
    context?: C,
  ): Promise<void>
}

export interface ConditionHook<A, C> {
  (
    action: A,
    context?: C,
  ): boolean
}

export interface BeforeActionCallback<A, C> {
  (
    action: A,
    context?: C,
  ): Promise<void>
}

export interface AfterActionCallback<A, C> {
  (
    action: A,
    context?: C,
  ): void
}

export interface ListenToHook<E, G, C> {
  (
    event: E,
    group: G,
    context: C,
  ): void
}

export interface ActionManager {
  composeActionFromEvent: (actionName: ActionName, trigger: HTMLElement) => Action,
  actionHub: (action: Action, isNestedAction: boolean, callback?: Function) => void,
}