import {
  DEFAULT_CONFIG,
  MonoConfig,
} from './config';

import {
  ItemManager,
} from './itemManager';

import {
  EventManager,
} from './eventManager';

import {
  ActionManager,
} from './actionManager';

export class MonoController {

  public config: MonoConfig;

  public itemManager: ItemManager;
  public eventManager: EventManager;
  public actionManager: ActionManager;

  public isReady: boolean = false;

  constructor(config?: Partial<MonoConfig>) {
    this.config = Object.assign({}, DEFAULT_CONFIG);
    this.setConfig(config);
    this.itemManager = new ItemManager(this);
    this.eventManager = new EventManager(this);
    this.actionManager = new ActionManager(this);
  }

  public setConfig(config?: Partial<MonoConfig>): this {
    if (typeof config === 'object') Object.assign(this.config, config);
    return this;
  }

  public initialize(): this {
    this.itemManager.initialize();
    this.eventManager.initialize();
    return this;
  }

  public get isActive(): boolean {
    return this.itemManager.isActive;
  }

  public isItemActive(id: string): boolean {
    const { isActive, activeItem } = this.itemManager;
    if (
      isActive === true
      && typeof activeItem !== 'undefined'
    ) return this.config.getItemId(activeItem) === id;
    return false;
  }

  public async activate(id: string): Promise<void> {
    try {
      const action = this.actionManager.composeAction('activate', id);
      await this.actionManager.actionHub(action);
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  }

  public async deactivate(id?: string): Promise<void> {
    try {
      const action = this.actionManager.composeAction('deactivate', id);
      await this.actionManager.actionHub(action);
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  }

  public async toggle(id?: string): Promise<void> {
    try {
      const action = this.actionManager.composeAction('toggle', id);
      await this.actionManager.actionHub(action);
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  }
}