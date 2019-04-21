import {
  Point,
  Vector2,
} from '../rocket'


interface ConditionHook {
  (
    event: Event,
    context: ScrollEventHandler
  ): boolean
}

export class ScrollEventHandler {

  public name: string

  public lastFiredEvent: Event

  public isScrolling: boolean = false

  public time_scrollStart: number
  public time_scrollEnd: number

  public duration: number

  public condition_scroll: ConditionHook = () => {
    return true
  }

  public onScrollStart: Function = () => { }
  public onScrollEnd: Function = () => { }
  public onScroll: Function = () => { }

  public debounce: Function

  public element: HTMLElement | Window

  public _position: Vector2
  public _velocity: Vector2
  public _acceleration: Vector2

  public _previousPosition: Vector2
  public _previousVelocity: Vector2

  constructor(element: HTMLElement | Window) {
    this.element = element

    this._position = new Vector2
    this._velocity = new Vector2
    this._acceleration = new Vector2

    this._previousPosition = new Vector2
    this._previousVelocity = new Vector2
  }

  get position(): Vector2 {
    if (this.element === window) {
      return new Vector2(
        window.scrollX,
        window.scrollY
      )
    } else {
      return new Vector2(
        (<HTMLElement>this.element).scrollLeft,
        (<HTMLElement>this.element).scrollTop
      )
    }
  }

  set top(top: number) {
    if (this.element === window) {
      window.scrollTo(window.scrollX, top)
    } else {
      (<HTMLElement>this.element).scrollTop = top
    }
    this.update()
  }

  get top(): number {
    if (this.element === window) {
      return window.scrollY
    } else {
      return (<HTMLElement>this.element).scrollTop
    }
  }

  set left(left: number) {
    if (this.element === window) {
      window.scrollTo(left, window.scrollY)
    } else {
      (<HTMLElement>this.element).scrollLeft = left
    }
    this.update()
  }

  get left(): number {
    if (this.element === window) {
      return window.scrollX
    } else {
      return (<HTMLElement>this.element).scrollLeft
    }
  }

  set scrollTo(to: Point) {
    if (this.element === window) {
      window.scrollTo(to.x, to.y)
    } else {
      (<HTMLElement>this.element).scrollLeft = to.x;
      (<HTMLElement>this.element).scrollTop = to.y
    }
    this.update()
  }

  public update() {
    let currentPosition: Vector2 = this.position
    let currentVelocity: Vector2 = Vector2.subtract(
      this._position, currentPosition
    )
    this._acceleration.equals(
      Vector2.subtract(currentVelocity, this._velocity)
    )
    this._velocity.equals(currentVelocity)
    this._position.equals(currentPosition)
    return this
  }

  // HANDLE

  public handle_scroll(event: Event): ScrollEventHandler {
    this.lastFiredEvent = event

    this._position.equals(this.position)
    this._velocity.equals(
      Vector2.subtract(this._position, this._previousPosition)
    )
    this._acceleration.equals(
      Vector2.subtract(this._velocity, this._previousVelocity)
    )

    if (this.isScrolling === false) {
      if (this.condition_scroll(event, this) === true) {
        this.time_scrollStart = Date.now()

        this.isScrolling = true

        this.onScrollStart(this._position, this)
      }
    } else {
      this._acceleration.equals(
        Vector2.subtract(this._velocity, this._previousVelocity)
      )
      this.onScroll(this._position, this)
    }

    this._previousPosition.equals(this._position)
    this._previousVelocity.equals(this._velocity)
    return this
  }

  public handle_scrollEnd(): ScrollEventHandler {
    if (this.isScrolling === true) {
      this.time_scrollEnd = Date.now()
      this.duration = this.time_scrollEnd - this.time_scrollStart

      this.isScrolling = false

      this.onScrollEnd(this._position, this)
    }
    return this
  }

}