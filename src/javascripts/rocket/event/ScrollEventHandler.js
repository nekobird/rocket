import { Vector2 } from '../Rocket'

export class ScrollEventHandler {

  constructor(element) {
    this.data
    this.name

    this.event

    this.isScrolling = false

    this.scrollStartTime
    this.scrollEndTime
    this.scrollDuration

    determineScroll = () => { return true }

    onScrollStart = () => { }
    onScroll = () => { }
    onScrollEnd = () => { }

    debounce = () => { }

    this.element = element

    this._position = new Vector2
    this._velocity = new Vector2
    this._acceleration = new Vector2

    this._previousPosition = new Vector2
    this._previousVelocity = new Vector2
  }

  handleScroll(event) {
    this.event = event

    this._position.equals(this.getPosition())
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

  get position() {
    if (this.element === window) {
      return new Vector2(window.scrollX, window.scrollY)
    } else {
      return new Vector2(
        this.element.scrollLeft, this.element.scrollTop
      )
    }
  }

  scrollLeft(left) {
    let result

    if (this.element === window) {
      if (typeof left === 'number') {
        window.scrollTo(left, window.scrollY)
        result = left
      } else {
        result = window.scrollX
      }
    } else {
      if (typeof left === 'number') {
        (this.element).scrollLeft = left
        result = left
      } else {
        result = (this.element).scrollLeft
      }
    }

    this.update()

    return result
  }

  scrollTop(top) {
    let result

    if (this.element === window) {
      if (typeof top === 'number') {
        window.scrollTo(window.scrollX, top)
        result = top
      } else {
        result = window.scrollY
      }
    } else {
      if (typeof top === 'number') {
        this.element.scrollTop = top
        result = top
      } else {
        result = this.element.scrollTop
      }
    }

    this.update()

    return result
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
    let currentPosition = this.position()
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

}