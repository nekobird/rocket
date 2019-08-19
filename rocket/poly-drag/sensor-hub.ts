import {
  PolyDrag
} from './poly-drag';

import {
  MouseSensor,
} from './mouse-sensor';

import {
  TouchSensor,
} from './touch-sensor';

import {
  DragStory,
} from './drag-story';

export class SensorHub {
  public polyDrag: PolyDrag;

  public mouseSensor: MouseSensor;
  public touchSensor: TouchSensor;

  public activeStories: DragStory[];

  constructor(polyDrag: PolyDrag) {
    this.polyDrag = polyDrag;
  }  
}