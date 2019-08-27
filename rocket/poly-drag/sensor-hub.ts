import {
  DOMUtil,
} from '../rocket';

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

// TODO: Add to check if there is an active event.
export class SensorHub {
  public polyDrag: PolyDrag;

  public isActive: boolean = false;

  public mouseSensor: MouseSensor;
  public touchSensor: TouchSensor;

  public activeDragStories: DragStory[];
  public activeIdentifiers: DragEventIdentifier[];

  public history: DragStory[];

  constructor(polyDrag: PolyDrag) {
    this.polyDrag = polyDrag;

    this.mouseSensor = new MouseSensor(this);
    this.touchSensor = new TouchSensor(this);

    this.history = [];

    this.activeDragStories = [];
    this.activeIdentifiers = [];

    this.reset();
  }

  public attach() {
    const { target } = this.polyDrag.config;

    if (
      this.isActive === false
      && DOMUtil.isHTMLElement(target) === true
    ) {
      const targetElement = target as HTMLElement;

      this.mouseSensor.attach(targetElement);
      this.touchSensor.attach(targetElement);

      this.isActive = true;
    }
  }

  public detach() {
    if (this.isActive === true) {
      this.mouseSensor.detach();
      this.touchSensor.detach();

      this.reset();

      this.isActive = false;
    }
  }

  private addStoryToHistory(dragStory: DragStory) {
    const { config } = this.polyDrag;

    if (
      this.isActive === true
      && config.keepDragStoryHistory === true
    ) {
      if (Array.isArray(this.history) === true) {
        this.history = [];
      }

      this.history.push(dragStory);
    }
  }

  private reset() {
    this.activeDragStories = [];
    this.activeIdentifiers = [];
  }

  private dragEventIsActive(dragEvent: DragEvent): boolean {
    if (typeof dragEvent.identifier !== 'undefined') {
      return (this.activeIdentifiers.indexOf(dragEvent.identifier) !== -1);
    }

    return false;
  }

  private getDragStory(dragEvent: DragEvent): DragStory | null {
    const story = this.activeDragStories.find(story => {
      return story.identifier === dragEvent.identifier;
    });

    if (typeof story === 'undefined') {
      return null;
    }

    return story;
  }

  private removeDragStory(dragEvent: DragEvent) {
    const story = this.getDragStory(dragEvent);

    if (
      story !== null
      && typeof dragEvent.identifier !== 'undefined'
    ) {
      const activeDragStoryIndex = this.activeDragStories.indexOf(story);
      const activeIdentifierIndex = this.activeIdentifiers.indexOf(dragEvent.identifier);

      if (
        activeDragStoryIndex !== -1
        && activeIdentifierIndex !== -1
      ) {
        this.activeDragStories.splice(activeDragStoryIndex, 1);
        this.activeIdentifiers.splice(activeIdentifierIndex, 1);
      }
    }
  }

  private preventDefault(dragEvent: DragEvent) {
    const { config } = this.polyDrag;

    if (
      config.preventDefault === true
      && typeof dragEvent.originalEvent !== 'undefined'
    ) {
      dragEvent.originalEvent.preventDefault();
    }
  }

  public onDragStart(dragEvent: DragEvent) {
    const { config } = this.polyDrag;

    if (
      this.isActive === true
      && this.dragEventIsActive(dragEvent) === false
      && config.condition(dragEvent) === true
    ) {
      const story = new DragStory(this.polyDrag);

      story.start(dragEvent);

      this.preventDefault(dragEvent);

      this.addStoryToHistory(story);

      config.onEvent(dragEvent, story, this.polyDrag);

      if (this.activeDragStories.length === 0) {
        config.onStart(dragEvent, story, this.polyDrag);
      }

      config.onEachDragStart(dragEvent, story, this.polyDrag);
    }
  }

  public onDrag(dragEvent: DragEvent) {
    const { config } = this.polyDrag;

    if (
      this.isActive === true
      && this.dragEventIsActive(dragEvent) === false
    ) {
      const story = this.getDragStory(dragEvent);

      if (story !== null) {
        story.drag(dragEvent);

        this.preventDefault(dragEvent);

        this.addStoryToHistory(story);

        config.onEvent(dragEvent, story, this.polyDrag);

        config.onEachDrag(dragEvent, story, this.polyDrag);
      }
    }
  }

  public onDragEnd(dragEvent: DragEvent) {
    const { config } = this.polyDrag;

    if (
      this.isActive === true
      && this.dragEventIsActive(dragEvent) === false
    ) {
      const story = this.getDragStory(dragEvent);

      if (story !== null) {
        story.stop(dragEvent);

        this.preventDefault(dragEvent);

        this.addStoryToHistory(story);

        config.onEvent(dragEvent, story, this.polyDrag);

        config.onEachDragStop(dragEvent, story, this.polyDrag);

        this.end(dragEvent, story);
      }
    }
  }

  public onDragCancel(dragEvent: DragEvent) {
    const { config } = this.polyDrag;

    if (
      this.isActive === true
      && this.dragEventIsActive(dragEvent) === false
    ) {
      const story = this.getDragStory(dragEvent);

      if (story !== null) {
        story.stop(dragEvent);

        this.preventDefault(dragEvent);

        this.addStoryToHistory(story);

        config.onEvent(dragEvent, story, this.polyDrag);

        config.onEachDragCancel(dragEvent, story, this.polyDrag);

        this.end(dragEvent, story);
      }
    }
  }

  public end(dragEvent: DragEvent, dragStory: DragStory) {
    const { config } = this.polyDrag;

    this.removeDragStory(dragEvent);

    if (
      this.isActive === true
      && this.activeDragStories.length === 0
    ) {
      config.onEnd(dragEvent, dragStory, this.polyDrag);
    }
  }
}