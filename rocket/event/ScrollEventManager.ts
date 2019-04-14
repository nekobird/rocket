import {
  ScrollEventHandler,
  Util,
  Vector2,
} from '../Rocket'

export class ScrollEventManager {

  public debounce
  public debounceTime: number = 0.2

  public isScrolling: boolean = false

  public onEvent: Function = () => { }
  public onScrollStart: Function = () => { }
  public onScroll: Function = () => { }
  public onScrollEnd: Function = () => { }

  public handlers

  constructor() {
    this.handlers = {}
    this.startListening()
  }

  public register(name: string, handler: ScrollEventHandler) {
    this.handlers[name] = handler
    this.handlers[name].name = name
    return this
  }

  public remove(name: string): ScrollEventManager {
    this.handlers[name].element.removeEventListener(
      'scroll', this.handleScroll
    )
    this.handlers[name].element.removeEventListener(
      'scroll', this.handlers[name].debounce
    )
    delete this.handlers[name]
    return this
  }

  public find(name: string) {
    return this.handlers[name]
  }

  // HANDLERS

  public handleScroll(event: ScrollEventHandler) {
    for (let name in this.handlers) {
      this.handlers[name].handleScroll(event)
    }
  }

  public handleScrollEnd() {
    for (let name in this.handlers) {
      this.handlers[name].handleScroll(event)
    }
  }

  // LISTEN

  public startListening(): ScrollEventManager {
    for (let name in this.handlers) {
      this.handlers[name].debounce = Util.debounce(
        this.debounceTime, this.handlers[name].handleScrollEnd.bind(this)
      )
      this.handlers[name].element.addEventListener(
        'scroll', this.handlers[name].handleScroll.bind(this)
      )
      this.handlers[name].element.addEventListener(
        'scroll', this.handlers[name].debounce.bind(this)
      )
    }
    return this
  }

  public stopListening(): ScrollEventManager {
    for (let name in this.handlers) {
      this.handlers[name].element.removeEventListener(
        'scroll', this.handleScroll
      )
      this.handlers[name].element.removeEventListener(
        'scroll', this.handlers[name].debounce
      )
    }
    return this
  }

}