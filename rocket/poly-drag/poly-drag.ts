import {
  POLY_DRAG_DEFAULT_CONFIG,
  PolyDragConfig,
} from './config';

export class PolyDrag {
  public config: PolyDragConfig;

  public isActive: boolean = false;

  public activeDragEvents;

  constructor(config: Partial<PolyDragConfig>) {
    this.config = {...POLY_DRAG_DEFAULT_CONFIG};

    this.setConfig(config);
  }

  public setConfig(config: Partial<PolyDragConfig>) {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }
  }
}