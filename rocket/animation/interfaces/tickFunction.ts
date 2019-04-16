export interface AnimationTickFunction {
  (n: number, context: Animation, data?: any): void
}