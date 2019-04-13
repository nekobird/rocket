import {
  KeyboardEventManager
} from "./KeyboardEventManager"

// The *Down happens first,
// the *Press happens second (when text is entered), 
// and the *Up happens last (when text input is complete).

export class KeyboardEventHandler {

  public name: string
  public manager: KeyboardEventManager

  public lastFiredEvent: Event
  public lastKeyCode: number

  public isDown: boolean = false

  public keyDownStartTime: number
  public keyDownEndTime: number
  public keyDownDuration: number
  public keyPressTime: number

  // CALLBACKS
  public determineKeyDown: Function = () => {
    return true
  }
  public determineKeyPress: Function = () => {
    return true
  }
  public onKeyDownStart: Function | Function[] = () => { }
  public onKeyDownEnd: Function | Function[] = () => { }
  public onKeyPress: Function | Function[] = () => { }

  constructor() {
  }

  // HANDLERS

  public handleKeyDown(event: KeyboardEvent) {
    if (this.determineKeyDown(event.keyCode, event, this) === true) {
      this.keyDownStartTime = Date.now()
      this.lastFiredEvent = event
      this.lastKeyCode = event.keyCode
      this.isDown = true

      // Call onKeyDownStart.
      if (typeof this.onKeyDownStart === 'function') {
        this.onKeyDownStart(event.keyCode, event, this)
      } else if (this.onKeyDownStart.constructor === Array) {
        this.onKeyDownStart.forEach(callback => {
          callback(event.keyCode, event, this)
        })
      }
    }
  }

  public handleKeyPress(event: KeyboardEvent) {
    if (this.determineKeyPress(event.keyCode, event, this) === true) {
      this.keyPressTime = Date.now()
      this.lastFiredEvent = event
      this.lastKeyCode = event.keyCode

      // Call onKeyPress
      if (typeof this.onKeyPress === 'function') {
        this.onKeyPress(event.keyCode, event, this)
      } else if (this.onKeyPress.constructor === Array) {
        this.onKeyPress.forEach(callback => {
          callback(event.keyCode, event, this)
        })
      }
    }
  }

  public handleKeyUp(event: KeyboardEvent) {
    if (this.isDown === true) {

      this.keyDownEndTime = Date.now()
      this.keyDownDuration = this.keyDownEndTime - this.keyDownStartTime
      this.lastFiredEvent = event
      this.lastKeyCode = event.keyCode
      this.isDown = false

      // Call onKeyDownEnd AKA keyUp
      if (typeof this.onKeyDownEnd === 'function') {
        this.onKeyDownEnd(event.keyCode, event, this)
      } else if (this.onKeyDownEnd.constructor === Array) {
        this.onKeyDownEnd.forEach(callback => {
          callback(event.keyCode, event, this)
        })
      }
    }
  }

}