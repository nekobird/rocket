import {
  Vector2,
} from '~/rocket';

import {
  MonoTapEvent,
  MonoTapEventIdentifier,
} from './mono-tap-event';

import {
  MonoTap,
} from './mono-tap';

export class MonoTapStory {
  public monoTap: MonoTap;

  public identifier: MonoTapEventIdentifier;

  public isActive: boolean = false;
  public isCancelled: boolean = false;
  public hasEnded: boolean = false;

  public downEvent: MonoTapEvent;
  public upEvent: MonoTapEvent | null = null;
  public cancelEvent: MonoTapEvent | null = null;

  public startTime: number;
  public endTime?: number;

  constructor(monoTap: MonoTap, event: MonoTapEvent) {
    this.monoTap = monoTap;

    this.identifier = event.identifier;

    this.startTime = event.time;

    this.downEvent = event;

    this.addEvent(event);
  }

  public get duration(): number | null {
    if (
      this.hasEnded === true
      && typeof this.startTime === 'number'
      && typeof this.endTime === 'number'
    ) {
      return this.startTime - this.endTime;
    }

    return null;
  }

  public get translationDistance(): number | null {
    if (this.upEvent !== null) {
      return Vector2.getDistanceBetween(this.downEvent.position, this.upEvent.position);
    }

    return null;
  }

  public addEvent(event: MonoTapEvent) {
    if (this.identifier !== event.identifier) {
      return;
    }

    this.preventDefault(event);

    switch (event.type) {
      case 'down': {
        if (this.isActive === false && this.hasEnded === false) {
          this.downEvent = event;

          this.startTime = event.time;

          this.isActive = true;
        }

        break;
      }

      case 'up': {
        if (this.isActive === true) {
          this.upEvent = event;

          this.endTime = event.time;

          this.isActive = false;

          this.hasEnded = true;
        }

        break;
      }

      case 'cancel': {
        if (this.isActive === true) {
          this.cancelEvent = event;

          this.endTime = event.time;

          this.isActive = false;
          this.hasEnded = true;
          this.isCancelled = true;
        }

        break;
      }
    }
  }

  private preventDefault(event: MonoTapEvent) {
    const { preventDefault } = this.monoTap.config;

    if (preventDefault === true) {
      event.originalEvent.preventDefault();
    }
  }
}