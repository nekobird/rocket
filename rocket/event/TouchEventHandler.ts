import {
  Point,
  TouchPoint,
  Vector2,
} from '../Rocket'

interface ConditionHook {
  (
    point: Point,
    touch: Touch,
    context: TouchEventHandler
  ): boolean
}

export class TouchEventHandler {

  public name: string

  public identity: number

  public lastFiredEvent: TouchEvent

  public touch: Touch

  public count_touch: number

  public isTouching: boolean = false
  public isMoving: boolean = false

  // POINTS
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

  // TIME
  public time_touch_start: number
  public time_touch_end: number

  public time_move_start: number
  public time_move_end: number

  public time_touchCancel: number
  public time_previousTap: number

  public duration_touch: number
  public duration_move: number

  // CONDITION
  public determine: ConditionHook

  // HOOKS
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
    this.determine = (point, touch, context): boolean => {
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

  public handle_touchStart(event: TouchEvent, touch: Touch) {
    this.lastFiredEvent = event
    this.touch = touch
    let point = new Vector2(touch.clientX, touch.clientY)
    if (this.determine(point, touch, this) === true) {
      this.touchStartPosition.equals(point)
      this.time_touch_start = Date.now()
      this.identity = touch.identifier
      this.isTouching = true
      this.onTouchStart(point, this)
    }
  }

  public handle_touchEnd(event, touch) {
    if (
      this.identity === touch.identifier &&
      this.isTouching === true
    ) {
      if (this.isMoving === true) {
        this.handle_moveEnd()
      }
      const point: Vector2 = new Vector2(touch.clientX, touch.clientY)
      this.touchEndPosition.equals(point)
      this.time_touch_end = Date.now()
      this.duration_touch = this.time_touch_end - this.time_touch_start
      this.isTouching = false
      this.count_touch++
      this.identity = undefined
      this.onTouchEnd(point, this)
      this.handle_doubleTap()
    }
  }

  public handle_move(event, touch) {
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
        this.time_move_start = Date.now()
        this.isMoving = true
        this.onMoveStart(point, this)
        // TouchMove
      } else {
        this.position.equals(point)
        this.velocity.equals(Vector2.subtract(this.position, this.previousPosition))
        this.acceleration.equals(Vector2.subtract(this.velocity, this.previousVelocity))
        this.time_move_end = Date.now()
        this.duration_move = this.time_move_end - this.time_move_start
        this.onMove(point, this)
        this.previousPosition.equals(point)
        this.previousVelocity.equals(this.velocity)
      }
    }
  }

  public handle_moveEnd() {
    if (this.isMoving === true) {
      this.time_move_end = Date.now()
      this.duration_move = this.time_move_end - this.time_move_start
      this.isMoving = false
      this.onMoveEnd(this.position, this)
    }
  }

  public handle_touchCancel(event, touch) {
    if (
      this.identity === touch.identifier &&
      this.isTouching === true
    ) {
      this.handle_moveEnd()
      this.handle_touchEnd(event, touch)
      let point = new Vector2(touch.clientX, touch.clientY)
      this.time_touchCancel = Date.now()
      this.cancelPosition.equals(point)
      this.onCancel(point, this)
    }
  }

  public handle_doubleTap() {
    if (
      this.duration_touch < this.doubleTapMaximumTouchTime &&
      this.doubleTapCounter === 0
    ) {
      this.time_previousTap = Date.now()
      this.doubleTapCounter++
    } else if (
      this.duration_touch < this.doubleTapMaximumTouchTime &&
      Date.now() - this.time_previousTap < this.doubleTapMaximumDelayTime &&
      this.doubleTapCounter === 1
    ) {
      this.doubleTapCounter = 0
      this.onDoubleTap(this.position, this)
    } else {
      this.doubleTapCounter = 0
    }
  }

}