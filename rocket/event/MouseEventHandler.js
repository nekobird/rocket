import {
  Vector2,
} from '../Rocket'

export class MouseEventHandler {

  constructor() {
    this.name

    this.lastFiredEvent

    this.isDown = false
    this.isMoving = false
    this.isDragging = false

    this.clickCount = 0
    this.clickTime = 0

    this.downStartTime
    this.downEndTime
    this.downDuration

    this.moveStartTime
    this.moveEndTime
    this.moveDuration

    this.dragStartTime
    this.dragEndTime
    this.dragDuration

    this.doubleClickCounter = 0
    this.doubleClickMaximumDelayTime = 500

    this.determineClick = () => {
      return true
    }
    this.determineDown = () => {
      return true
    }
    this.determineMove = () => {
      return true
    }
    this.determineDrag = () => {
      return true
    }

    this.onClick = () => {}
    this.onDoubleClick = () => {}

    this.onDownStart = () => {}
    this.onDownEnd = () => {}

    this.onMoveStart = () => {}
    this.onMove = () => {}
    this.onMoveEnd = () => {}

    this.onDragStart = () => {}
    this.onDrag = () => {}
    this.onDragEnd = () => {}

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

  handleClick(event) {
    if (this.determineClick(event, this) === true) {
      this.clickTime = Date.now()
      this.lastFiredEvent = event

      this.clickCount++

      const point = new Vector2(event.clientX, event.clientY)
      this.position.equals(point)
      this.clickPosition.equals(point)

      this.onClick(point, this)
      this.handleDoubleClick()
    }
  }

  handleDoubleClick() {
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

  handleDown(event) {
    if (this.determineDown(event, this) === true) {
      this.downStartTime = Date.now()
      this.lastFiredEvent = event

      const point = new Vector2(event.clientX, event.clientY)
      this.position.equals(point)
      this.downStartPosition.equals(point)

      this.isDown = true

      this.onDownStart(point, this)
    }
  }

  handleUp(event) {
    if (this.isDown === true) {
      this.downEndTime = Date.now()
      this.downDuration = this.downEndTime - this.downStartTime

      this.lastFiredEvent = event

      const point = new Vector2(this.position)
      this.position.equals(point)
      this.downEndPosition.equals(point)

      this.handleDragEnd()

      this.isDown = false

      this.onDownEnd(point, this)
    }
  }

  handleMove(event) {
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
      this.onMoveStart(event)
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

  handleDragEnd() {
    if (this.isDragging === true) {
      this.dragEndTime = Date.now()
      this.dragDuration = this.dragEndTime - this.dragStartTime

      this.dragEndPosition.equals(this.position)

      this.isDragging = false
      this.onDragEnd(this.position, this)
    }
  }

  handleMoveEnd() {
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