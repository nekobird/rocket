import {
  PolyDrag
} from './poly-drag';

import {
  MouseSensor,
} from './sensors/mouse-sensor';

import {
  TouchSensor,
} from './sensors/touch-sensor';

import {
  DragStory,
} from './drag-story';

import {
  DragEvent,
  DragEventIdentifier,
} from './drag-event';

export class SensorHub {
  public polyDrag: PolyDrag;

  public mouseSensor: MouseSensor;
  public touchSensor: TouchSensor;

  public activeStories: DragStory[];
  public activeIdentifiers: DragEventIdentifier[];

  constructor(polyDrag: PolyDrag) {
    this.polyDrag = polyDrag;

    this.mouseSensor = new MouseSensor(this);
    this.touchSensor = new TouchSensor(this);
  }

  public attach() {
    this.touchSensor.attach(this.polyDrag.config.target);
  }

  private dragEventIsActive(dragEvent: DragEvent): boolean {
    return (this.activeIdentifiers.indexOf(dragEvent.identifier) === -1);
  }

  private getDragStory(dragEvent: DragEvent): DragStory {
    const story = this.activeStories.find(story => story.identifier === dragEvent.identifier);
    return story;
  }

  private activate(dragEvent: DragEvent) {
    const dragStory = new DragStory(this.polyDrag);
    dragStory.start(dragEvent);
  }

  public onDragStart(dragEvent: DragEvent) {
    if (this.dragEventIsActive(dragEvent) === false) {
      // New story.
    }
  }

  public onDrag(dragEvent: DragEvent) {

  }

  public onDragEnd(dragEvent: DragEvent) {

  }

  public onDragCancel(dragEvent: DragEvent) {

  }
}