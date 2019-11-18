import {
  DOMTraverse,
  Util,
} from '~/rocket';

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

  public previousStory: MonoTapStory | null = null;

  public activeStories: MonoTapStory[];

  public history: MonoTapStory[];

  constructor(monoTap: MonoTap) {
    this.monoTap = monoTap;

    this.mouseSensor = new MouseSensor(this.monoTap);
    this.touchSensor = new TouchSensor(this.monoTap);

    this.activeStories = [];

    this.history = [];
  }

  public attach() {
    if (this.isListening === false) {
      const result = Util.truthChain(
        () => this.mouseSensor.attach(),
        () => this.touchSensor.attach(),
      );

      this.isListening = result;
    }
  }

  public detach() {
    if (this.isListening === true) {
      const result = Util.truthChain(
        () => this.mouseSensor.detach(),
        () => this.touchSensor.detach(),
      );

      this.isListening = !result;
    }
  }

  // Receive MonoTapEvent from sensors.
  public receive(event: MonoTapEvent) {
    const { config } = this.monoTap;

    config.onEvent(event, this.monoTap);

    switch (event.type) {
      case 'down': {
        if (config.condition(event, this.monoTap) === true) {
          const story = new MonoTapStory(this.monoTap, event);

          this.addActiveStory(story);

          config.onDown(event, story, this.monoTap);
        }

        break;
      }

      case 'up': {
        const story = this.getStoryFromEvent(event);

        if (story !== null) {
          story.addEvent(event);

          config.onUp(event, story, this.monoTap);

          if (
            story.upEvent !== null
            && DOMTraverse.hasAncestor(story.upEvent.target as HTMLElement, config.target as HTMLElement) === true
            && config.isValidTap(event, story, this.monoTap) === true
          ) {
            this.previousStory = story;

            config.onTap(event, story, this.monoTap);
  
            this.addStoryToHistory(story);        
          }
  
          this.removeActiveStory(story);  
        }

        break;
      }

      case 'cancel': {
        const story = this.getStoryFromEvent(event);

        if (story !== null) {
          story.addEvent(event);

          this.monoTap.config.onCancel(event, story, this.monoTap);

          this.removeActiveStory(story);
        }

        break;
      }
    }
  }

  private addStoryToHistory(story: MonoTapStory): boolean {
    const { keepHistory } = this.monoTap.config;

    if (
      keepHistory === true
      && this.history.indexOf(story) === -1
    ) {
      this.history.push(story);

      return true;
    }

    return false;
  }

  private addActiveStory(story: MonoTapStory): boolean {
    if (this.activeStories.indexOf(story) === -1) {
      this.activeStories.push(story);

      return true;
    }

    return false;
  }

  private getStoryFromEvent(event: MonoTapEvent): MonoTapStory | null {
    const story = this.activeStories.find(story => {
      return story.identifier === event.identifier
    });

    if (typeof story !== 'undefined') {
      return story;
    }

    return null;
  }

  private removeActiveStory(story: MonoTapStory): boolean {
    const index = this.activeStories.indexOf(story);

    if (index !== -1) {
      this.activeStories.splice(index, 1);

      return true;
    }

    return false;
  }
}
