import {
  MonoTap,
} from './mono-tap';

import {
  MouseSensor,
} from './sensors/mouse-sensor';

import {
  TouchSensor, 
} from './sensors/touch-sensor';

import {
  MonoTapStory,
} from './mono-tap-story';

import {
  MonoTapEvent,
} from './mono-tap-event';

export class SensorHub {
  public monoTap: MonoTap;

  public mouseSensor: MouseSensor;
  public touchSensor: TouchSensor;

  public isListening: boolean = false;

  public activeStories: MonoTapStory[];

  public history: MonoTapStory[];

  public previousMonoTapStory?: MonoTapStory;

  constructor(monoTap: MonoTap) {
    this.monoTap = monoTap;

    this.mouseSensor = new MouseSensor(this.monoTap);
    this.touchSensor = new TouchSensor(this.monoTap);

    this.activeStories = [];

    this.history = [];
  }

  public attach() {
    if (this.isListening === false) {
      this.mouseSensor.attach();
      this.touchSensor.attach();

      this.isListening = true;
    }
  }

  public detach() {
    if (this.isListening === true) {
      this.mouseSensor.detach();
      this.touchSensor.detach();

      this.isListening = false;
    }
  }

  public receive(tapEvent: MonoTapEvent) {
    this.preventDefault(tapEvent);

    switch (tapEvent.type) {
      case 'down': {
        if (this.monoTap.config.condition(tapEvent, this.monoTap) === true) {
          const story = new MonoTapStory(this.monoTap, tapEvent);

          this.addMonoTapStory(story);

          this.monoTap.config.onDown(tapEvent, story, this.monoTap);
        }

        break;
      }

      case 'up': {
        const story = this.getMonoTapStoryFromMonoTapEvent(tapEvent);

        if (story !== null) {
          story.addMonoTapEvent(tapEvent);

          const {
            onUp,
            isValidTap,
            onTap,
          } = this.monoTap.config;
  
          onUp(tapEvent, story, this.monoTap);
  
          if (isValidTap(tapEvent, story, this.monoTap) === true) {
            this.previousMonoTapStory = story;
  
            this.addStoryToHistory(story);
  
            onTap(tapEvent, story, this.monoTap);
          }
  
          this.removeMonoTapStory(story);  
        }

        break;
      }

      case 'cancel': {
        const story = this.getMonoTapStoryFromMonoTapEvent(tapEvent);

        if (story !== null) {
          story.addMonoTapEvent(tapEvent);

          this.monoTap.config.onCancel(tapEvent, story, this.monoTap);

          this.removeMonoTapStory(story);
        }

        break;
      }
    }
  }

  private preventDefault(tapEvent: MonoTapEvent) {
    if (this.monoTap.config.preventDefault === true) {
      tapEvent.originalEvent.preventDefault();
    }
  }

  private addStoryToHistory(tapStory: MonoTapStory) {
    if (this.monoTap.config.keepHistory === true) {
      this.history.push(tapStory);
    }
  }

  private addMonoTapStory(tapStory: MonoTapStory): boolean {
    if (this.activeStories.indexOf(tapStory) === -1) {
      this.activeStories.push(tapStory);

      return true;
    }

    return false;
  }

  private getMonoTapStoryFromMonoTapEvent(tapEvent: MonoTapEvent): MonoTapStory | null {
    const tapStory = this.activeStories.find(tapStory => {
      return tapStory.identifier === tapEvent.identifier
    });

    if (typeof tapStory !== 'undefined') {
      return tapStory;
    }

    return null;
  }

  private removeMonoTapStory(tapStory: MonoTapStory): boolean {
    const index = this.activeStories.indexOf(tapStory);

    if (index !== -1) {
      this.activeStories.splice(index, 1);

      return true;
    }

    return false;
  }
}