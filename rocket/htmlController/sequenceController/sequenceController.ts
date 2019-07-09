import {
  DEFAULT_CONFIG,
  SequenceConfig,
} from './config'

import {
  ItemManager,
} from './itemManager'

import {
  EventManager,
} from './eventManager'

import {
  ActionManager,
} from './actionManager'

export class SequenceController {

  public config: SequenceConfig;

  public itemManager: ItemManager;
  public eventManager: EventManager;
  public actionManager: ActionManager;

  public isReady: boolean = false;

  constructor(config?: Partial<SequenceConfig>) {
    this.config = Object.assign({}, DEFAULT_CONFIG);
    if (typeof config === 'object') this.setConfig(config);

    this.itemManager = new ItemManager(this);
    this.eventManager = new EventManager(this);
    this.actionManager = new ActionManager(this);
  }

  public setConfig(config: Partial<SequenceConfig>): this {
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
    const { activeItem } = this.itemManager;
    if (typeof activeItem == 'object')
      return this.config.getItemId(activeItem) === id;
    return false;
  }

  public async previous(): Promise<void> {
    try {
      const action = this.actionManager.composeAction('previous');
      await this.actionManager.actionHub(action);
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  }

  public async next(): Promise<void> {
    try {
      const action = this.actionManager.composeAction('next');
      await this.actionManager.actionHub(action);
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  }

  public async jump(id: string): Promise<void> {
    try {
      const action = this.actionManager.composeAction('jump', id);
      await this.actionManager.actionHub(action);
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  }
}
