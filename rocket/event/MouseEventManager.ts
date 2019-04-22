import {
  MouseEventHandler,
  Util,
} from '../rocket'

export interface MouseEventHandlers {
  [name: string]: MouseEventHandler
}

export interface MouseEventManagerHook {
  (
    event: MouseEvent
  ): void
}

export class MouseEventManager {

  public onEvent: MouseEventManagerHook = (event) => { }

  public onClick: MouseEventManagerHook = (event) => { }
  public onDown: MouseEventManagerHook = (event) => { }
  public onUp: MouseEventManagerHook = (event) => { }
  public onMove: MouseEventManagerHook = (event) => { }

  public debounce: Function
  public debounceWait: number = 0.2

  public handlers: MouseEventHandlers

  constructor() {
    this.handlers = {}
    this.startListening()
  }

  public register(name: string, handler: MouseEventHandler): this {
    this.handlers[name] = handler
    this.handlers[name].name = name
    return this
  }

  public remove(name: string): this {
    delete this.handlers[name]
    return this
  }

  public find(name: string): MouseEventHandler | false {
    if (typeof this.handlers[name] === 'object') {
      return this.handlers[name]
    }
    return false
  }

  // EVENT HANDLER

  private eventHandlerMouseClick = (event: MouseEvent) => {
    this.onEvent(event)
    this.onClick(event)
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].handleClick(event)
    })
  }

  private eventHandlerMouseDown = (event: MouseEvent) => {
    this.onEvent(event)
    this.onDown(event)
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].handleDown(event)
    })
  }

  private eventHandlerMouseUp = (event: MouseEvent) => {
    this.onEvent(event)
    this.onUp(event)
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].handleUp(event)
    })
  }

  private eventHandlerMouseMove = (event: MouseEvent) => {
    this.onEvent(event)
    this.onMove(event)
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].handleMove(event)
    })
  }

  private eventHandlerMouseMoveEnd = () => {
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].handleMoveEnd()
    })
  }

  // LISTEN

  public startListening(): this {
    this.debounce = Util.debounce(
      this.debounceWait, this.eventHandlerMouseMoveEnd.bind(this)
    )
    window.addEventListener('click', this.eventHandlerMouseClick)
    window.addEventListener('mousedown', this.eventHandlerMouseDown)
    window.addEventListener('mouseup', this.eventHandlerMouseUp)
    window.addEventListener('mousemove', this.eventHandlerMouseMove)
    window.addEventListener('mousemove', <EventListener>this.debounce)
    return this
  }

  public stopListening(): this {
    window.removeEventListener('click', this.eventHandlerMouseClick)
    window.removeEventListener('mousedown', this.eventHandlerMouseDown)
    window.removeEventListener('mouseup', this.eventHandlerMouseUp)
    window.removeEventListener('mousemove', this.eventHandlerMouseMove)
    window.removeEventListener('mousemove', <EventListener>this.debounce)
    return this
  }

}