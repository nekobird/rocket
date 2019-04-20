import {
  MonoConfig,
  MonoActionName,
  MonoAction,
  MonoController,
  PolyConfig,
  PolyActionName,
  PolyAction,
  PolyController,
  SequenceActionName,
  SequenceAction,
  SequenceController,
  SequenceConfig,
} from './index'

export type HTMLController = MonoController | PolyController | SequenceController

export type Config = MonoConfig | PolyConfig | SequenceConfig

export type ActionName = MonoActionName | PolyActionName | SequenceActionName
export type Action = MonoAction | PolyAction | SequenceAction

export interface Hook<A> {
  (
    action: A,
    context?: HTMLController,
  ): Promise<any>
}

export interface ConditionHook<A> {
  (
    action: A,
    context?: HTMLController,
  ): boolean
}

export interface BeforeActionCallback<A> {
  (
    action: A,
    context?: HTMLController,
  ): Promise<void>
}

export interface AfterActionCallback<A> {
  (
    action: A,
    context?: HTMLController,
  ): void
}

export interface ActionManager<A, AN> {
  composeActionFromEvent: (actionName: AN, trigger: HTMLElement) => Action,
  actionHub: (action: A, callback?: Function) => void,
}