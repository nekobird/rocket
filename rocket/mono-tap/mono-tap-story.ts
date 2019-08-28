import {
  MonoTapEvent,
  MonoTapEventIdentifier,
} from './mono-tap-event';

import {
  MonoTap,
} from './mono-tap';

export class MonoTapStory {
  public monoTap: MonoTap;

  public identifier?: MonoTapEventIdentifier;

  public isActive: boolean = false;
  public isCancelled: boolean = false;
  public hasEnded: boolean = false;

  public downEvent?: MonoTapEvent;
  public upEvent?: MonoTapEvent;
  public cancelEvent?: MonoTapEvent;

  public startTime?: number;
  public endTime?: number;

  constructor(monoTap: MonoTap, tapEvent: MonoTapEvent) {
    this.monoTap = monoTap;

    this.addMonoTapEvent(tapEvent);
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

  public addMonoTapEvent(tapEvent: MonoTapEvent) {
    this.preventDefault(tapEvent);

    switch (tapEvent.type) {
      case 'down': {
        if (
          this.isActive === false
          && this.hasEnded === false
        ) {
          this.identifier = tapEvent.identifier;

          this.downEvent = tapEvent;

          this.startTime = tapEvent.time;

          this.isActive = true;
        }
      }

      case 'up': {
        if (
          this.isActive === true
          && tapEvent.identifier === this.identifier
        ) {
          this.upEvent = tapEvent;

          this.endTime = tapEvent.time;

          this.isActive = false;
          this.hasEnded = true;
        }
      }

      case 'cancel': {
        if (
          this.isActive === true
          && tapEvent.identifier === this.identifier
        ) {
          this.cancelEvent = tapEvent;

          this.endTime = tapEvent.time;

          this.isActive = false;
          this.hasEnded = true;
          this.isCancelled = true;
        }
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