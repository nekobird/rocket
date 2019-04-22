import {
  Point,
  Vector2,
} from '../rocket'

export interface ScrollEventHandlerConditionHook {
  (
    event: Event,
    context: ScrollEventHandler
  ): boolean
}

export class ScrollEventHandler {

  public name: string

  public event: Event

  public isScrolling: boolean = false

  public scrollStartTime: number
  public scrollEndTime: number
  public duration: number

  public conditionScroll: ScrollEventHandlerConditionHook = () => { return true }

  public onScrollStart: Function = () => { }
  public onScrollEnd: Function = () => { }
  public onScroll: Function = () => { }

  public debounce: Function

  public target: HTMLElement | Window

  public position: Vector2
  public velocity: Vector2
  public acceleration: Vector2

  public previousPosition: Vector2
  public previousVelocity: Vector2

  constructor(target: HTMLElement | Window) {
    this.target = target

    this.position = new Vector2
    this.velocity = new Vector2
    this.acceleration = new Vector2

    this.previousPosition = new Vector2
    this.previousVelocity = new Vector2
  }

  get scrollPosition(): Vector2 {
    if (this.target === window) {
      return new Vector2(
        window.scrollX,
        window.scrollY
      )
    }
    return new Vector2(
      (<HTMLElement>this.target).scrollLeft,
      (<HTMLElement>this.target).scrollTop
    )
  }

  set top(top: number) {
    if (this.target === window) {
      window.scrollTo(window.scrollX, top)
    } else {
      (<HTMLElement>this.target).scrollTop = top
    }
    this.update()
  }

  get top(): number {
    if (this.target === window) {
      return window.scrollY
    }
    return (<HTMLElement>this.target).scrollTop
  }

  set left(left: number) {
    if (this.target === window) {
      window.scrollTo(left, window.scrollY)
    } else {
      (<HTMLElement>this.target).scrollLeft = left
    }
    this.update()
  }

  get left(): number {
    if (this.target === window) {
      return window.scrollX
    }
    return (<HTMLElement>this.target).scrollLeft
  }

  set scrollTo(to: Point) {
    if (this.target === window) {
      window.scrollTo(to.x, to.y)
    } else {
      (<HTMLElement>this.target).scrollLeft = to.x;
      (<HTMLElement>this.target).scrollTop = to.y
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

  // HANDLE

  public handleScroll = (event: Event) => {
    this.event = event

    this.position.equals(this.scrollPosition)
    this.velocity.equals(
      Vector2.subtract(this.position, this.previousPosition)
    )
    this.acceleration.equals(
      Vector2.subtract(this.velocity, this.previousVelocity)
    )

    if (this.isScrolling === false) {
      if (this.conditionScroll(event, this) === true) {
        this.scrollStartTime = Date.now()
        this.isScrolling = true
        this.onScrollStart(this.position, this)
      }
    } else {
      this.acceleration.equals(
        Vector2.subtract(this.velocity, this.previousVelocity)
      )
      this.onScroll(this.position, this)
    }

    this.previousPosition.equals(this.position)
    this.previousVelocity.equals(this.velocity)
  }

  public handleScrollEnd = () => {
    if (this.isScrolling === true) {
      this.scrollEndTime = Date.now()
      this.duration = this.scrollEndTime - this.scrollStartTime
      this.isScrolling = false
      this.onScrollEnd(this.position, this)
    }
  }

}