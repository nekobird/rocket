import {
  Util,
} from '../rocket';

import {
  MonoDrag,
} from './mono-drag';

import {
  MonoDragStory,
} from './mono-drag-story';

import {
  MonoDragEvent,
  MonoDragEventIdentifier,
} from './mono-drag-event';

import {
  MouseSensor,
} from './sensors/mouse-sensor';

import {
  TouchSensor,
} from './sensors/touch-sensor';

// SensorHub manages sensors, drag events, and drag stories.
export class SensorHub {
  public monoDrag: MonoDrag;

  public mouseSensor: MouseSensor;
  public touchSensor: TouchSensor;

  public isListening: boolean = false;

  public hasOneActiveStory: boolean = false;

  public previousStory: MonoDragStory | null = null;

  public currentStory: MonoDragStory | null = null;

  public activeStory: MonoDragStory | null = null;

  public activeEventIdentifier: MonoDragEventIdentifier | null = null;

  public history: MonoDragStory[];

  constructor(monoDrag: MonoDrag) {
    this.monoDrag = monoDrag;

    this.mouseSensor = new MouseSensor(this.monoDrag);
    this.touchSensor = new TouchSensor(this.monoDrag);

    this.history = [];
  }

  public listen(): this {
    if (this.isListening === false) {

      const result = Util.truthChain(
        () => this.mouseSensor.attach(),
        () => this.touchSensor.attach(),
      );

      this.isListening = result;
    }

    return this;
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

  public receive(event: MonoDragEvent) {
    const { config } = this.monoDrag;

    config.onEvent(event, this.monoDrag);

    switch (event.type) {
      case 'start': {
        if (
          this.isActive(event) === false
          && config.condition(event, this.monoDrag) === true
        ) {
          const story = new MonoDragStory(this.monoDrag, event);

          this.currentStory = story;

          this.activeStory = story;

          this.activeEventIdentifier = event.identifier;
          
          config.onDragStart(event, story, this.monoDrag);
        }

        break;
      }

      case 'drag': {
        if (this.isActive(event) === true) {
          const story = this.activeStory as MonoDragStory;

          story.addEvent(event);

          config.onDrag(event, story, this.monoDrag);
        }

        break;
      }

      case 'stop': {
        this.handleStopOrCancel(event);

        break;
      }

      case 'cancel': {
        this.handleStopOrCancel(event);

        break;
      }
    }
  }

  private handleStopOrCancel(event: MonoDragEvent) {
    const { config } = this.monoDrag;

    if (this.isActive(event) === true) {
      const story = this.activeStory as MonoDragStory;

      story.addEvent(event);

      if (event.type === 'stop') {
        config.onDragStop(event, story, this.monoDrag);
      } else if (event.type === 'cancel') {
        config.onDragCancel(event, story, this.monoDrag);
      }

      this.deactivate(event, story);
    }
  }

  private deactivate(event: MonoDragEvent, story: MonoDragStory) {
    const { config } = this.monoDrag;

    config.onDragEnd(event, story, this.monoDrag);

    this.activeStory = null;

    this.activeEventIdentifier = null;

    this.previousStory = story;

    this.addStoryToHistory(story);
  }

  private isActive(event: MonoDragEvent): boolean {
    return (
      this.activeStory !== null
      && this.activeEventIdentifier !== null
      && this.activeEventIdentifier === event.identifier
    );
  }

  private addStoryToHistory(story: MonoDragStory) {
    const { config } = this.monoDrag;

    if (
      config.keepHistory === true
      && this.history.indexOf(story) === -1
    ) {
      this.history.push(story);
    }
  }
}