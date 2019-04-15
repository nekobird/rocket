import {
  ScrollEventHandler,
  Util,
  Vector2,
} from '../Rocket'

interface ScrollEventHandlers {
  [name: string]: ScrollEventHandler
}

export class ScrollEventManager {

  public debounce: Function
  public debounceTime: number = 0.2

  public isScrolling: boolean = false

  public onEvent: Function = () => { }
  public onScrollStart: Function = () => { }
  public onScroll: Function = () => { }
  public onScrollEnd: Function = () => { }

  public handlers: ScrollEventHandlers

  constructor() {
    this.handlers = {}
    this.startListening()
  }

  public register(name: string, handler: ScrollEventHandler): ScrollEventManager {
    this.handlers[name] = handler
    this.handlers[name].name = name
    return this
  }

  public remove(name: string): ScrollEventManager {
    this.handlers[name].element.removeEventListener(
      'scroll', this.eventHandler_scroll
    )
    this.handlers[name].element.removeEventListener(
      'scroll', <EventListener>this.handlers[name].debounce
    )
    delete this.handlers[name]
    return this
  }

  public find(name: string) {
    return this.handlers[name]
  }

  // HANDLE

  private eventHandler_scroll = (event: Event) => {
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].handle_scroll(event)
    })
  }

  private handleScrollEnd = () => {
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].handle_scroll(event)
    })
  }

  // LISTEN

  public startListening(): ScrollEventManager {
    for (let name in this.handlers) {
      this.handlers[name].debounce = Util.debounce(
        this.debounceTime, this.handlers[name].handle_scrollEnd.bind(this)
      )
      this.handlers[name].element.addEventListener(
        'scroll', this.handlers[name].handle_scroll.bind(this)
      )
      this.handlers[name].element.addEventListener(
        'scroll', this.handlers[name].debounce.bind(this)
      )
    }
    return this
  }

  public stopListening(): ScrollEventManager {
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].element.removeEventListener(
        'scroll', this.eventHandler_scroll
      )
      this.handlers[name].element.removeEventListener(
        'scroll', <EventListener>this.handlers[name].debounce
      )
    })
    return this
  }

}