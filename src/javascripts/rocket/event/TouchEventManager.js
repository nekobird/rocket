import {
  Util,
} from '../Rocket'

export class TouchEventManager {

  constructor() {
    this.onEvent = () => {}
    this.onTouchStart = () => {}
    this.onTouchEnd = () => {}
    this.onTouchCancel = () => {}
    this.onTouchMove = () => {}

    this.debounceMoveEnd
    this.debounceTime = 0.2

    this.handlers = {}

    this.startListening()
    return this
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

  isTouchIdentityTaken(identity) {
    for (let name in this.handlers) {
      if (this.handlers[name].identity === identity) {
        return true
      }
    }
    return false
  }

  // HANDLE

  handleTouchStart(event) {
    this.onEvent(event)
    this.onTouchStart(event)
    for (let touch of event.targetTouches) {
      for (let name in this.handlers) {
        if (this.isTouchIdentityTaken(touch.identifier) === false) {
          this.handlers[name].handleTouchStart(event, touch)
        }
      }
    }
  }

  handleTouchEnd(event) {
    this.onEvent(event)
    this.onTouchEnd(event)
    for (let name in this.handlers) {
      for (let touch of event.changedTouches) {
        if (this.handlers[name].identity === touch.identifier) {
          this.handlers[name].handleTouchEnd(event, touch)
        }
      }
    }
  }

  handleTouchCancel(event) {
    this.onEvent(event)
    this.onTouchCancel(event)
    for (let name in this.handlers) {
      for (let touch of event.changedTouches) {
        this.handlers[name].handleTouchMove(event, touch)
      }
    }
  }

  handleTouchMove(event) {
    this.onEvent(event)
    this.onTouchMove(event)
    for (let name in this.handlers) {
      for (let touch of event.touches) {
        this.handlers[name].handleTouchMove(event, touch)
      }
    }
  }

  handleTouchMoveEnd() {
    for (let name in this.handlers) {
      this.handlers[name].handleTouchMoveEnd()
    }
  }

  // LISTEN

  startListening() {
    this.debounceMoveEnd = Util.debounce(
      this.debounceTime, this.handleTouchMoveEnd.bind(this)
    )
    window.addEventListener('touchstart', this.handleTouchStart.bind(this))
    window.addEventListener('touchmove', this.handleTouchMove.bind(this))
    window.addEventListener('touchmove', this.debounceMoveEnd.bind(this))
    window.addEventListener('touchend', this.handleTouchEnd.bind(this))
    window.addEventListener('touchcancel', this.handleTouchCancel.bind(this))
  }

  stopListening() {
    window.removeEventListener('touchstart', this.handleTouchStart)
    window.removeEventListener('touchmove', this.handleTouchMove)
    window.removeEventListener('touchmove', this.debounceMoveEnd)
    window.removeEventListener('touchend', this.handleTouchEnd)
    window.removeEventListener('touchcancel', this.handleTouchCancel)
  }

}