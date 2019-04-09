import {
  Vector2,
} from '../Rocket'

export class TouchPoint {

  constructor() {
    this.isDown = false
    this.isMoving = false

    this.position = new Vector2
    this.velocity = new Vector2
    this.acceleration = new Vector2
  }

}