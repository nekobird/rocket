import {
  Util,
  ScreenModel,
} from '../Rocket'

// export interface Size {
//   height
//   width
// }

// export interfac {
//   data?: object
//   determine?
//   event?: Event
//   isActive?
//   name?
//   onResize?
//   onResizeEnd?
//   onResizeStart?
// }

export class ScreenEventManager {

  constructor() {

    this.debounce
    this.debounceTime = 0.2

    this.isResizing = false

    this.onResizeStart
    this.onResize
    this.onResizeEnd

    this.resizeStartTime
    this.resizeEndTime
    this.resizeDuration

    this.startSize
    this.currentSize
    this.endSize

    this.scaleDelta

    this.handlers = new Array
    this.startListening()
    return this
  }

  register(name, handler) {
    this.handlers[name] = new Object
    let _handler = this.handlers[name]
    _handler.name = name
    _handler.isActive = false
    for (let key in handler) {
      _handler[key] = handler[key]
    }
    return this
  }

  find(name) {
    return this.handlers[name]
  }

  remove(name) {
    delete this.handlers[name]
    return this
  }

  get size() {
    return {
      height: ScreenModel.height,
      width: ScreenModel.width
    }
  }

  startListening() {
    this.debounce = Util.debounce(
      this.debounceTime, this._handleResizeEnd.bind(this)
    )
    window.addEventListener('resize', this._handleResize.bind(this))
    window.addEventListener('resize', this.debounce.bind(this))
    return this
  }

  stopListening() {
    window.removeEventListener('resize', this._handleResize)
    window.removeEventListener('resize', this.debounce)
    return this
  }

  _handleResize(event) {
    if (this.isResizing === false) {
      this.isResizing = true
      this.resizeStartTime = Date.now()
      this.startSize = this.size
      this.currentSize = this.size
      this.onResizeStart(this, event)
      for (let handler of this.handlers) {
        if (handler.determine(this, event) === true) {
          handler.isActive = true
          handler.event = event
          handler.onResizeStart(this, this.handlers[handler.name])
        }
      }
    } else {
      this.currentSize = this.size
      this.onResize(this, event)
      for (let handler of this.handlers) {
        if (handler.isActive === true) {
          handler.event = event
          handler.onResize(this, this.handlers[handler.name])
        }
      }
    }
  }

  _handleResizeEnd() {
    this.isResizing = false

    this.resizeEndTime = Date.now()
    this.resizeDuration = this.resizeEndTime - this.resizeStartTime

    this.endSize = this.size
    this.currentSize = this.size

    this.onResizeEnd(this)

    for (let handler of this.handlers) {
      if (handler.isActive === true) {
        handler.isActive = false
        handler.event = event
        handler.onResizeEnd(this, this.handlers[handler.name])
      }
    }
  }

}