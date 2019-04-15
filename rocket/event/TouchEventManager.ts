import {
  TouchEventHandler,
  Util,
} from '../Rocket'

interface TouchEventHandlers {
  [name: string]: TouchEventHandler,
}

interface EventCallback {
  (
    event: TouchEvent,
    context: TouchEventManager,
  ): void
}

export class TouchEventManager {

  // CALLBACKS
  public onEvent: EventCallback = (event, context) => { }

  public onTouchStart: EventCallback = (event, context) => { }
  public onTouchMove: EventCallback = (event, context) => { }
  public onTouchEnd: EventCallback = (event, context) => { }

  public onTouchCancel: EventCallback = (event, context) => { }

  // DEBOUNCE
  private debounce_moveEnd: Function
  private debounce_wait: number = 0.2

  // HANDLER
  private handlers: TouchEventHandlers = {}

  constructor() {
    this.handlers = {}
    this.startListening()
    return this
  }

  // PUBLIC

  public register(name: string, handler: TouchEventHandler) {
    this.handlers[name] = handler
    this.handlers[name].name = name
    return this
  }

  public remove(name: string): TouchEventManager {
    delete this.handlers[name]
    return this
  }

  public find(name: string): TouchEventHandler {
    return this.handlers[name]
  }

  public isTouchIdentityTaken(identity: number): boolean {
    Object.keys(this.handlers).forEach(name => {
      if (this.handlers[name].identity === identity) {
        return true
      }
    })
    return false
  }

  // EVENT HANDLER

  private eventHandler_touchStart = (event: TouchEvent) => {
    this.onEvent(event, this)
    this.onTouchStart(event, this)
    Array.from(event.targetTouches).forEach((touch: Touch) => {
      Object.keys(this.handlers).forEach(name => {
        if (this.isTouchIdentityTaken(touch.identifier) === false) {
          this.handlers[name].handle_touchStart(event, touch)
        }
      })
    })
  }

  private eventHandler_touchEnd = (event: TouchEvent) => {
    this.onEvent(event, this)
    this.onTouchEnd(event, this)
    Object.keys(this.handlers).forEach(name => {
      for (let touch of event.changedTouches) {
        if (this.handlers[name].identity === touch.identifier) {
          this.handlers[name].handle_touchEnd(event, touch)
        }
      }
    })
  }

  private eventHandler_touchCancel = (event: TouchEvent) => {
    this.onEvent(event, this)
    this.onTouchCancel(event, this)
    Object.keys(this.handlers).forEach(name => {
      for (let touch of event.changedTouches) {
        this.handlers[name].handle_move(event, touch)
      }
    })
  }

  private eventHandler_move = (event: TouchEvent) => {
    this.onEvent(event, this)
    this.onTouchMove(event, this)
    Object.keys(this.handlers).forEach(name => {
      for (let touch of event.touches) {
        this.handlers[name].handle_move(event, touch)
      }
    })
  }

  private eventHandler_moveEnd = () => {
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].handle_moveEnd()
    })
  }

  // LISTEN

  public startListening() {
    this.debounce_moveEnd = Util.debounce(
      this.debounce_wait, this.eventHandler_moveEnd
    )
    window.addEventListener('touchstart', this.eventHandler_touchStart)
    window.addEventListener('touchmove', this.eventHandler_move)
    window.addEventListener('touchmove', <EventListener>this.debounce_moveEnd)
    window.addEventListener('touchend', this.eventHandler_touchEnd)
    window.addEventListener('touchcancel', this.eventHandler_touchCancel)
  }

  public stopListening() {
    window.removeEventListener('touchstart', this.eventHandler_touchStart)
    window.removeEventListener('touchmove', this.eventHandler_move)
    window.removeEventListener('touchmove', <EventListener>this.debounce_moveEnd)
    window.removeEventListener('touchend', this.eventHandler_touchEnd)
    window.removeEventListener('touchcancel', this.eventHandler_touchCancel)
  }

}