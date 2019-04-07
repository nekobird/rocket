import {
  Vector2
} from '../Rocket'

export class ScrollEventHandler {

  constructor(element) {
    this.name

    this.lastFiredEvent

    this.isScrolling = false

    this.scrollStartTime
    this.scrollEndTime
    this.scrollDuration

    determineScroll = () => {
      return true
    }

    onScrollStart = () => {}
    onScroll = () => {}
    onScrollEnd = () => {}

    this.debounce

    this.element = element

    this._position = new Vector2
    this._velocity = new Vector2
    this._acceleration = new Vector2

    this._previousPosition = new Vector2
    this._previousVelocity = new Vector2
  }

  get position() {
    if (this.element === window) {
      return new Vector2(window.scrollX, window.scrollY)
    } else {
      return new Vector2(
        this.element.scrollLeft, this.element.scrollTop
      )
    }
  }

  set top(top) {
    if (typeof top === 'number') {
      if (this.element === window) {
        window.scrollTo(window.scrollX, top)
      } else {
        this.element.scrollTop = top
      }
      this.update()
    }
  }

  get top() {
    return this.element === window ? window.scrollY : this.element.scrollTop
  }

  set left(left) {
    if (typeof left === 'number') {
      if (this.element === window) {
        window.scrollTo(left, window.scrollY)
      } else {
        this.element.scrollLeft = left
      }
      this.update()
    }
  }

  get left() {
    return this.element === window ? window.scrollX : this.element.scrollLeft
  }

  scrollTo(to) {
    if (this.element === window) {
      window.scrollTo(to.x, to.y)
    } else {
      this.element.scrollLeft = to.x
      this.element.scrollTop = to.y
    }

    this.update()

    return this
  }

  update() {
    let currentPosition = this.position
    let currentVelocity = Vector2.subtract(
      this._position, currentPosition
    )
    this._acceleration.equals(
      Vector2.subtract(currentVelocity, this._velocity)
    )
    this._velocity.equals(currentVelocity)
    this._position.equals(currentPosition)
    return this
  }

  // HANDLERS

  handleScroll(event) {
    this.lastFiredEvent = event

    this._position.equals(this.position)
    this._velocity.equals(
      Vector2.subtract(this._position, this._previousPosition)
    )
    this._acceleration.equals(
      Vector2.subtract(this._velocity, this._previousVelocity)
    )

    if (this.isScrolling === false) {
      if (this.determineScroll(event, this) === true) {
        this.scrollStartTime = Date.now()

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
  }

  handleScrollEnd() {
    if (this.isScrolling === true) {
      this.scrollEndTime = Date.now()
      this.scrollDuration = this.scrollEndTime - this.scrollStartTime

      this.isScrolling = false

      this.onScrollEnd(this._position, this)
    }
  }

}