import {
  Util,
  Point,
  Vector2,
} from '../../rocket'

export interface ScrollManagerConfig {
  target?: HTMLElement | Window

  onScroll?     : Function
  onScrollStart?: Function
  onScrollEnd?  : Function

  debounceWait?: number
}

export interface ScrollPosition {
  left: number
  top : number
}

export const SCROLLMANAGER_DEFAULT_CONFIG: ScrollManagerConfig = {
  target: window,

  onScroll: () => {},
  onScrollStart: () => {},
  onScrollEnd: () => {},

  debounceWait: 200
}

export type ScrollManagerTriggerDirectionY = 'down' | 'up' | 'both'
export type ScrollManagerTriggerDirectionX = 'left' | 'right' | 'both'

export interface ScrollManagerTrigger {
  name: string
  watchX: boolean
  watchY: boolean
  conditionTrigger: () => boolean
  triggerAt: () => ScrollPosition | ScrollPosition[]
  onTrigger: () => void
  isTriggered: boolean
  triggerDirectionX: ScrollManagerTriggerDirectionX
  triggerDirectionY: ScrollManagerTriggerDirectionY
  triggerOnce: boolean
}

export interface ScrollManagerTriggerMap {

}

export class ScrollManager {

  public isScrolling: boolean = false

  public startTime: number
  public endTime: number
  public duration: number

  private debounce: Function

  public position: Vector2
  public velocity: Vector2
  public acceleration: Vector2

  public previousPosition: Vector2
  public previousVelocity: Vector2

  public config: ScrollManagerConfig

  constructor(config?: ScrollManagerConfig) {
    this.config = Object.assign({}, SCROLLMANAGER_DEFAULT_CONFIG)

    if (typeof config === 'object') {
      this.setConfig(config)
    }

    this.position = new Vector2
    this.velocity = new Vector2
    this.acceleration = new Vector2

    this.previousPosition = new Vector2
    this.previousVelocity = new Vector2
  }

  public setConfig(config: ScrollManagerConfig) {
    Object.assign(this.config, config)
  }

  get scrollPosition(): Vector2 {
    if (this.config.target === window) {
      return new Vector2(
        window.scrollX,
        window.scrollY
      )
    }
    return new Vector2(
      (<HTMLElement>this.config.target).scrollLeft,
      (<HTMLElement>this.config.target).scrollTop
    )
  }

  set top(top: number) {
    if (this.config.target === window) {
      window.scrollTo(window.scrollX, top)
    } else {
      (<HTMLElement>this.config.target).scrollTop = top
    }
    this.update()
  }

  get top(): number {
    if (this.config.target === window) {
      return window.scrollY
    }
    return (<HTMLElement>this.config.target).scrollTop
  }

  set left(left: number) {
    if (this.config.target === window) {
      window.scrollTo(left, window.scrollY)
    } else {
      (<HTMLElement>this.config.target).scrollLeft = left
    }
    this.update()
  }

  get left(): number {
    if (this.config.target === window) {
      return window.scrollX
    }
    return (<HTMLElement>this.config.target).scrollLeft
  }

  set scrollTo(to: Point) {
    if (this.config.target === window) {
      window.scrollTo(to.x, to.y)
    } else {
      (<HTMLElement>this.config.target).scrollLeft = to.x;
      (<HTMLElement>this.config.target).scrollTop = to.y
    }
    this.update()
  }

  public update(): this {
    const currentPosition: Vector2 = this.scrollPosition
    const currentVelocity: Vector2 = Vector2.subtract(
      this.position, currentPosition
    )
    this.acceleration.equals(
      Vector2.subtract(currentVelocity, this.velocity)
    )
    this.velocity.equals(currentVelocity)
    this.position.equals(currentPosition)
    return this
  }

  // EVENT HANDLER

  public eventHandlerScroll = event => {
    this.position.equals(this.scrollPosition)
    this.velocity.equals(
      Vector2.subtract(this.position, this.previousPosition)
    )
    this.acceleration.equals(
      Vector2.subtract(this.velocity, this.previousVelocity)
    )

    if (this.isScrolling === false) {
      this.isScrolling = true
      this.startTime = Date.now()
      this.config.onScrollStart(this.position, this)
    } else {
      this.acceleration.equals(
        Vector2.subtract(this.velocity, this.previousVelocity)
      )
      this.config.onScroll(this.position, this)
    }

    this.previousPosition.equals(this.position)
    this.previousVelocity.equals(this.velocity)
  }

  public eventHandlerScrollEnd = () => {
    if (this.isScrolling === true) {
      this.endTime = Date.now()
      this.duration = this.endTime - this.startTime
      this.isScrolling = false
      this.config.onScrollEnd(this.position, this)
    }
  }

  public listen() {
    window.addEventListener('scroll', this.eventHandlerScroll)
    this.debounce = Util.debounce(this.config.debounceWait, this.eventHandlerScrollEnd)
    window.addEventListener('scroll', <EventListener>this.debounce)
  }

  public stopListen() {
    window.removeEventListener('scroll', this.eventHandlerScroll)
  }

}