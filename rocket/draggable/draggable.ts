import {
  MonoDrag,
} from '../rocket';

import {
  DRAGGABLE_DEFAULT_CONFIG,
  DraggableConfig,
} from './config';

export class Draggable {
  public config: DraggableConfig;

  constructor(config: Partial<DraggableConfig>) {
    this.config = {...this, DRAGGABLE_DEFAULT_CONFIG};

    this.setConfig(config);
  }

  public setConfig(config: Partial<DraggableConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }

  public initializeMonoDrag() {
    this.monoDrag = new MonoDrag({
      preventDefault: true,
    });
  }

  private onDragStart() {

  }

  private onDrag() {

  }

  private onDragStop() {

  }

  private onDragCancel() {

  }
}