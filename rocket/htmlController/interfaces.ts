export interface Hook<A, C> {
  (
    action: A,
    context?: C
  ): Promise<void>;
}

export interface ConditionHook<A, C> {
  (
    action: A,
    context?: C
  ): boolean;
}

export interface BeforeActionCallback<A, C> {
  (
    action: A,
    context?: C
  ): Promise<void>;
}

export interface AfterActionCallback<A, C> {
  (
    action: A,
    context?: C
  ): void;
}

export interface ListenToHook<E, G, C> {
  (
    event: E,
    group: G,
    context: C
  ): void;
}

export interface OutsideActionHook<G, C> {
  (
    group: G,
    context: C
  ): void;
}