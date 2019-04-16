// KeyPress, KeyUp, and KeyDown are analagous to, respectively, Click, MouseUp, and MouseDown.
// The *Down happens first, the *Press happens second (when text is entered), and the *Up happens last (when text input is complete).
// The exception is webkit, which has an extra event in there:
// keydown, keypress, textInput, keyup

import {
  KeyboardEventHandler
} from '../rocket'

interface Handler {
  manager: KeyboardEventManager,
  name: string,
}

interface KeyboardEventHandlers {
  [name: string]: KeyboardEventHandler
}

interface KeyboardEventManagerHook {
  (
    event: KeyboardEvent,
    context: KeyboardEventManager,
  ): void
}

export class KeyboardEventManager {

  public isDown: boolean = false
  public isDisabled: boolean = false

  public altKeyIsDown: boolean = false
  public ctrlKeyIsDown: boolean = false
  public shiftKeyIsDown: boolean = false

  public downKeyCodes: number[]

  // PREVIOUS
  public previous_keyCode_keydown: number
  public previous_keyCode_keypress: number
  public previous_duration_keydown: number

  // TIME
  public time_keydown: number
  public time_keyup: number
  public time_keypress: number

  // HOOK
  public onEvent: KeyboardEventManagerHook = (event, context) => { }
  public onKeydown: KeyboardEventManagerHook = (event, context) => { }
  public onKeypress: KeyboardEventManagerHook = (event, context) => { }
  public onKeyup: KeyboardEventManagerHook = (event, context) => { }

  public handlers: KeyboardEventHandlers

  constructor() {
    this.handlers = {}
    this.startListening()
  }

  public register(name: string, handler: KeyboardEventHandler): KeyboardEventManager {
    this.handlers[name] = handler
    this.handlers[name].name = name
    this.handlers[name].manager = this
    return this
  }

  public remove(name: string): KeyboardEventManager {
    this.handlers[name].manager = undefined
    delete this.handlers[name]
    return this
  }

  public find(name: string): KeyboardEventHandler | false {
    return typeof this.handlers[name] !== 'undefined' ? this.handlers[name] : false
  }

  // EVENT HANDLER

  private composeAction(name: string, event: KeyboardEvent) {
    const action = {
      name: name,
      keyCode: event.keyCode,
      event: event,
      time: Date.now(),
    }
  }

  private composeContext() {
    const context = {
      // previousKeyCode
      // previousKeyboardEvent
      // downKeyCodes
      // altKeyIsDown
      // ctrlKeyIsDown
      // ctrlKeyIsDown
    }
  }

  private eventHandler_keydown(event: KeyboardEvent) {
    this.time_keydown = Date.now()

    this.downKeyCodes.push(event.keyCode)

    this.previous_keyCode = event.keyCode
    this.previous_event_keydown = event


    if (event.keyCode === 16) {
      this.shiftKeyIsDown = true
    } else if (event.keyCode === 17) {
      this.ctrlKeyIsDown = true
    } else if (event.keyCode === 18) {
      this.altKeyIsDown = true
    }
    this.isDown = true

    if (this.isDisabled === false) {
      this.onEvent(event, this)
      this.onKeydown(event, this)
      Object.keys(this.handlers).forEach(name => {
        this.handlers[name].handle_keydown(
          this.composeAction('keydown', event)
          this.composeContext('keydown', event),
        )
      })
    }
  }

  private eventHandler_keypress = (event: KeyboardEvent) => {
    this.lastKeyCode = event.keyCode
    this.time_keypress = Date.now()
    this.lastFiredEvent = event
    this.lastKeyCode = event.keyCode

    if (this.isDisabled === false) {
      this.onEvent(event, this)
      this.onKeypress(event, this)
      Object.keys(this.handlers).forEach(name => {
        this.handlers[name].handle_keypress(event)
      })
    }
  }

  private eventHandler_keyup = (event: KeyboardEvent) => {
    const downKeyIndex: number = this.downKeyCodes.indexOf(event.keyCode)
    if (downKeyIndex !== -1) {
      this.downKeyCodes.splice(downKeyIndex, 1)
    }

    if (event.keyCode === 16) {
      this.shiftKeyIsDown = false
    } else if (event.keyCode === 17) {
      this.ctrlKeyIsDown = false
    } else if (event.keyCode === 18) {
      this.altKeyIsDown = false
    }
    if (this.downKeyCodes.length === 0) {
      this.isDown = false
    }

    this.time_keydown_end = Date.now()
    this.duration_keydown = this.time_keydown_end - this.time_keydown_start
    this.lastFiredEvent = event
    this.lastKeyCode = event.keyCode
    this.isDown = false

    if (this.isDisabled === false) {
      this.onEvent(event, this)
      this.onKeyup(event, this)
      Object.keys(this.handlers).forEach(name => {
        this.handlers[name].handle_keyUp(event)
      })
    }
  }

  // LISTEN

  public startListening(): KeyboardEventManager {
    window.addEventListener('keydown', this.eventHandler_keydown)
    window.addEventListener('keypress', this.eventHandler_keypress)
    window.addEventListener('keyup', this.eventHandler_keyup)
    return this
  }

  public stopListening(): KeyboardEventManager {
    window.removeEventListener('keydown', this.eventHandler_keydown)
    window.removeEventListener('keypress', this.eventHandler_keypress)
    window.removeEventListener('keyup', this.eventHandler_keyup)
    return this
  }

}