import {
  MonoDrag,
} from './mono-drag';

import {
  MonoDragEvent,
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

  constructor(monoDrag: MonoDrag) {
    this.monoDrag = monoDrag;

    this.mouseSensor = new MouseSensor(this.monoDrag);
    this.touchSensor = new TouchSensor(this.monoDrag);
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
    if (monoDragEvent.type === 'start') {

    }
  }
}