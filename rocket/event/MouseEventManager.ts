import {
  MouseEventHandler,
  Util,
} from '../rocket'

interface MouseEventHandlers {
  [name: string]: MouseEventHandler
}

export class MouseEventManager {

  public onEvent = (event) => { }
  public onClick = (event) => { }
  public onDown = (event) => { }
  public onUp = (event) => { }
  public onMove = (event) => { }

  public debounce: Function
  public debounceTime: number = 0.2

  public handlers: MouseEventHandlers

  constructor() {
    this.handlers = {}
    this.startListening()
  }

  public register(name: string, handler: MouseEventHandler): MouseEventManager {
    this.handlers[name] = handler
    this.handlers[name].name = name
    return this
  }

  public remove(name: string): MouseEventManager {
    delete this.handlers[name]
    return this
  }

  public find(name: string): MouseEventHandler {
    return this.handlers[name]
  }

  // EVENT HANDLER

  eventHandler_mouseClick(event: MouseEvent) {
    this.onEvent(event)
    this.onClick(event)
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].handleClick(event)
    })
  }

  eventHandler_mouseDown(event: MouseEvent) {
    this.onEvent(event)
    this.onDown(event)
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].handleDown(event)
    })
  }

  eventHandler_mouseUp(event: MouseEvent) {
    this.onEvent(event)
    this.onUp(event)
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].handleUp(event)
    })
  }

  eventHandler_mouseMove(event: MouseEvent) {
    this.onEvent(event)
    this.onMove(event)
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].handleMove(event)
    })
  }

  eventHandler_mouseMoveEnd() {
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].handleMoveEnd()
    })
  }

  // LISTEN

  public startListening(): MouseEventManager {
    this.debounce = Util.debounce(
      this.debounceTime, this.eventHandler_mouseMoveEnd.bind(this)
    )
    window.addEventListener('click', this.eventHandler_mouseClick)
    window.addEventListener('mousedown', this.eventHandler_mouseDown)
    window.addEventListener('mouseup', this.eventHandler_mouseUp)
    window.addEventListener('mousemove', this.eventHandler_mouseMove)
    window.addEventListener('mousemove', <EventListener>this.debounce)
    return this
  }

  public stopListening(): MouseEventManager {
    window.removeEventListener('click', this.eventHandler_mouseClick)
    window.removeEventListener('mousedown', this.eventHandler_mouseDown)
    window.removeEventListener('mouseup', this.eventHandler_mouseUp)
    window.removeEventListener('mousemove', this.eventHandler_mouseMove)
    window.removeEventListener('mousemove', <EventListener>this.debounce)
    return this
  }

}