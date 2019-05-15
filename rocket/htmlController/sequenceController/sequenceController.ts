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
  SequenceAction,
  ActionManager,
} from './actionManager'

export class SequenceController {

  public config: SequenceConfig

  public itemManager  : ItemManager
  public eventManager : EventManager
  public actionManager: ActionManager

  public isReady: boolean = false

  constructor(config?: SequenceConfig) {
    this.config = Object.assign({}, DEFAULT_CONFIG)
    if (typeof config === 'object') {
      this.setConfig(config)
    }

    this.itemManager   = new ItemManager(this)
    this.eventManager  = new EventManager(this)
    this.actionManager = new ActionManager(this)

    this.initialize()
  }

  public setConfig(config: SequenceConfig): this {
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
    return this.itemManager.activeItem.dataset.id === id
  }

  // Actions

  public previous(): Promise<void> {
    return new Promise(resolve => {
      const action: SequenceAction = this.actionManager.composeAction('previous')
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public next(): Promise<void> {
    return new Promise(resolve => {
      const action: SequenceAction = this.actionManager.composeAction('next')
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public jump(id: string): Promise<void> {
    return new Promise(resolve => {
      const action: SequenceAction = this.actionManager.composeAction('jump', id)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }
}