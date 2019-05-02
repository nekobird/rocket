import {
  StringUtil,
  KeyboardEventManagerActionName,
  KeyboardEventManagerAction,
  KeyboardEventManager,
} from './../rocket'

// The *Down happens first,
// the *Press happens second (when text is entered), 
// and the *Up happens last (when text input is complete).

interface KeyboardEventHandlerConditionHook {
  (
    action: KeyboardEventManagerAction
  ): boolean
}

export interface KeyboardEventHandlerConfig {
  conditionKeydown?: KeyboardEventHandlerConditionHook,
  conditionKeyup?: KeyboardEventHandlerConditionHook,
  conditionKeypress?: KeyboardEventHandlerConditionHook,

  onKeydown?: KeyboardEventHandlerHook | KeyboardEventHandlerHook[],
  onKeyup?: KeyboardEventHandlerHook | KeyboardEventHandlerHook[],
  onKeypress?: KeyboardEventHandlerHook | KeyboardEventHandlerHook[],
}

export interface KeyboardEventHandlerHook {
  (
    action: KeyboardEventManagerAction
  ): void
}

export class KeyboardEventHandler {

  public name: string
  public manager: KeyboardEventManager

  // CONDITION
  public conditionKeydown: KeyboardEventHandlerConditionHook = () => { return true }
  public conditionKeyup: KeyboardEventHandlerConditionHook = () => { return true }
  public conditionKeypress: KeyboardEventHandlerConditionHook = () => { return true }

  // CALLBACK
  public onKeydown: KeyboardEventHandlerHook | KeyboardEventHandlerHook[] = () => { }
  public onKeyup: KeyboardEventHandlerHook | KeyboardEventHandlerHook[] = () => { }
  public onKeypress: KeyboardEventHandlerHook | KeyboardEventHandlerHook[] = () => { }

  constructor(config?: KeyboardEventHandlerConfig) {
    if (typeof config === 'object') {
      this.config = config
    }
  }

  set config(config: KeyboardEventHandlerConfig) {
    Object.assign(this, config)
  }

  // HANDLE

  public handleKeydown(action: KeyboardEventManagerAction): this {
    this.callHook('keydown', action)
    return this
  }

  public handleKeyup(action: KeyboardEventManagerAction): this {
    this.callHook('keyup', action)
    return this
  }

  public handleKeypress(action: KeyboardEventManagerAction): this {
    this.callHook('keypress', action)
    return this
  }

  private callHook(handleName: KeyboardEventManagerActionName, action: KeyboardEventManagerAction) {
    const handleNameString: string = StringUtil.upperCaseFirstLetter(handleName)
    if (this[`condition${handleNameString}`](action) === true) {
      if (typeof this[`on${handleNameString}`] === 'function') {
        this[`on${handleNameString}`](action)
      } else if (Array.isArray(this[`on${handleNameString}`]) === true) {
        this[`on${handleNameString}`].forEach(callback => { callback(action) })
      }
    }
  }

}