import {
  Point,
} from './rocket';

export interface Size {
  width: number;
  height: number;
}

export interface Offset {
  left: number;
  top: number;
}

export interface FullOffset extends Offset {
  right: number;
  bottom: number;
}

export interface Rectangle extends FullOffset, Size {
  center: Point;
}

export type RangeArray = [number, number];
 
export type NumberOrRange = number | RangeArray;
