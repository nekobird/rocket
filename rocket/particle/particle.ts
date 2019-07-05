import {
  Vector2,
} from '../rocket';

export class Particle {
  public position: Vector2;
  public velocity: Vector2;
  public acceleration: Vector2;

  public maximumSpeed: number = 10;

  constructor() {
    this.position = new Vector2;
    this.velocity = new Vector2;
    this.acceleration = new Vector2;
  }

  public applyForce(force: Vector2): this {
    force.divide(1);
    this.acceleration.add(force);
    return this;
  }

  public update(): this {
    this.velocity
      .add(this.acceleration)
      .limit(this.maximumSpeed);
    this.position.add(this.velocity);
    this.acceleration.multiply(0);
    return this;
  }
}