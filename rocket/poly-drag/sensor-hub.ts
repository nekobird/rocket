import {
  DOMUtil,
} from '../rocket';

import {
  MouseSensor,
} from './sensors/mouse-sensor';

import {
  TouchSensor,
} from './sensors/touch-sensor';

import {
  PolyDrag
} from './poly-drag';

import {
  PolyDragStory,
} from './poly-drag-story';

import {
  PolyDragEvent,
  PolyDragEventIdentifier,
} from './poly-drag-event';

// TODO: Add to check if there is an active event.
export class SensorHub {
  public polyDrag: PolyDrag;

  public mouseSensor: MouseSensor;
  public touchSensor: TouchSensor;

  public isActive: boolean = false;

  public activePolyDragStories: PolyDragStory[];

  public activePolyDragEventIdentifiers: PolyDragEventIdentifier[];

  public history: PolyDragStory[];

  constructor(polyDrag: PolyDrag) {
    this.polyDrag = polyDrag;

    this.mouseSensor = new MouseSensor(this);
    this.touchSensor = new TouchSensor(this);

    this.activePolyDragStories = [];

    this.activePolyDragEventIdentifiers = [];

    this.history = [];
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

  public receive(polyDragEvent: PolyDragEvent) {
    switch (polyDragEvent.type) {

    }
  }

  private addStoryToHistory(dragStory: PolyDragStory) {
    const { config } = this.polyDrag;

    if (
      this.isActive === true
      && config.keepPolyDragStoryHistory === true
    ) {
      if (Array.isArray(this.history) === true) {
        this.history = [];
      }

      this.history.push(dragStory);
    }
  }

  private polyDragEventIsActive(polyDragEvent: PolyDragEvent): boolean {
    if (typeof polyDragEvent.identifier !== 'undefined') {
      return (this.activePolyDragEventIdentifiers.indexOf(polyDragEvent.identifier) !== -1);
    }

    return false;
  }

  private getPolyDragStory(dragEvent: PolyDragEvent): PolyDragStory | null {
    const story = this.activePolyDragStories.find(story => {
      return story.identifier === dragEvent.identifier;
    });

    if (typeof story === 'undefined') {
      return null;
    }

    return story;
  }

  private removePolyDragStory(dragEvent: PolyDragEvent) {
    const story = this.getPolyDragStory(dragEvent);

    if (
      story !== null
      && typeof dragEvent.identifier !== 'undefined'
    ) {
      const activePolyDragStoryIndex = this.activeDragStories.indexOf(story);
      const activeIdentifierIndex = this.activeIdentifiers.indexOf(dragEvent.identifier);

      if (
        activePolyDragStoryIndex !== -1
        && activeIdentifierIndex !== -1
      ) {
        this.activeDragStories.splice(activePolyDragStoryIndex, 1);
        this.activeIdentifiers.splice(activeIdentifierIndex, 1);
      }
    }
  }

  private preventDefault(dragEvent: PolyDragEvent) {
    const { config } = this.polyDrag;

    if (
      config.preventDefault === true
      && typeof dragEvent.originalEvent !== 'undefined'
    ) {
      dragEvent.originalEvent.preventDefault();
    }
  }

  public onDragStart(dragEvent: PolyDragEvent) {
    const { config } = this.polyDrag;

    if (
      this.isActive === true
      && this.dragEventIsActive(dragEvent) === false
      && config.condition(dragEvent) === true
    ) {
      const story = new PolyDragStory(this.polyDrag);

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

  public onDrag(dragEvent: PolyDragEvent) {
    const { config } = this.polyDrag;

    if (
      this.isActive === true
      && this.dragEventIsActive(dragEvent) === false
    ) {
      const story = this.getPolyDragStory(dragEvent);

      if (story !== null) {
        story.drag(dragEvent);

        this.preventDefault(dragEvent);

        this.addStoryToHistory(story);

        config.onEvent(dragEvent, story, this.polyDrag);

        config.onEachDrag(dragEvent, story, this.polyDrag);
      }
    }
  }

  public onDragEnd(dragEvent: PolyDragEvent) {
    const { config } = this.polyDrag;

    if (
      this.isActive === true
      && this.dragEventIsActive(dragEvent) === false
    ) {
      const story = this.getPolyDragStory(dragEvent);

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

  public onDragCancel(dragEvent: PolyDragEvent) {
    const { config } = this.polyDrag;

    if (
      this.isActive === true
      && this.dragEventIsActive(dragEvent) === false
    ) {
      const story = this.getPolyDragStory(dragEvent);

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

  public end(dragEvent: PolyDragEvent, dragStory: PolyDragStory) {
    const { config } = this.polyDrag;

    this.removePolyDragStory(dragEvent);

    if (
      this.isActive === true
      && this.activeDragStories.length === 0
    ) {
      config.onEnd(dragEvent, dragStory, this.polyDrag);
    }
  }
}