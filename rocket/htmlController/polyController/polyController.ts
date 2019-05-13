import {
  EventManager,
} from './eventManager'

import {
  DEFAULT_CONFIG,
  PolyConfig,
} from './config'

import {
  ActionManager,
  PolyAction,
} from './actionManager'

import {
  ItemManager,
} from './itemManager'

export class PolyController {

  public isReady: boolean = false

  public config: PolyConfig

  public eventManager : EventManager
  public itemManager  : ItemManager
  public actionManager: ActionManager

  constructor(config?: PolyConfig) {
    this.config = Object.assign({}, DEFAULT_CONFIG)
    if (typeof config === 'object') {
      this.setConfig(config)
    }
    
    this.itemManager   = new ItemManager(this)
    this.actionManager = new ActionManager(this)
    this.eventManager  = new EventManager(this)

    this.initialize()
  }

  public setConfig(config: PolyConfig): this {
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
    let isActive: boolean = false
    this.itemManager.activeItems.forEach(item => {
      if (item.dataset.id === id) {
        isActive = true
      }
    })
    return isActive
  }

  // Actions

  public activate(id: string): Promise<void> {
    return new Promise(resolve => {
      const action: PolyAction = this.actionManager.composeAction('activate', id)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public deactivate(id: string): Promise<void> {
    return new Promise(resolve => {
      const action: PolyAction = this.actionManager.composeAction('deactivate', id)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public toggle(id: string): Promise<void> {
    return new Promise(resolve => {
      const action: PolyAction = this.actionManager.composeAction('toggle', id)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  // Group Actions

  public activateAll(): Promise<void> {
    return new Promise(resolve => {
      const action: PolyAction = this.actionManager.composeAction('activateAll')
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public deactivateAll(): Promise<void> {
    return new Promise(resolve => {
      const action: PolyAction = this.actionManager.composeAction('deactivateAll')
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public toggleAll(): Promise<void> {
    return new Promise(resolve => {
      const action: PolyAction = this.actionManager.composeAction('toggleAll')
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }
}