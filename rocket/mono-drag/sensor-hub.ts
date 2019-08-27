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

  public receive(monoDragEvent: MonoDragEvent) {
    switch (monoDragEvent.type) {
      case 'start': {
        const { config } = this.monoDrag;

        if (this.isActive(monoDragEvent) === false) {
          const story = new MonoDragStory(this.monoDrag);          

          story.addDragEvent(monoDragEvent);

          this.activeMonoDragStory = story;
          this.activeMonoDragIdentifier = monoDragEvent.identifier;

          config.onEvent(monoDragEvent.originalEvent, this.monoDrag);

          config.onDragStart(monoDragEvent, story, this.monoDrag);
        }
      }

      case 'drag': {
        const { config } = this.monoDrag;

        if (this.isActive(monoDragEvent) === true) {
          const story = this.activeMonoDragStory as MonoDragStory;

          story.addDragEvent(monoDragEvent);

          config.onEvent(monoDragEvent.originalEvent, this.monoDrag);

          config.onDrag(monoDragEvent, story, this.monoDrag);
        }
      }

      case 'stop': {
        const { config } = this.monoDrag;

        if (this.isActive(monoDragEvent) === true) {
          const story = this.activeMonoDragStory as MonoDragStory;

          story.addDragEvent(monoDragEvent);

          config.onEvent(monoDragEvent.originalEvent, this.monoDrag);

          config.onDragStop(monoDragEvent, story, this.monoDrag);

          this.deactivate();
        }
      }

      case 'cancel': {
        const { config } = this.monoDrag;

        if (this.isActive(monoDragEvent) === true) {
          const story = this.activeMonoDragStory as MonoDragStory;

          story.addDragEvent(monoDragEvent);

          config.onEvent(monoDragEvent.originalEvent, this.monoDrag);

          config.onDragCancel(monoDragEvent, story, this.monoDrag);

          this.deactivate();
        }
      }
    }
  }

  private isActive(monoDragEvent: MonoDragEvent): boolean {
    return (
      this.activeMonoDragStory !== null
      && this.activeMonoDragIdentifier !== null
      && this.activeMonoDragIdentifier === monoDragEvent.identifier
    );
  }

  private deactivate() {
    this.activeMonoDragStory = null;
    this.activeMonoDragIdentifier = null;
  }
}