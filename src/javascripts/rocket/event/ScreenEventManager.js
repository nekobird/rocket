import {
  Util,
  ScreenModel,
} from '../Rocket'

// SCREEN HANDLER
// name
// event
// isResizing
// determine
// onResize
// onResizeEnd
// onResizeStart

export class ScreenEventManager {

  constructor() {
    this.debounce
    this.debounceTime = 0.2

    this.isResizing = false

    this.onResizeStart = () => { }
    this.onResize = () => { }
    this.onResizeEnd = () => { }

    this.resizeStartTime
    this.resizeEndTime
    this.resizeDuration

    this.startSize
    this.currentSize
    this.endSize

    this.handlers = new Array

    this.startListening()
    return this
  }

  // Copies handler?
  register(name, handler) {
    this.handlers[name] = new Object
    let _handler = this.handlers[name]
    _handler.name = name
    _handler.isResizing = false
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

  handleResize(event) {
    if (this.isResizing === false) {
      this.resizeStartTime = Date.now()

      this.currentSize = this.size
      this.startSize = this.size

      this.isResizing = true

      this.onResizeStart(this, event)

      for (let handler of this.handlers) {
        if (handler.determine(this, event) === true) {
          handler.event = event
          handler.isResizing = true
          handler.onResizeStart(this, this.handlers[handler.name])
        }
      }
    } else {
      this.currentSize = this.size

      this.onResize(this, event)
      for (let handler of this.handlers) {
        if (handler.isResizing === true) {
          handler.event = event
          handler.onResize(this, this.handlers[handler.name])
        }
      }
    }
  }

  handleResizeEnd() {
    this.resizeEndTime = Date.now()
    this.resizeDuration = this.resizeEndTime - this.resizeStartTime

    this.currentSize = this.size
    this.endSize = this.size

    this.isResizing = false

    this.onResizeEnd(this)
    for (let handler of this.handlers) {
      if (handler.isResizing === true) {
        handler.isResizing = false
        handler.event = event
        handler.onResizeEnd(this, this.handlers[handler.name])
      }
    }
  }

  // LISTENER
  startListening() {
    this.debounce = Util.debounce(
      this.debounceTime, this.handleResizeEnd.bind(this)
    )
    window.addEventListener('resize', this.handleResize.bind(this))
    window.addEventListener('resize', this.debounce.bind(this))
    return this
  }

  stopListening() {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('resize', this.debounce)
    return this
  }

}