import {
  ScrollEventHandler,
  Util,
  Vector2,
} from '../Rocket'

export class ScrollEventManager {

  constructor() {
    this.debounce
    this.debounceTime = 0.2

    this.isScrolling = false

    this.onEvent = () => { }

    this.onScrollStart = () => { }
    this.onScroll = () => { }
    this.onScrollEnd = () => { }

    this.handlers = {}

    this.startListening()
  }

  register(name, handler) {
    this.handlers[name] = handler
    this.handlers[name].name = name
    return this
  }

  find(name) {
    return this.handlers[name]
  }

  remove(name) {
    this.handlers[name].element.removeEventListener(
      'scroll', this.handleScroll
    )
    this.handlers[name].element.removeEventListener(
      'scroll', this.handlers[name].debounce
    )
    delete this.handlers[name]
    return this
  }

  handleScroll(event) {
    for (let name in this.handlers) {
      this.handlers[name].handleScroll(event)
    }
  }

  handleScrollEnd() {
    for (let name in this.handlers) {
      this.handlers[name].handleScroll(event)
    }
  }

  startListening() {
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

  stopListening() {
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