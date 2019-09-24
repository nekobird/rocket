import {
  MonoTap,
} from '../mono-tap';

export class Sensor {
  public monoTap: MonoTap;

  public isListening: boolean = false;

  protected target?: HTMLElement;

  constructor(monoTap: MonoTap) {
    this.monoTap = monoTap;
  }
}