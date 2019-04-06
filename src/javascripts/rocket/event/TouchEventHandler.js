import {
  Vector2,
} from '../Rocket'

export class TouchEventHandler {

  constructor() {
    this.name

    this.identity

    this.lastFiredEvent

    this.touch
    this.touchCount

    this.isTouching = false
    this.isMoving = false

    this.position
    this.velocity
    this.acceleration

    this.previousPosition
    this.previousVelocity

    this.touchStartPosition
    this.touchEndPosition

    this.moveStartPosition
    this.moveEndPosition
    this.movePosition

    this.cancelPosition

    this.touchStartTime
    this.touchEndTime
    this.touchDuration

    this.cancelTime
    this.previousTapTime

    this.moveStartTime
    this.moveEndTime
    this.moveDuration

    this.determine = () => { return false }

    this.onDoubleTap = () => { }

    this.onTouchStart = () => { }
    this.onTouchEnd = () => { }

    this.onCancel = () => { }

    this.onMoveStart = () => { }
    this.onMove = () => { }
    this.onMoveEnd = () => { }

    this.doubleTapCounter = 0
    this.doubleTapMaximumTouchTime = 500
    this.doubleTapMaximumDelayTime = 500

    this.initialize()
  }

  initialize() {
    this.acceleration = new Vector2
    this.position = new Vector2
    this.velocity = new Vector2

    this.touchEndPosition = new Vector2
    this.touchStartPosition = new Vector2

    this.moveEndPosition = new Vector2
    this.movePosition = new Vector2
    this.moveStartPosition = new Vector2

    this.previousPosition = new Vector2
    this.previousVelocity = new Vector2
    this.cancelPosition = new Vector2
    return this
  }

  handleTouchStart(event, touch) {
    this.lastFiredEvent = event
    this.touch = touch
    let point = new Vector2(touch.clientX, touch.clientY)
    if (this.determine(point, this) === true) {
      this.touchStartPosition.equals(point)
      this.touchStartTime = Date.now()
      this.identity = touch.identifier
      this.isTouching = true
      this.onTouchStart(point, this)
    }
  }

  handleTouchEnd(event, touch) {
    if (
      this.identity === touch.identifier &&
      this.isTouching === true
    ) {
      if (this.isMoving === true) {
        this.handleTouchMoveEnd()
      }
      let point = new Vector2(touch.clientX, touch.clientY)
      this.touchEndPosition.equals(point)
      this.touchEndTime = Date.now()
      this.touchDuration = this.touchEndTime - this.touchStartTime
      this.isTouching = false
      this.touchCount++
      this.identity = undefined
      this.onTouchEnd(point, this)
      this.handleDoubleTap()
    }
  }

  handleTouchMove(event, touch) {
    if (
      this.identity === touch.identifier &&
      this.isTouching === true
    ) {
      this.lastFiredEvent = event
      this.touch = touch
      let point = new Vector2(touch.clientX, touch.clientY)
      // TouchMoveStart
      if (this.isMoving === false) {
        this.position.equals(point)
        this.previousPosition.equals(point)
        this.moveStartPosition.equals(point)
        this.moveStartTime = Date.now()
        this.isMoving = true
        this.onMoveStart(point, this)
        // TouchMove
      } else {
        this.position.equals(point)
        this.velocity.equals(Vector2.subtract(this.position, this.previousPosition))
        this.acceleration.equals(Vector2.subtract(this.velocity, this.previousVelocity))
        this.moveEndTime = Date.now()
        this.moveDuration = this.moveEndTime - this.moveStartTime
        this.onMove(point, this)
        this.previousPosition.equals(point)
        this.previousVelocity.equals(this.velocity)
      }
    }
  }

  handleTouchMoveEnd() {
    if (this.isMoving === true) {
      this.moveEndTime = Date.now()
      this.moveDuration = this.moveEndTime - this.moveStartTime
      this.isMoving = false
      this.onMoveEnd(this.position, this)
    }
  }

  handleTouchCancel(event, touch) {
    if (
      this.identity === touch.identifier &&
      this.isTouching === true
    ) {
      this.handleTouchMoveEnd()
      this.handleTouchEnd(event, touch)
      let point = new Vector2(touch.clientX, touch.clientY)
      this.cancelTime = Date.now()
      this.cancelPosition.equals(point)
      this.onCancel(point, this)
    }
  }

  handleDoubleTap() {
    if (
      this.touchDuration < this.doubleTapMaximumTouchTime &&
      this.doubleTapCounter === 0
    ) {
      this.previousTapTime = Date.now()
      this.doubleTapCounter++
    } else if (
      this.touchDuration < this.doubleTapMaximumTouchTime &&
      Date.now() - this.previousTapTime < this.doubleTapMaximumDelayTime &&
      this.doubleTapCounter === 1
    ) {
      this.doubleTapCounter = 0
      this.onDoubleTap(this.position, this)
    } else {
      this.doubleTapCounter = 0
    }
  }

}