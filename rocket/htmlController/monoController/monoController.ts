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

  public itemManager  : ItemManager
  public actionManager: ActionManager
  public eventManager : EventManager

  constructor(config?: MonoConfig) {
    this.config = Object.assign({}, DEFAULT_CONFIG)
    if (typeof config === 'object') {
      this.setConfig(config)
    }

    this.itemManager   = new ItemManager(this)
    this.actionManager = new ActionManager(this)
    this.eventManager  = new EventManager(this)

    this.initialize()
  }

  public setConfig(config: MonoConfig): this {
    Object.assign(this.config, config)
    return this
  }

  // Initialize

  public initialize(): this {
    this.itemManager.initialize()
    this.eventManager.initialize()
    return this
  }

  public get isActive(): boolean {
    return this.itemManager.isActive
  }

  public isItemActive(id: string): boolean {
    if (this.itemManager.isActive === true) {
      return this.itemManager.activeItem.dataset.id === id
    }
    return false
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
}