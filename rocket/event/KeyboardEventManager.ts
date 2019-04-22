// KeyPress, KeyUp, and KeyDown are analagous to, respectively, Click, MouseUp, and MouseDown.
// The *Down happens first, the *Press happens second (when text is entered), and the *Up happens last (when text input is complete).
// The exception is webkit, which has an extra event in there:
// keydown, keypress, textInput, keyup

import {
  KeyboardEventHandler,
} from '../rocket'

export interface KeyboardEventHandlers {
  [name: string]: KeyboardEventHandler
}

export interface KeyboardEventManagerHook {
  (
    action: KeyboardEventManagerAction
  ): void
}

export type KeyboardEventManagerActionName = 'keydown' | 'keypress' | 'keyup'

export interface KeyboardEventManagerAction {
  name: KeyboardEventManagerActionName,
  event: KeyboardEvent,
  keyCode: number,
  manager: KeyboardEventManager,
  time: number,
  isFirstKeydown: boolean,
  isLastKeyup: boolean,
}

export interface KeyboardEventManagerKey {
  keyCode: number,
  keydownEvent?: KeyboardEvent,
  keydownTime?: number,
  keyupEvent?: KeyboardEvent,
  keyupTime?: number,
  duration?: number,
  isDown?: boolean,
}

export interface KeyboardEventManagerKeys {
  [keyCode: number]: KeyboardEventManagerKey
}

export class KeyboardEventManager {

  public isDisabled: boolean = false

  public isDown: boolean = false

  public altKeyIsDown: boolean = false
  public ctrlKeyIsDown: boolean = false
  public shiftKeyIsDown: boolean = false

  public downKeyCodes: number[]
  public keys: KeyboardEventManagerKeys

  public firstKeydownTime: number
  public previousKeydownTime: number
  public lastKeyupTime: number
  public previousKeypressTime: number
  public duration: number

  public previousKeydownKeyCode: number
  public previousKeyupKeyCode: number
  public previousKeypressKeyCode: number

  // HOOK
  public onEvent: KeyboardEventManagerHook = (action) => { }
  public onKeydown: KeyboardEventManagerHook = (action) => { }
  public onKeypress: KeyboardEventManagerHook = (action) => { }
  public onKeyup: KeyboardEventManagerHook = (action) => { }

  public onFirstKeydown: KeyboardEventManagerHook = (action) => { }
  public onLastKeyup: KeyboardEventManagerHook = (action) => { }

  public handlers: KeyboardEventHandlers

  constructor() {
    this.handlers = {}
    this.downKeyCodes = []
    this.keys = {}
  }

  public register(name: string, handler: KeyboardEventHandler): this {
    if (typeof this.handlers[name] === 'undefined') {
      this.handlers[name] = handler
      this.handlers[name].name = name
      this.handlers[name].manager = this
    } else {
      this.handlers[name] = Object.assign(this.handlers[name], handler)
    }
    return this
  }

  public remove(name: string): this {
    if (typeof this.handlers[name] === 'object') {
      this.handlers[name].manager = undefined
      delete this.handlers[name]
    }
    return this
  }

  public find(name: string): KeyboardEventHandler | false {
    return typeof this.handlers[name] !== 'undefined' ? this.handlers[name] : false
  }

  // ACTION

  private composeAction(
    name: KeyboardEventManagerActionName, event: KeyboardEvent
  ): KeyboardEventManagerAction {
    return {
      name: name,
      event: event,
      keyCode: event.keyCode,
      time: Date.now(),
      manager: this,
      isFirstKeydown: false,
      isLastKeyup: false,
    }
  }

  // MANAGE KEYS

  private createKeyObject(keyCode: number) {
    if (typeof this.keys[keyCode] === 'undefined') {
      this.keys[keyCode] = { keyCode: keyCode }
    }
  }

  private updateKeyOnKeydown(event: KeyboardEvent): this {
    this.createKeyObject(event.keyCode)
    const key: KeyboardEventManagerKey = this.keys[event.keyCode]
    key.keydownEvent = event
    key.keydownTime = Date.now()
    key.keyupEvent = undefined
    key.keyupTime = undefined
    key.duration = undefined
    key.isDown = true
    return this
  }

  private updateKeyOnKeyup(event: KeyboardEvent): this {
    const key: KeyboardEventManagerKey = this.keys[event.keyCode]
    key.keyupEvent = event
    key.keyupTime = Date.now()
    key.duration = key.keyupTime - key.keydownTime
    key.isDown = false
    return this
  }

  public getKey(keyCode: number): KeyboardEventManagerKey | false {
    if (typeof this.keys[keyCode] === 'object') {
      return this.keys[keyCode]
    }
    return false
  }

  private updateDownKeyCodesOnKeydown(event: KeyboardEvent): this {
    if (this.downKeyCodes.indexOf(event.keyCode) === -1) {
      this.downKeyCodes.push(event.keyCode)
    }
    return this
  }

  private updateDownKeyCodesOnKeyup(event: KeyboardEvent): this {
    const downKeyIndex: number = this.downKeyCodes.indexOf(event.keyCode)
    if (downKeyIndex !== -1) {
      this.downKeyCodes.splice(downKeyIndex, 1)
    }
    return this
  }

  private updateModifierKeysOnKeydown(event: KeyboardEvent): this {
    switch (event.keyCode) {
      case 16: {
        this.shiftKeyIsDown = true
        break
      }
      case 17: {
        this.ctrlKeyIsDown = true
        break
      }
      case 18: {
        this.altKeyIsDown = true
        break
      }
    }
    return this
  }

  private updateModifierKeysOnKeyup(event: KeyboardEvent): this {
    switch (event.keyCode) {
      case 16: {
        this.shiftKeyIsDown = false
        break
      }
      case 17: {
        this.ctrlKeyIsDown = false
        break
      }
      case 18: {
        this.altKeyIsDown = false
        break
      }
    }
    return this
  }

  // EVENT HANDLER

  private eventHandlerKeydown = (event: KeyboardEvent) => {

    this
      .updateKeyOnKeydown(event)
      .updateDownKeyCodesOnKeydown(event)
      .updateModifierKeysOnKeydown(event)

    this.previousKeydownKeyCode = event.keyCode
    this.previousKeydownTime = Date.now()

    const action = this.composeAction('keydown', event)
    if (this.isDown === false) {
      this.firstKeydownTime = Date.now()
      this.lastKeyupTime = undefined
      this.duration = undefined
      this.isDown = true
      action.isFirstKeydown = true
      this.onFirstKeydown(action)
    }
    this.onEvent(action)
    this.onKeydown(action)
    Object.keys(this.handlers).forEach(handlerName => {
      this.handlers[handlerName].handleKeydown(action)
    })
  }

  private eventHandlerKeyup = (event: KeyboardEvent) => {
    this
      .updateKeyOnKeyup(event)
      .updateDownKeyCodesOnKeyup(event)
      .updateModifierKeysOnKeyup(event)

    this.previousKeyupKeyCode = event.keyCode

    const action = this.composeAction('keyup', event)
    if (this.downKeyCodes.length === 0) {
      this.lastKeyupTime = Date.now()
      this.duration = this.lastKeyupTime - this.firstKeydownTime
      this.isDown = false
      action.isLastKeyup = true
      this.onLastKeyup(action)
    }
    this.onEvent(action)
    this.onKeyup(action)
    Object.keys(this.handlers).forEach(handlerName => {
      this.handlers[handlerName].handleKeyup(action)
    })
  }

  private eventHandlerKeypress = (event: KeyboardEvent) => {
    this.previousKeypressKeyCode = event.keyCode
    this.previousKeypressTime = Date.now()

    if (this.isDisabled === false) {
      const action = this.composeAction('keypress', event)
      this.onEvent(action)
      this.onKeypress(action)
      Object.keys(this.handlers).forEach(handlerName => {
        this.handlers[handlerName].handleKeypress(action)
      })
    }
  }

  // LISTEN

  public listen(): this {
    window.addEventListener('keydown', this.eventHandlerKeydown)
    window.addEventListener('keypress', this.eventHandlerKeypress)
    window.addEventListener('keyup', this.eventHandlerKeyup)
    return this
  }

  public stopListen(): this {
    window.removeEventListener('keydown', this.eventHandlerKeydown)
    window.removeEventListener('keypress', this.eventHandlerKeypress)
    window.removeEventListener('keyup', this.eventHandlerKeyup)
    return this
  }

}