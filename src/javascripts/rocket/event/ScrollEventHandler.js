import { Vector2 } from '../two/Vector2'

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
  
    onScrollStart = () => {}
    onScroll = () => {}
    onScrollEnd = () => {}
  
    debounce = () => {}

    this.element = element

    this.position = new Vector2
    this.velocity = new Vector2
    this.acceleration = new Vector2

    this.previousPosition = new Vector2
    this.previousVelocity = new Vector2
  }

  handleScroll(event) {
    this.event = event
    this.position.equals(this.getPosition())
    this.velocity.equals(Vector2.subtract(this.position, this.previousPosition))
    this.acceleration.equals(Vector2.subtract(this.velocity, this.previousVelocity))

    if (this.isScrolling === false) {
      if (this.determineScroll(event, this) === true) {
        this.scrollStartTime = Date.now()
        this.isScrolling = true
        this.onScrollStart(this.position, this)
      }
    } else {
      this.acceleration.equals(Vector2.subtract(this.velocity, this.previousVelocity))
      this.onScroll(this.position, this)
    }

    this.previousPosition.equals(this.position)
    this.previousVelocity.equals(this.velocity)
  }

  handleScrollEnd() {
    if (this.isScrolling === true) {
      this.scrollEndTime = Date.now()
      this.scrollDuration = this.scrollEndTime - this.scrollStartTime
      this.isScrolling = false
      this.onScrollEnd(this.position, this)
    }
  }

  getPosition() {
    if (this.element === window) {
      return new Vector2(window.scrollX, window.scrollY)
    } else {
      return new Vector2(this.element.scrollLeft, this.element.scrollTop)
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
        (this.element).scrollTop = top
        result = top
      } else {
        result = (this.element).scrollTop
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
    let currentPosition = this.getPosition()
    let currentVelocity = Vector2.subtract(this.position, currentPosition)
    this.acceleration.equals(Vector2.subtract(currentVelocity, this.velocity))
    this.velocity.equals(currentVelocity)
    this.position.equals(currentPosition)
    return this
  }

}