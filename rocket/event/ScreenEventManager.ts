import {
  ScreenModel,
  Size,
  Util,
} from '../rocket'

export interface ScreenHandler {
  name: string,
  isResizing: boolean,
  conditionResize: ScreenHandlerConditionHook,
  onResizeStart: ScreenHandlerHook,
  onResizeEnd: ScreenHandlerHook,
  onResize: ScreenHandlerHook,
}

export interface ScreenHandlerConditionHook {
  (event: Event, context: ScreenEventManager): boolean
}

export interface ScreenHandlerHook {
  (event: Event, context: ScreenEventManager): void
}

export interface ScreenEventManagerConfig {
  onResizeStart: ScreenEventManagerHook,
  onResizeEnd: ScreenEventManagerHook,
  onResize: ScreenEventManagerHook,
}

export interface ScreenEventManagerHook {
  (event: Event, context: ScreenEventManager): void
}

export class ScreenEventManager {

  private event: Event

  private debounce: Function
  private debounceWait: number = 0.2

  private _isResizing: boolean = false

  public onResizeStart: ScreenEventManagerHook = () => { }
  public onResizeEnd: ScreenEventManagerHook = () => { }
  public onResize: ScreenEventManagerHook = () => { }

  public timeResizeStart: number
  public timeResizeEnd: number
  public duration: number

  public sizeStart: Size
  public sizeCurrent: Size
  public sizeEnd: Size

  private handlers: ScreenHandler[]

  constructor() {
    this.handlers = []
    this.startListening()
    return this
  }

  get isResizing(): boolean {
    return this._isResizing
  }

  get size(): Size {
    return {
      height: ScreenModel.height,
      width: ScreenModel.width
    }
  }

  // PUBLIC

  public register(name: string, handler: ScreenHandler): this {
    this.handlers[name] = Object.assign({
      name: name,
      isResizing: false,
    }, handler)
    return this
  }

  public remove(name: string): this {
    delete this.handlers[name]
    return this
  }

  public find(name: string): ScreenHandler {
    return this.handlers[name]
  }

  // EVENT HANDLER

  private eventHandlerResize = (event: Event) => {
    this.event = event
    if (this.isResizing === false) {
      this.timeResizeStart = Date.now()

      this.sizeCurrent = this.size
      this.sizeStart = this.size

      this._isResizing = true

      this.onResizeStart(event, this)
      this.handlers.forEach(handler => {
        if (handler.conditionResize(event, this) === true) {
          handler.isResizing = true
          handler.onResizeStart(event, this)
        }
      })
    } else {
      this.sizeCurrent = this.size
      this.onResize(event, this)
      this.handlers.forEach(handler => {
        if (handler.isResizing === true) {
          handler.onResize(event, this)
        }
      })
    }
  }

  private eventHandlerResizeEnd = () => {
    this.timeResizeEnd = Date.now()
    this.duration = this.timeResizeEnd - this.timeResizeStart

    this.sizeCurrent = this.size
    this.sizeEnd = this.size

    this._isResizing = false

    this.onResizeEnd(this.event, this)
    this.handlers.forEach(handler => {
      if (handler.isResizing === true) {
        handler.isResizing = false
        handler.onResizeEnd(event, this)
      }
    })
  }

  // LISTEN

  public startListening(): this {
    this.debounce = Util.debounce(this.debounceWait, this.eventHandlerResizeEnd)
    window.addEventListener('resize', this.eventHandlerResize)
    window.addEventListener('resize', <EventListener>this.debounce)
    return this
  }

  public stopListening(): this {
    window.removeEventListener('resize', this.eventHandlerResize)
    window.removeEventListener('resize', <EventListener>this.debounce)
    return this
  }

}