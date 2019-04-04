import {
  Util,
} from '../Rocket'

export class MouseEventManager {

  constructor() {

    this.onEvent = () => { }
    this.onClick = () => { }
    this.onDown = () => { }
    this.onUp = () => { }
    this.onMove = () => { }

    this.debounce
    this.debounceTime = 0.2

    this.handlers = {}
    this.startListening()
  }

  register(name, handler) {
    this.handlers[name] = handler
    this.handlers[name].name = name
    return this
  }

  find(name) {
    return this.handlers[name]
  }

  remove(name) {
    delete this.handlers[name]
    return this
  }

  // HANDLE

  handleClick(event) {
    this.onEvent(event)
    this.onClick(event)
    for (let name in this.handlers) {
      this.handlers[name].handleClick(event)
    }
  }

  handleDown(event) {
    this.onEvent(event)
    this.onDown(event)
    for (let name in this.handlers) {
      this.handlers[name].handleDown(event)
    }
  }

  handleUp(event) {
    this.onEvent(event)
    this.onUp(event)
    for (let name in this.handlers) {
      this.handlers[name].handleUp(event)
    }
  }

  handleMove(event) {
    this.onEvent(event)
    this.onMove(event)
    for (let name in this.handlers) {
      this.handlers[name].handleMove(event)
    }
  }

  handleMoveEnd() {
    for (let name in this.handlers) {
      this.handlers[name].handleMoveEnd()
    }
  }

  // LISTENERS

  startListening() {
    this.debounce = Util.debounce(
      this.debounceTime, this.handleMoveEnd.bind(this)
    )
    window.addEventListener('click', this.handleClick.bind(this))
    window.addEventListener('mousedown', this.handleDown.bind(this))
    window.addEventListener('mouseup', this.handleUp.bind(this))
    window.addEventListener('mousemove', this.handleMove.bind(this))
    window.addEventListener('mousemove', this.debounce.bind(this))
    return this
  }

  stopListening() {
    window.removeEventListener('click', this.handleClick)
    window.removeEventListener('mousedown', this.handleDown)
    window.removeEventListener('mouseup', this.handleUp)
    window.removeEventListener('mousemove', this.handleMove)
    window.removeEventListener('mousemove', this.debounce)
    return this
  }

}