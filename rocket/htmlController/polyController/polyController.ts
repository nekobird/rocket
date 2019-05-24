import {
  DEFAULT_CONFIG,
  PolyConfig,
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

export class PolyController {

  public isReady: boolean = false;

  public config: PolyConfig;

  public itemManager: ItemManager;
  public eventManager: EventManager;
  public actionManager: ActionManager;

  constructor(config?: Partial<PolyConfig>) {
    this.config = Object.assign({}, DEFAULT_CONFIG);
    if (typeof config === 'object') {
      this.setConfig(config);
    }
    
    this.itemManager = new ItemManager(this);
    this.eventManager = new EventManager(this);
    this.actionManager = new ActionManager(this);
  }

  public setConfig(config: Partial<PolyConfig>): this {
    Object.assign(this.config, config);
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
    let isActive: boolean = false;
    this.itemManager.activeItems.forEach(item => {
      if (this.config.getIdFromItem(item) === id) {
        isActive = true;
      }
    });
    return isActive;
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

  public async deactivate(id: string): Promise<void> {
    try {
      const action = this.actionManager.composeAction('deactivate', id);
      await this.actionManager.actionHub(action);
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  }

  public async toggle(id: string): Promise<void> {
    try {
      const action = this.actionManager.composeAction('toggle', id);
      await this.actionManager.actionHub(action);
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  }

  public async activateAll(): Promise<void> {
    try {
      const action = this.actionManager.composeAction('activate-all');
      await this.actionManager.actionHub(action);
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  }

  public async deactivateAll(): Promise<void> {
    try {
      const action = this.actionManager.composeAction('deactivate-all');
      await this.actionManager.actionHub(action);
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  }

  public async toggleAll(): Promise<void> {
    try {
      const action = this.actionManager.composeAction('toggle-all');
      await this.actionManager.actionHub(action);
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  }
}