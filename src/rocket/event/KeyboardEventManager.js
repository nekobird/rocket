// KeyPress, KeyUp, and KeyDown are analagous to, respectively, Click, MouseUp, and MouseDown.
// The *Down happens first, the *Press happens second (when text is entered), and the *Up happens last (when text input is complete).
// The exception is webkit, which has an extra event in there:
// keydown, keypress, textInput, keyup

export class KeyboardEventManager {

  constructor() {
    this.isDown = false
    this.isDisabled = false

    this.altKeyIsDown = false
    this.ctrlKeyIsDown = false
    this.shiftKeyIsDown = false

    this.downKeys = new Array
    this.lastKeyCode

    // CALLBACKS
    this.onEvent = () => {}
    this.onKeyDown = () => {}
    this.onKeyPress = () => {}
    this.onKeyUp = () => {}

    this.handlers = {}

    this.startListening()
  }

  register(name, handler) {
    this.handlers[name] = handler
    this.handlers[name].name = name
    this.handlers[name].manager = this
    return this
  }

  remove(name) {
    this.handlers[name].manager = undefined
    delete this.handlers[name]
    return this
  }

  find(name) {
    return this.handlers[name]
  }

  // HANDLERS

  handleKeyDown(event) {
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

  handleKeyPress(event) {
    this.lastKeyCode = event.keyCode

    if (this.isDisabled === false) {
      this.onEvent(event, this)
      this.onKeyDown(event, this)
      for (let name in this.handlers) {
        this.handlers[name].handleKeyPress(event)
      }
    }
  }

  handleKeyUp(event) {
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

  startListening() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this))
    window.addEventListener('keypress', this.handleKeyPress.bind(this))
    window.addEventListener('keyup', this.handleKeyUp.bind(this))
    return this
  }

  stopListening() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keypress', this.handleKeyPress)
    window.removeEventListener('keyup', this.handleKeyUp)
    return this
  }

}