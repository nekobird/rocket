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

  public hasOneActiveMonoDragStory: boolean = false;

  public activeMonoDragStory: MonoDragStory | null = null;

  public activeMonoDragIdentifier: MonoDragEventIdentifier | null = null;

  public history: MonoDragStory[];

  constructor(monoDrag: MonoDrag) {
    this.monoDrag = monoDrag;

    this.mouseSensor = new MouseSensor(this.monoDrag);
    this.touchSensor = new TouchSensor(this.monoDrag);

    this.history = [];
  }

  public listen(): this {
    if (this.isListening === false) {
      this.mouseSensor.attach();
      this.touchSensor.attach();

      this.isListening = true;
    }

    return this;
  }

  public stopListening() {
    if (this.isListening === true) {
      this.mouseSensor.detach();
      this.touchSensor.detach();

      this.isListening = false;
    }
  }

  public receive(event: MonoDragEvent) {
    switch (event.type) {
      case 'start': {
        const { config } = this.monoDrag;

        if (
          this.isActive(event) === false
          && config.condition(event, this.monoDrag) === true
        ) {
          const story = new MonoDragStory(this.monoDrag);          

          story.addMonoDragEvent(event);

          this.activeMonoDragStory = story;
          this.activeMonoDragIdentifier = event.identifier;

          config.onEvent(event, story, this.monoDrag);

          config.onDragStart(event, story, this.monoDrag);
        }

        break;
      }

      case 'drag': {
        const { config } = this.monoDrag;

        if (this.isActive(event) === true) {
          const story = this.activeMonoDragStory as MonoDragStory;

          story.addMonoDragEvent(event);

          config.onEvent(event, story, this.monoDrag);

          config.onDrag(event, story, this.monoDrag);
        }

        break;
      }

      case 'stop': {
        const { config } = this.monoDrag;

        if (this.isActive(event) === true) {
          const story = this.activeMonoDragStory as MonoDragStory;

          story.addMonoDragEvent(event);

          config.onEvent(event, story, this.monoDrag);

          config.onDragStop(event, story, this.monoDrag);

          this.deactivate();
        }

        break;
      }

      case 'cancel': {
        const { config } = this.monoDrag;

        if (this.isActive(event) === true) {
          const story = this.activeMonoDragStory as MonoDragStory;

          story.addMonoDragEvent(event);

          config.onEvent(event, story, this.monoDrag);

          config.onDragCancel(event, story, this.monoDrag);

          this.deactivate();
        }

        break;
      }
    }
  }

  private isActive(event: MonoDragEvent): boolean {
    return (
      this.activeMonoDragStory !== null
      && this.activeMonoDragIdentifier !== null
      && this.activeMonoDragIdentifier === event.identifier
    );
  }

  private deactivate() {
    this.activeMonoDragStory = null;
    this.activeMonoDragIdentifier = null;
  }
}