import {
  Size,
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

  public debounce
  public debounceTime: number = 0.2

  public isResizing = false

  public onResizeStart: Function = () => { }
  public onResize: Function = () => { }
  public onResizeEnd: Function = () => { }

  public resizeStartTime
  public resizeEndTime
  public resizeDuration

  public startSize
  public currentSize
  public endSize

  public handlers

  constructor() {
    this.handlers = []
    this.startListening()
    return this
  }

  get size(): Size {
    return {
      height: ScreenModel.height,
      width: ScreenModel.width
    }
  }

  // Copies handler?
  public register(name: string, handler) {
    this.handlers[name] = new Object
    let _handler = this.handlers[name]
    _handler.name = name
    _handler.isResizing = false
    for (let key in handler) {
      _handler[key] = handler[key]
    }
    return this
  }

  public remove(name: string) {
    delete this.handlers[name]
    return this
  }

  public find(name: string) {
    return this.handlers[name]
  }

  // HANDLERS

  public handleResize(event: Event) {
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

  public handleResizeEnd() {
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

  // LISTEN

  public startListening() {
    this.debounce = Util.debounce(this.debounceTime, this.handleResizeEnd)
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('resize', this.debounce)
    return this
  }

  public stopListening() {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('resize', this.debounce)
    return this
  }

}