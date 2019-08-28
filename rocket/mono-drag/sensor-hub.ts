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
          const story = new MonoDragStory(this.monoDrag);          

          story.addEvent(event);

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
        if (this.isActive(event) === true) {
          const story = this.activeStory as MonoDragStory;

          story.addEvent(event);

          config.onDragStop(event, story, this.monoDrag);

          this.deactivate();
        }

        break;
      }

      case 'cancel': {
        if (this.isActive(event) === true) {
          const story = this.activeStory as MonoDragStory;

          story.addEvent(event);

          config.onDragCancel(event, story, this.monoDrag);

          this.deactivate();
        }

        break;
      }
    }
  }

  private isActive(event: MonoDragEvent): boolean {
    return (
      this.activeStory !== null
      && this.activeEventIdentifier !== null
      && this.activeEventIdentifier === event.identifier
    );
  }

  private deactivate() {
    this.activeStory = null;
    this.activeEventIdentifier = null;
  }
}