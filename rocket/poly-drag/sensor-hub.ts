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

    this.activeStories = [];
    this.activeIdentifiers = [];
  }

  public attach() {
    const { target } = this.polyDrag.config;

    this.mouseSensor.attach(target);
    this.touchSensor.attach(target);
  }

  public detach() {
    this.mouseSensor.detach();
    this.touchSensor.detach();
  }

  private dragEventIsActive(dragEvent: DragEvent): boolean {
    return (this.activeIdentifiers.indexOf(dragEvent.identifier) === -1);
  }

  private getDragStory(dragEvent: DragEvent): DragStory {
    const story = this.activeStories.find(story => {
      return story.identifier === dragEvent.identifier;
    });

    return story;
  }

  private removeDragStory(dragEvent: DragEvent) {
    const story = this.getDragStory(dragEvent);

    const index = this.activeStories.indexOf(story);

    this.activeStories = this.activeStories.splice(index, 1);
  }

  private preventDefault(dragEvent: DragEvent) {
    const { config } = this.polyDrag;

    if (config.preventDefault === true) {
      dragEvent.originalEvent.preventDefault();
    }
  }

  public onDragStart(dragEvent: DragEvent) {
    const { config } = this.polyDrag;

    if (
      this.dragEventIsActive(dragEvent) === false
      && config.condition(dragEvent) === true
    ) {
      const story = new DragStory(this.polyDrag);

      story.start(dragEvent);

      this.preventDefault(dragEvent);

      config.onEvent(dragEvent, story, this.polyDrag);

      if (this.activeStories.length === 0) {
        config.onStart(dragEvent, story, this.polyDrag);
      }

      config.onEachDragStart(dragEvent, story, this.polyDrag);
    }
  }

  public onDrag(dragEvent: DragEvent) {
    const { config } = this.polyDrag;

    if (this.dragEventIsActive(dragEvent) === false) {
      const story = this.getDragStory(dragEvent);

      story.drag(dragEvent);

      this.preventDefault(dragEvent);

      config.onEvent(dragEvent, story, this.polyDrag);

      config.onEachDrag(dragEvent, story, this.polyDrag);      
    }
  }

  public onDragEnd(dragEvent: DragEvent) {
    const { config } = this.polyDrag;

    if (this.dragEventIsActive(dragEvent) === false) {
      const story = this.getDragStory(dragEvent);

      story.stop(dragEvent);

      this.preventDefault(dragEvent);

      config.onEvent(dragEvent, story, this.polyDrag);      

      config.onEachDragStop(dragEvent, story, this.polyDrag);

      this.end(dragEvent, story);
    }
  }

  public onDragCancel(dragEvent: DragEvent) {
    const { config } = this.polyDrag;

    if (this.dragEventIsActive(dragEvent) === false) {
      const story = this.getDragStory(dragEvent);

      story.stop(dragEvent);

      this.preventDefault(dragEvent);

      config.onEvent(dragEvent, story, this.polyDrag);     

      config.onEachDragCancel(dragEvent, story, this.polyDrag);

      this.end(dragEvent, story);
    }
  }

  public end(dragEvent: DragEvent, dragStory: DragStory) {
    const { config } = this.polyDrag;

    this.removeDragStory(dragEvent);

    if (this.activeStories.length === 0) {
      config.onEnd(dragEvent, dragStory, this.polyDrag);
    }
  }
}