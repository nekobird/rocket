import {
  TouchEventHandler,
  Util,
} from '../rocket'

export interface TouchEventHandlers {
  [name: string]: TouchEventHandler,
}

export interface TouchEventManagerHook {
  (
    event: TouchEvent,
    context: TouchEventManager,
  ): void
}

export class TouchEventManager {

  // CALLBACKS
  public onEvent: TouchEventManagerHook = (event, context) => { }

  public onTouchStart: TouchEventManagerHook = (event, context) => { }
  public onTouchMove: TouchEventManagerHook = (event, context) => { }
  public onTouchEnd: TouchEventManagerHook = (event, context) => { }

  public onTouchCancel: TouchEventManagerHook = (event, context) => { }

  // DEBOUNCE
  private debounce_moveEnd: Function
  private debounceWait: number = 0.2

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
          this.handlers[name].handleTouchStart(event, touch)
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
          this.handlers[name].handleTouchEnd(event, touch)
        }
      }
    })
  }

  private eventHandler_touchCancel = (event: TouchEvent) => {
    this.onEvent(event, this)
    this.onTouchCancel(event, this)
    Object.keys(this.handlers).forEach(name => {
      for (let touch of event.changedTouches) {
        this.handlers[name].handleMove(event, touch)
      }
    })
  }

  private eventHandler_move = (event: TouchEvent) => {
    this.onEvent(event, this)
    this.onTouchMove(event, this)
    Object.keys(this.handlers).forEach(name => {
      for (let touch of event.touches) {
        this.handlers[name].handleMove(event, touch)
      }
    })
  }

  private eventHandler_moveEnd = () => {
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].handleMoveEnd()
    })
  }

  // LISTEN

  public startListening() {
    this.debounce_moveEnd = Util.debounce(
      this.debounceWait, this.eventHandler_moveEnd
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