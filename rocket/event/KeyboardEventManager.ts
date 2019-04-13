// KeyPress, KeyUp, and KeyDown are analagous to, respectively, Click, MouseUp, and MouseDown.
// The *Down happens first, the *Press happens second (when text is entered), and the *Up happens last (when text input is complete).
// The exception is webkit, which has an extra event in there:
// keydown, keypress, textInput, keyup

import {
  KeyboardEventHandler
} from '../Rocket'

interface Handler {
  manager: KeyboardEventManager,
  name: string,
}

export class KeyboardEventManager {

  public isDown: boolean = false
  public isDisabled: boolean = false

  public altKeyIsDown: boolean = false
  public ctrlKeyIsDown: boolean = false
  public shiftKeyIsDown: boolean = false

  public downKeys: number[]
  public lastKeyCode: number

  // CALLBACKS
  public onEvent = (event, context) => { }
  public onKeyDown = (event, context) => { }
  public onKeyPress = () => { }
  public onKeyUp = () => { }

  public handlers: KeyboardEventHandler[]

  constructor() {
    // this.handlers = {}
    this.startListening()
  }

  public register(name: string, handler: Handler) {
    this.handlers[name] = handler
    this.handlers[name].name = name
    this.handlers[name].manager = this
    return this
  }

  public remove(name: string) {
    this.handlers[name].manager = undefined
    delete this.handlers[name]
    return this
  }

  public find(name: string) {
    return this.handlers[name]
  }

  // HANDLERS

  public handleKeyDown(event: KeyboardEvent) {
    this.downKeys.push(event.keyCode)

    // SHIFT
    if (event.keyCode === 16) {
      this.shiftKeyIsDown = true
    }
    // CTRL
    else if (event.keyCode === 17) {
      this.ctrlKeyIsDown = true
    }
    // ALT
    else if (event.keyCode === 18) {
      this.altKeyIsDown = true
    }

    this.lastKeyCode = event.keyCode

    this.isDown = true

    if (this.isDisabled === false) {
      this.onEvent(event, this)
      this.onKeyDown(event, this)
      for (let name in this.handlers) {
        this.handlers[name].handleKeyDown(event)
      }
    }
  }

  public handleKeyPress = (event: KeyboardEvent) => {
    this.lastKeyCode = event.keyCode

    if (this.isDisabled === false) {
      this.onEvent(event, this)
      this.onKeyDown(event, this)
      for (let name in this.handlers) {
        this.handlers[name].handleKeyPress(event)
      }
    }
  }

  public handleKeyUp = (event: KeyboardEvent) => {
    let downKeyIndex = this.downKeys.indexOf(event.keyCode)

    if (downKeyIndex !== -1) {
      this.downKeys.splice(downKeyIndex, 1)
    }

    // SHIFT
    if (event.keyCode === 16) {
      this.shiftKeyIsDown = false
    }
    // CTRL
    else if (event.keyCode === 17) {
      this.ctrlKeyIsDown = false
    }
    // AlT
    else if (event.keyCode === 18) {
      this.altKeyIsDown = false
    }

    if (this.downKeys.length === 0) {
      this.isDown = false
    }

    if (this.isDisabled === false) {
      this.onEvent(event, this)
      this.onKeyDown(event, this)
      for (let name in this.handlers) {
        this.handlers[name].handleKeyUp(event)
      }
    }
  }

  // LISTEN

  public startListening() {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keypress', this.handleKeyPress)
    window.addEventListener('keyup', this.handleKeyUp)
    return this
  }

  public stopListening() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keypress', this.handleKeyPress)
    window.removeEventListener('keyup', this.handleKeyUp)
    return this
  }

}