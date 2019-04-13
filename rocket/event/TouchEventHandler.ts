import {
  TouchPoint,
  Vector2,
} from '../Rocket'

export class TouchEventHandler {

  public name: string

  public identity

  public lastFiredEvent: TouchEvent

  public touch
  public touchCount: number

  public isTouching: boolean = false
  public isMoving: boolean = false

  public position: Vector2
  public velocity: Vector2
  public acceleration: Vector2

  public previousPosition: Vector2
  public previousVelocity: Vector2
  public cancelPosition: Vector2

  public touchStartPosition: Vector2
  public touchEndPosition: Vector2

  public movePosition: Vector2
  public moveStartPosition: Vector2
  public moveEndPosition: Vector2

  public touchStartTime: number
  public touchEndTime: number
  public touchDuration: number

  public cancelTime: number
  public previousTapTime: number

  public moveStartTime: number
  public moveEndTime: number
  public moveDuration: number

  public determine: Function

  public onDoubleTap: Function

  public onTouchStart: Function
  public onTouchEnd: Function

  public onCancel: Function

  public onMoveStart: Function
  public onMove: Function
  public onMoveEnd: Function

  public doubleTapCounter: number = 0
  public doubleTapMaximumTouchTime: number = 500
  public doubleTapMaximumDelayTime: number = 500

  constructor() {
    this.position = new Vector2
    this.velocity = new Vector2
    this.acceleration = new Vector2

    this.previousPosition = new Vector2
    this.previousVelocity = new Vector2
    this.cancelPosition = new Vector2

    this.touchStartPosition = new Vector2
    this.touchEndPosition = new Vector2

    this.movePosition = new Vector2
    this.moveStartPosition = new Vector2
    this.moveEndPosition = new Vector2

    // CALLBACKS
    this.determine = (point, context) => {
      return false
    }

    this.onDoubleTap = (point: TouchPoint, context) => { }

    this.onTouchStart = () => { }
    this.onTouchEnd = () => { }

    this.onCancel = () => { }

    this.onMoveStart = () => { }
    this.onMove = () => { }
    this.onMoveEnd = () => { }

    this.doubleTapCounter = 0
    this.doubleTapMaximumTouchTime = 500
    this.doubleTapMaximumDelayTime = 500
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