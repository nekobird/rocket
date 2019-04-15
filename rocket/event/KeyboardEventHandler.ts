import {
  KeyboardEventManager
} from "./KeyboardEventManager"

// The *Down happens first,
// the *Press happens second (when text is entered), 
// and the *Up happens last (when text input is complete).

interface ConditionHook {
  (
    keyCode: number,
    event: KeyboardEvent,
    context: KeyboardEventHandler
  ): boolean
}

type ActionName = 'keydown' | 'keypress' | 'keyup'

interface KeyboardEventAction {
  name: ActionName
  keyCode: number,
  event: KeyboardEvent,
}

export class KeyboardEventHandler {
  public name: string
  public manager: KeyboardEventManager

  // CONDITION
  public condition_keydown: ConditionHook = () => {
    return true
  }
  public condition_keypress: ConditionHook = () => {
    return true
  }

  // CALLBACK
  public onKeydownStart: Function | Function[] = () => { }
  public onKeydownEnd: Function | Function[] = () => { }
  public onKeypress: Function | Function[] = () => { }

  constructor() { }

  // HANDLE

  public handle_keydown(action: KeyboardEventAction): KeyboardEventHandler {
    if (this.condition_keydown(event.keyCode, event, this) === true) {
      if (typeof this.onKeydownStart === 'function') {
        this.onKeydownStart(event.keyCode, event, this)
      } else if (this.onKeydownStart.constructor === Array) {
        this.onKeydownStart.forEach(callback => {
          callback(event.keyCode, event, this)
        })
      }
    }
    return this
  }

  public handle_keypress(action: KeyboardEventAction): KeyboardEventHandler {
    if (this.condition_keypress(event.keyCode, event, this) === true) {


      if (typeof this.onKeypress === 'function') {
        this.onKeypress(event.keyCode, event, this)
      } else if (this.onKeypress.constructor === Array) {
        this.onKeypress.forEach(callback => {
          callback(event.keyCode, event, this)
        })
      }
    }
    return this
  }

  public handle_keyUp(action: KeyboardEventAction): KeyboardEventHandler {
    if (this.isDown === true) {
      if (typeof this.onKeydownEnd === 'function') {
        this.onKeydownEnd(event.keyCode, event, this)
      } else if (this.onKeydownEnd.constructor === Array) {
        this.onKeydownEnd.forEach(callback => {
          callback(event.keyCode, event, this)
        })
      }
    }
    return this
  }

}