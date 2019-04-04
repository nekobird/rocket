import {
  KeyboardEventManager,
} from '../Rocket'

export class KeyboardEventHandler {

  constructor() {
    this.manager

    this.name
    this.data
    this.keyCode

    this.event

    this.isDown = false

    this.determineKeyDown = () => { return true }
    this.determineKeyPress = () => { return true }

    this.onKeyDownStart = () => { }
    this.onKeyDownEnd = () => { }
    this.onKeyPress = () => { }

    this.keyDownStartTime
    this.keyDownEndTime
    this.keyDownDuration

    this.keyPressTime
  }

  handleKeyDown(event) {
    if (this.determineKeyDown(event.keyCode, event, this) === true) {
      this.event = event
      this.keyDownStartTime = Date.now()
      this.keyCode = event.keyCode
      this.isDown = true
      if (typeof this.onKeyDownStart === 'function') {
        this.onKeyDownStart(event.keyCode, this)
      } else if (this.onKeyDownStart.constructor === Array) {
        for (let onKeyDownStart of this.onKeyDownStart) {
          onKeyDownStart(event.keyCode, this)
        }
      }
    }
  }

  handleKeyPress(event) {
    if (this.determineKeyPress(event.keyCode, event, this) === true) {
      this.event = event
      this.keyCode = event.keyCode
      this.keyPressTime = Date.now()
      if (typeof this.onKeyPress === 'function') {
        this.onKeyPress(event.keyCode, this)
      } else if (this.onKeyPress.constructor === Array) {
        for (let onKeyPress of this.onKeyPress) {
          onKeyPress(event.keyCode, this)
        }
      }
    }
  }

  handleKeyUp(event) {
    if (this.isDown === true) {
      this.event = event
      this.keyCode = event.keyCode
      this.keyDownEndTime = Date.now()
      this.keyDownDuration = this.keyDownEndTime - this.keyDownStartTime
      this.isDown = false
      if (typeof this.onKeyDownEnd === 'function') {
        this.onKeyDownEnd(event.keyCode, this)
      } else if (this.onKeyDownEnd.constructor === Array) {
        for (let onKeyDownEnd of this.onKeyDownEnd) {
          onKeyDownEnd(event.keyCode, this)
        }
      }
    }
  }

}