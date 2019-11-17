import {
  Util,
} from '~/rocket';

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

          if (this.activeStories.length === 0) {
            this.addActiveStoryAndIdentifier(story);

            config.onStart(event, story, this.polyDrag);
          } else {
            this.addActiveStoryAndIdentifier(story);
          }

          config.onEachDragStart(event, story, this.polyDrag);
        }

        break;
      }

      case 'drag': {
        if (this.eventIsActive(event) === true) {
          const story = this.getActiveStory(event);

          if (story !== null) {
            story.addEvent(event);

            config.onEachDrag(event, story, this.polyDrag);
          }
        }

        break;
      }

      case 'stop': {
        this.handleStopOrCancelEvent(event);

        break;
      }

      case 'cancel': {
        this.handleStopOrCancelEvent(event);

        break;
      }
    }
  }

  private handleStopOrCancelEvent(event: PolyDragEvent) {
    const { config } = this.polyDrag;

    if (this.eventIsActive(event) === true) {
      const story = this.getActiveStory(event);

      if (story !== null) {
        story.addEvent(event);

        if (event.type === 'stop') {
          config.onEachDragStop(event, story, this.polyDrag);
        } else if (event.type === 'cancel') {
          config.onEachDragCancel(event, story, this.polyDrag);
        }

        config.onEachDragEnd(event, story, this.polyDrag);

        this.deactivate(event, story);
      }
    }
  }

  private deactivate(event: PolyDragEvent, story: PolyDragStory) {
    const { config } = this.polyDrag;

    this.addStoryToHistory(story);

    this.removeActiveStoryAndIdentifier(story);

    if (this.activeStories.length === 0) {
      config.onEnd(event, story, this.polyDrag);      
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

  private removeActiveStoryAndIdentifier(story: PolyDragStory) {
    const storyIndex = this.activeStories.indexOf(story);
    const identifierIndex = this.activeIdentifiers.indexOf(story.identifier);

    if (
      storyIndex !== -1
      && identifierIndex !== -1
    ) {
      this.activeStories.splice(storyIndex, 1);
      this.activeIdentifiers.splice(identifierIndex, 1);
    }
  }

  private addStoryToHistory(story: PolyDragStory): boolean {
    const { keepStoryHistory } = this.polyDrag.config;

    if (
      keepStoryHistory === true
      && this.activeStories.indexOf(story) === -1
    ) {
      this.history.push(story);

      return true;
    }

    return false;
  }
}