import {
  Util,
} from '../rocket';

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

import {
  MouseSensor,
} from './sensors/mouse-sensor';

import {
  TouchSensor,
} from './sensors/touch-sensor';

// TODO: Add to check if there is an active event.
export class SensorHub {
  public polyDrag: PolyDrag;

  public mouseSensor: MouseSensor;
  public touchSensor: TouchSensor;

  public isListening: boolean = false;

  public activeStories: PolyDragStory[];

  public activeIdentifiers: PolyDragEventIdentifier[];

  public history: PolyDragStory[];

  constructor(polyDrag: PolyDrag) {
    this.polyDrag = polyDrag;

    this.mouseSensor = new MouseSensor(this.polyDrag);
    this.touchSensor = new TouchSensor(this.polyDrag);

    this.activeStories = [];

    this.activeIdentifiers = [];

    this.history = [];
  }

  public listen() {
    if (this.isListening === false) {
      const result = Util.truthChain(
        () => this.mouseSensor.attach(),
        () => this.touchSensor.attach(),
      );

      this.isListening = result;
    }
  }

  public stopListening() {
    if (this.isListening === true) {
      const result = Util.truthChain(
        () => this.mouseSensor.detach(),
        () => this.touchSensor.detach(),
      );

      this.isListening = !result;
    }
  }

  public receive(event: PolyDragEvent) {
    const { config } = this.polyDrag;

    config.onEvent(event, this.polyDrag);

    switch (event.type) {
      case 'start': {
        if (
          this.eventIsActive(event) === false
          && config.condition(event, this.polyDrag) === true
        ) {
          const story = new PolyDragStory(this.polyDrag, event);

          story.addEvent(event);

          this.addActiveStoryAndIdentifier(story);

          config.onEachDragStart(event, story, this.polyDrag);
        }

        break;
      }

      case 'drag': {
        const { config } = this.polyDrag;

        if (this.eventIsActive(event) === true) {
          const story = this.getActiveStory(event);

          if (story !== null) {
            story.addEvent(event);

            this.addActiveStoryAndIdentifier(story);

            config.onEachDrag(event, story, this.polyDrag);
          }
        }

        break;
      }

      case 'stop': {
        break;
      }

      case 'cancel': {
        break;
      }
    }
  }

  private eventIsActive(event: PolyDragEvent): boolean {
    if (typeof event.identifier !== 'undefined') {
      return (this.activeIdentifiers.indexOf(event.identifier) !== -1);
    }

    return false;
  }

  private addActiveStoryAndIdentifier(story: PolyDragStory): boolean {
    if (
      this.activeStories.indexOf(story) === -1
      && this.activeIdentifiers.indexOf(story.identifier) === -1
    ) {
      this.activeStories.push(story);
      this.activeIdentifiers.push(story.identifier);

      return true;
    }

    return false;
  }

  private getActiveStory(event: PolyDragEvent): PolyDragStory | null {
    const story = this.activeStories.find(story => story.identifier === event.identifier);

    if (typeof story !== 'undefined') {
      return story;
    }

    return null;
  }

  private addStoryToHistory(dragStory: PolyDragStory) {
    const { config } = this.polyDrag;

    if (
      this.eventIsActive === true
      && config.keepPolyDragStoryHistory === true
    ) {
      if (Array.isArray(this.history) === true) {
        this.history = [];
      }

      this.history.push(dragStory);
    }
  }

  private removeActiveStory(dragEvent: PolyDragEvent) {
    const story = this.getStoryFromEvent(dragEvent);

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
      this.isListening === true
      && this.eventIsActive(dragEvent) === false
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
      this.eventIsActive === true
      && this.eventIsActive(dragEvent) === false
    ) {
      const story = this.getStoryFromEvent(dragEvent);

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
      this.eventIsActive === true
      && this.eventIsActive(dragEvent) === false
    ) {
      const story = this.getStoryFromEvent(dragEvent);

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
      this.eventIsActive === true
      && this.eventIsActive(dragEvent) === false
    ) {
      const story = this.getStoryFromEvent(dragEvent);

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

    this.removeActiveStory(dragEvent);

    if (
      this.eventIsActive === true
      && this.activeDragStories.length === 0
    ) {
      config.onEnd(dragEvent, dragStory, this.polyDrag);
    }
  }
}