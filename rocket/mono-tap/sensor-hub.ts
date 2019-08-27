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
  TapStory,
} from './tap-story';

import {
  TapEvent,
} from './tap-event';

export class SensorHub {
  public monoTap: MonoTap;

  public mouseSensor: MouseSensor;
  public touchSensor: TouchSensor;

  public isListening: boolean = false;

  public activeStories?: TapStory[];

  public history: TapStory[];

  public previousTapStory: TapStory = null;

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

  public dispatch(tapEvent: TapEvent) {
    this.preventDefault(tapEvent);

    switch (tapEvent.type) {
      case 'down': {
        const story = new TapStory(this.monoTap, tapEvent);

        this.addTapStory(story);

        this.monoTap.config.onDown(tapEvent, story, this.monoTap);

        break;
      }

      case 'up': {
        const story = this.getTapStoryFromTapEvent(tapEvent);

        if (story !== null) {
          story.addTapEvent(tapEvent);
        }

        const {
          onUp,
          isValidTap,
          onTap,
        } = this.monoTap.config;

        onUp(tapEvent, story, this.monoTap);

        if (isValidTap(tapEvent, story, this.monoTap) === true) {
          this.previousTapStory = story;

          this.addStoryToHistory(story);

          onTap(tapEvent, story, this.monoTap);
        }

        this.removeTapStory(story);

        break;
      }

      case 'cancel': {
        const story = this.getTapStoryFromTapEvent(tapEvent);

        if (story !== null) {
          story.addTapEvent(tapEvent);
        }

        this.monoTap.config.onCancel(tapEvent, story, this.monoTap);

        this.removeTapStory(story);

        break;
      }
    }
  }

  private preventDefault(tapEvent: TapEvent) {
    if (this.monoTap.config.preventDefault === true) {
      tapEvent.originalEvent.preventDefault();
    }
  }

  private addStoryToHistory(tapStory: TapStory) {
    if (this.monoTap.config.keepHistory === true) {
      this.history.push(tapStory);
    }
  }

  private addTapStory(tapStory: TapStory): boolean {
    if (this.activeStories.indexOf(tapStory) === -1) {
      this.activeStories.push(tapStory);

      return true;
    }

    return false;
  }

  private getTapStoryFromTapEvent(tapEvent: TapEvent): TapStory | null {
    const tapStory = this.activeStories.find(tapStory => {
      return tapStory.identifier === tapEvent.identifier
    });

    if (typeof tapStory !== 'undefined') {
      return tapStory;
    }

    return null;
  }

  private removeTapStory(tapStory: TapStory): boolean {
    const index = this.activeStories.indexOf(tapStory);

    if (index !== -1) {
      this.activeStories.splice(index, 1);

      return true;
    }

    return false;
  }
}