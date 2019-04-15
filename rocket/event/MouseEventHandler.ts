import {
  Vector2,
} from '../Rocket'

export class MouseEventHandler {

  public name: string

  public lastFiredEvent: MouseEvent

  public isDown: boolean = false
  public isMoving: boolean = false
  public isDragging: boolean = false

  public clickCount: number = 0
  public clickTime: number = 0

  public downStartTime: number
  public downEndTime: number
  public downDuration: number

  public moveStartTime: number
  public moveEndTime: number
  public moveDuration: number

  public dragStartTime: number
  public dragEndTime: number
  public dragDuration: number

  public doubleClickCounter: number = 0
  public doubleClickMaximumDelayTime: number = 500

  public determineClick: Function = (point, context) => {
    return true
  }
  public determineDown: Function = (point, context) => {
    return true
  }
  public determineMove: Function = (point, context) => {
    return true
  }
  public determineDrag: Function = (point, context) => {
    return true
  }

  public onClick: Function = (point, context) => { }
  public onDoubleClick: Function = (point, context) => { }

  public onDownStart: Function = (point, context) => { }
  public onDownEnd: Function = (point, context) => { }

  public onMoveStart: Function = (point, context) => { }
  public onMove: Function = (point, context) => { }
  public onMoveEnd: Function = (point, context) => { }

  public onDragStart: Function = (point, context) => { }
  public onDrag: Function = (point, context) => { }
  public onDragEnd: Function = (point, context) => { }

  public position: Vector2
  public velocity: Vector2
  public acceleration: Vector2

  public previousVelocity: Vector2
  public previousPosition: Vector2

  public clickPosition: Vector2
  public downEndPosition: Vector2
  public downStartPosition: Vector2

  public moveEndPosition: Vector2
  public moveStartPosition: Vector2

  public dragStartPosition: Vector2
  public dragEndPosition: Vector2

  constructor() {
    this.position = new Vector2
    this.velocity = new Vector2
    this.acceleration = new Vector2

    this.previousVelocity = new Vector2
    this.previousPosition = new Vector2

    this.clickPosition = new Vector2
    this.downEndPosition = new Vector2
    this.downStartPosition = new Vector2

    this.moveEndPosition = new Vector2
    this.moveStartPosition = new Vector2

    this.dragStartPosition = new Vector2
    this.dragEndPosition = new Vector2
  }

  // HANDLERS

  public handleClick(event: MouseEvent) {
    if (this.determineClick(event, this) === true) {
      this.clickTime = Date.now()
      this.lastFiredEvent = event

      this.clickCount++

      const point: Vector2 = new Vector2(event.clientX, event.clientY)
      this.position.equals(point)
      this.clickPosition.equals(point)

      this.onClick(point, this)
      this.handleDoubleClick()
    }
  }

  public handleDoubleClick() {
    if (Date.now() - this.clickTime < this.doubleClickMaximumDelayTime) {
      this.doubleClickCounter++
      if (this.doubleClickCounter === 2) {
        this.onDoubleClick(this.position, this)
        this.doubleClickCounter = 0
      }
    } else {
      this.doubleClickCounter = 0
    }
  }

  public handleDown(event: MouseEvent) {
    if (this.determineDown(event, this) === true) {
      this.downStartTime = Date.now()
      this.lastFiredEvent = event

      const point: Vector2 = new Vector2(event.clientX, event.clientY)
      this.position.equals(point)
      this.downStartPosition.equals(point)

      this.isDown = true

      this.onDownStart(point, this)
    }
  }

  public handleUp(event: MouseEvent) {
    if (this.isDown === true) {
      this.downEndTime = Date.now()
      this.downDuration = this.downEndTime - this.downStartTime

      this.lastFiredEvent = event

      const point: Vector2 = new Vector2(this.position)
      this.position.equals(point)
      this.downEndPosition.equals(point)

      this.handleDragEnd()

      this.isDown = false

      this.onDownEnd(point, this)
    }
  }

  public handleMove(event: MouseEvent) {
    const point = new Vector2(event.clientX, event.clientY)
    this.position.equals(point)
    this.velocity.equals(
      Vector2.subtract(this.position, this.previousPosition)
    )
    this.acceleration.equals(
      Vector2.subtract(this.velocity, this.previousVelocity)
    )

    // HANDLE MOUSE MOVE
    if (
      this.isMoving === false &&
      this.determineMove(event, this) === true
    ) {
      this.moveStartTime = Date.now()
      this.isMoving = true
      this.onMoveStart(event, this)
    } else if (this.isMoving === true) {
      this.onMove(point, this)
    }

    this.previousVelocity.equals(this.velocity)
    this.previousPosition.equals(point)

    // HANDLE MOUSE DRAG
    if (
      this.isDown === true &&
      this.isMoving === true
    ) {
      // If already dragging.
      if (this.isDragging === true) {
        this.onDrag(this.position, this)
      } else {
        // Initialize drag.
        this.dragStartTime = Date.now()
        this.dragStartPosition.equals(this.position)
        this.isDragging = true
        this.onDragStart(this.position, this)
      }
    }
  }

  public handleDragEnd() {
    if (this.isDragging === true) {
      this.dragEndTime = Date.now()
      this.dragDuration = this.dragEndTime - this.dragStartTime

      this.dragEndPosition.equals(this.position)

      this.isDragging = false
      this.onDragEnd(this.position, this)
    }
  }

  public handleMoveEnd() {
    if (this.isMoving === true) {
      this.handleDragEnd()

      this.moveEndTime = Date.now()
      this.moveDuration = this.moveEndTime - this.moveStartTime

      this.moveEndPosition.equals(this.position)

      this.isMoving = false
      this.onMoveEnd(this.position, this)
    }
  }

}