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
  public debounceTime: number = 0.2

  public handlers

  constructor() {
    this.handlers = {}
    this.startListening()
  }

  public register(name: string, handler): MouseEventManager {
    this.handlers[name] = handler
    this.handlers[name].name = name
    return this
  }

  public remove(name: string): MouseEventManager {
    delete this.handlers[name]
    return this
  }

  public find(name: string) {
    return this.handlers[name]
  }

  // HANDLERS

  handleClick(event: MouseEvent) {
    this.onEvent(event)
    this.onClick(event)
    for (let name in this.handlers) {
      this.handlers[name].handleClick(event)
    }
  }

  handleDown(event: MouseEvent) {
    this.onEvent(event)
    this.onDown(event)
    for (let name in this.handlers) {
      this.handlers[name].handleDown(event)
    }
  }

  handleUp(event: MouseEvent) {
    this.onEvent(event)
    this.onUp(event)
    for (let name in this.handlers) {
      this.handlers[name].handleUp(event)
    }
  }

  handleMove(event: MouseEvent) {
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

  public startListening(): MouseEventManager {
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

  public stopListening(): MouseEventManager {
    window.removeEventListener('click', this.handleClick)
    window.removeEventListener('mousedown', this.handleDown)
    window.removeEventListener('mouseup', this.handleUp)
    window.removeEventListener('mousemove', this.handleMove)
    window.removeEventListener('mousemove', this.debounce)
    return this
  }

}