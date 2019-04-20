import {
  MonoConfig,
  MonoActionName,
  MonoController,
  PolyConfig,
  PolyActionName,
  PolyController,
  SequenceActionName,
  SequenceController,
  SequenceConfig,
} from './index'

export type HTMLController = MonoController | PolyController | SequenceController

export type Config = MonoConfig | PolyConfig | SequenceConfig

export type ActionName = MonoActionName | PolyActionName | SequenceActionName

export interface Hook<Action> {
  (
    action: Action,
    context?: HTMLController,
  ): Promise<any>
}

export interface ConditionHook<Action> {
  (
    action: Action,
    context?: HTMLController,
  ): boolean
}

export interface BeforeActionCallback<Action> {
  (
    action: Action,
    context?: HTMLController,
  ): Promise<void>
}

export interface AfterActionCallback<Action> {
  (
    action: Action,
    context?: HTMLController,
  ): void
}

export interface ActionManager<A> {
  composeActionFromEvent: (actionName: ActionName, trigger: HTMLElement) => A,
  actionHub: (action: A, callback?: Function) => void,
}