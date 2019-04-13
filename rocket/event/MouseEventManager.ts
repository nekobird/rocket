import {
  Util,
} from '../Rocket'

export class MouseEventManager {

  public onEvent = (event) => { }
  public onClick = (event) => { }
  public onDown = (event) => { }
  public onUp = (event) => { }
  public onMove = (event) => { }

  public debounce
  public debounceTime = 0.2

  public handlers

  constructor() {
    this.handlers = {}
    this.startListening()
  }

  register(name, handler) {
    this.handlers[name] = handler
    this.handlers[name].name = name
    return this
  }

  remove(name) {
    delete this.handlers[name]
    return this
  }

  find(name) {
    return this.handlers[name]
  }

  // HANDLERS

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

  // LISTEN

  startListening() {
    this.debounce = Util.debounce(
      this.debounceTime, this.handleMoveEnd.bind(this)
    )
    window.addEventListener('click', this.handleClick)
    window.addEventListener('mousedown', this.handleDown)
    window.addEventListener('mouseup', this.handleUp)
    window.addEventListener('mousemove', this.handleMove)
    window.addEventListener('mousemove', this.debounce)
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