import {
  PointLike,
  Vector2,
} from '@/rocket';

export class Vector2Group {
  public static addGroupBy(group: Vector2[], by: PointLike): Vector2[] {
    return group.map(point => point.add(by));
  }

  public static subtractGroupBy(group: Vector2[], by: PointLike): Vector2[] {
    return group.map(point => point.subtract(by));
  }

  public static multiplyGroupBy(group: Vector2[], by: number): Vector2[] {
    return group.map(point => point.multiply(by));
  }

  public static divideGroupBy(group: Vector2[], by: number): Vector2[] {
    return group.map(point => point.divide(by));
  }

  public static scaleGroupByFrom(group: Vector2[], by: number, from: PointLike): Vector2[] {
    return group.map(point => point.scaleByFrom(by, from));
  }

  public static rotateGroupToFrom(group: Vector2[], to: number, from: PointLike): Vector2[] {
    return group.map(point => point.rotateToFrom(to, from));
  }

  public static rotateGroupByFrom(group: Vector2[], by: number, from: PointLike): Vector2[] {
    return group.map(point => point.rotateByFrom(by, from));
  }
}
