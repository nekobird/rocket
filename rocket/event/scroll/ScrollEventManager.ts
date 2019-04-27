import {
  ScrollEventHandler,
  Util,
  Vector2,
} from '../../rocket'

export interface ScrollEventHandlers {
  [name: string]: ScrollEventHandler
}

export class ScrollEventManager {

  public handlers: ScrollEventHandlers
  public debounceWait: number = 0.2

  constructor() {
    this.handlers = {}
  }

  public register(name: string, handler: ScrollEventHandler): this {
    this.handlers[name] = handler
    this.handlers[name].name = name
    return this
  }

  public remove(name: string): this {
    this.handlers[name].target.removeEventListener(
      'scroll',
      this.handlers[name].handleScroll
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

  // LISTEN

  public listen(): this {
    Object.keys(this.handlers).forEach(handlerName => {
      this.handlers[handlerName].debounce = Util.debounce(
        this.debounceWait,
        this.handlers[handlerName].handleScrollEnd
      )
      this.handlers[handlerName].target.addEventListener(
        'scroll',
        this.handlers[handlerName].handleScroll
      )
      this.handlers[handlerName].target.addEventListener(
        'scroll',
        <EventListener>this.handlers[handlerName].debounce
      )
    })
    return this
  }

  public stopListen(): this {
    Object.keys(this.handlers).forEach(handlerName => {
      this.handlers[handlerName].target.removeEventListener(
        'scroll',
        this.handlers[handlerName].handleScroll
      )
      this.handlers[handlerName].target.removeEventListener(
        'scroll',
        <EventListener>this.handlers[handlerName].debounce
      )
    })
    return this
  }

}