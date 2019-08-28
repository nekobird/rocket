import {
  MonoDrag,
} from '../rocket';

import {
  DRAGGABLE_DEFAULT_CONFIG,
  DraggableConfig,
} from './config';

export class Draggable {
  public config: DraggableConfig;

  public monoDrag: MonoDrag;

  constructor(config: Partial<DraggableConfig>) {
    this.config = {...DRAGGABLE_DEFAULT_CONFIG};

    this.setConfig(config);
  }

  public setConfig(config: Partial<DraggableConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }

  public initializeMonoDrag() {
    const { preventDefault } = this.config;

    this.monoDrag = new MonoDrag({
      preventDefault,
    });
  }
}