import {
  Size,
  Util,
  ScreenModel,
} from '../Rocket'

interface ScreenHandler {
  name?: string,
  event?: Event,

  isResizing?: boolean,

  determine?: Function,

  onResize?: Function,
  onResizeEnd?: Function,
  onResizeStart?: Function,
}

export class ScreenEventManager {

  public debounce
  public debounceTime: number = 0.2

  public isResizing: boolean = false

  public onResizeStart: Function = () => { }
  public onResize: Function = () => { }
  public onResizeEnd: Function = () => { }

  public time_resizeStart: number
  public time_resizeEnd: number
  public duration: number

  public size_start: Size
  public size_current: Size
  public size_end: Size

  public handlers: ScreenHandler[]

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
  public register(name: string, handler: ScreenHandler): ScreenEventManager {
    this.handlers[name] = Object.assign({
      name: name,
      isResizing: false,
    }, handler)
    return this
  }

  public remove(name: string): ScreenEventManager {
    delete this.handlers[name]
    return this
  }

  public find(name: string): ScreenHandler {
    return this.handlers[name]
  }

  // HANDLERS

  public eventHandler_resize(event: Event): ScreenEventManager {
    if (this.isResizing === false) {
      this.time_resizeStart = Date.now()

      this.size_current = this.size
      this.size_start = this.size

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
      this.size_current = this.size

      this.onResize(this, event)
      for (let handler of this.handlers) {
        if (handler.isResizing === true) {
          handler.event = event
          handler.onResize(this, this.handlers[handler.name])
        }
      }
    }
    return this
  }

  public eventHandler_resizeEnd(): ScreenEventManager {
    this.time_resizeEnd = Date.now()
    this.duration = this.time_resizeEnd - this.time_resizeStart

    this.size_current = this.size
    this.size_end = this.size

    this.isResizing = false

    this.onResizeEnd(this)
    this.handlers.forEach(handler => {
      if (handler.isResizing === true) {
        handler.isResizing = false
        handler.event = event
        handler.onResizeEnd(this, this.handlers[handler.name])
      }
    })
    return this
  }

  // LISTEN

  public startListening(): ScreenEventManager {
    this.debounce = Util.debounce(this.debounceTime, this.eventHandler_resizeEnd)
    window.addEventListener('resize', this.eventHandler_resize)
    window.addEventListener('resize', this.debounce)
    return this
  }

  public stopListening(): ScreenEventManager {
    window.removeEventListener('resize', this.eventHandler_resize)
    window.removeEventListener('resize', this.debounce)
    return this
  }

}