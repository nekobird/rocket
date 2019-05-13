import {
  ElementManager,
} from '../index'

import {
  DEFAULT_CONFIG,
  MonoConfig,
} from './config'

import {
  MonoAction,
  ActionManager,
} from './actionManager'

import {
  ItemManager,
} from './itemManager'

import {
  EventManager,
} from './eventManager'

export class MonoController {

  public isReady: boolean = false

  public config: MonoConfig

  public elementManager: ElementManager
  public itemManager   : ItemManager
  public actionManager : ActionManager
  public eventManager  : EventManager

  constructor(config: MonoConfig) {
    this.elementManager = new ElementManager(this)
    this.itemManager    = new ItemManager(this)
    this.actionManager  = new ActionManager(this)
    this.eventManager   = new EventManager(this)

    this.config = Object.assign({}, DEFAULT_CONFIG)
    this
      .setConfig(config)
      .initialize()
  }

  public setConfig(config: MonoConfig): this {
    Object.assign(this.config, config)
    return this
  }

  public isItemActive(id: string): boolean {
    return this.itemManager.activeItem.dataset.id === id
  }

  // Action

  public activate(id: string): Promise<void> {
    return new Promise(resolve => {
      const action: MonoAction = this.actionManager.composeAction('activate', id)

      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public deactivate(id?: string): Promise<void> {
    return new Promise(resolve => {
      const action: MonoAction = this.actionManager.composeAction('deactivate', id)

      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public toggle(id?: string): Promise<void> {
    return new Promise(resolve => {
      const action: MonoAction = this.actionManager.composeAction('toggle', id)

      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  // Initialize

  public initialize(): this {
    this.elementManager.initialize()
    this.itemManager.initialize()
    this.eventManager.initialize()
    return this
  }
}