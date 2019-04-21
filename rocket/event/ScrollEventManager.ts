import {
  ScrollEventHandler,
  Util,
  Vector2,
} from '../rocket'

export interface ScrollEventHandlers {
  [name: string]: ScrollEventHandler
}

export class ScrollEventManager {

  public debounceWait: number = 0.2

  public isScrolling: boolean = false

  public onEvent: Function = () => { }

  public onScrollStart: Function = () => { }
  public onScrollEnd: Function = () => { }
  public onScroll: Function = () => { }

  public handlers: ScrollEventHandlers

  constructor() {
    this.handlers = {}
    this.startListening()
  }

  public register(name: string, handler: ScrollEventHandler): this {
    this.handlers[name] = handler
    this.handlers[name].name = name
    return this
  }

  public remove(name: string): this {
    this.handlers[name].target.removeEventListener(
      'scroll',
      this.eventHandlerScroll
    )
    this.handlers[name].target.removeEventListener(
      'scroll',
      <EventListener>this.handlers[name].debounce
    )
    delete this.handlers[name]
    return this
  }

  public find(name: string): ScrollEventHandler | false {
    if (typeof this.handlers[name] === 'object') {
      return this.handlers[name]
    }
    return false
  }

  // HANDLE

  private eventHandlerScroll = (event: Event) => {
    Object.keys(this.handlers).forEach(handlerName => {
      this.handlers[handlerName].handleScroll(event)
    })
  }

  private handleScrollEnd = () => {
    Object.keys(this.handlers).forEach(handlerName => {
      this.handlers[handlerName].handleScroll(event)
    })
  }

  // LISTEN

  public startListening(): ScrollEventManager {
    Object.keys(this.handlers).forEach(handlerName => {
      this.handlers[handlerName].debounce = Util.debounce(
        this.debounceWait,
        this.handlers[handlerName].handleScrollEnd.bind(this)
      )
      this.handlers[handlerName].target.addEventListener(
        'scroll',
        this.handlers[handlerName].handleScroll.bind(this)
      )
      this.handlers[handlerName].target.addEventListener(
        'scroll',
        this.handlers[handlerName].debounce.bind(this)
      )
    })
    return this
  }

  public stopListening(): ScrollEventManager {
    Object.keys(this.handlers).forEach(handlerName => {
      this.handlers[handlerName].target.removeEventListener(
        'scroll',
        this.eventHandlerScroll
      )
      this.handlers[handlerName].target.removeEventListener(
        'scroll',
        <EventListener>this.handlers[handlerName].debounce
      )
    })
    return this
  }

}