import {
  TapEvent,
  TapEventIdentifier,
} from './tap-event';

import {
  MonoTap,
} from './mono-tap';

export class TapStory {
  public monoTap: MonoTap;

  public identifier: TapEventIdentifier;

  // TODO: Clean this mess.
  public isActive: boolean = false;
  public wasActive: boolean = false;
  public isCancelled: boolean = false;
  public hasEnded: boolean = false;

  public downEvent: TapEvent;
  public upEvent?: TapEvent;
  public cancelEvent?: TapEvent;

  public startTime: number;
  public endTime: number;

  constructor(monoTap: MonoTap, tapEvent: TapEvent) {
    this.monoTap = monoTap;

    this.addTapEvent(tapEvent);
  }

  public get duration(): number | null {
    if (this.hasEnded === true) {
      return this.startTime - this.endTime;
    }

    return null;
  }

  public addTapEvent(tapEvent: TapEvent) {
    switch (tapEvent.type) {
      case 'down': {
        if (
          this.hasEnded === false
          && this.wasActive === false
          && this.isActive === false
        ) {
          this.identifier = tapEvent.identifier;

          this.downEvent = tapEvent;

          this.startTime = tapEvent.time;

          this.isActive = true;
          this.wasActive = true;
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

          this.isCancelled = true;
          this.isActive = false;
          this.hasEnded = true;
        }
      }
    }
  }
}