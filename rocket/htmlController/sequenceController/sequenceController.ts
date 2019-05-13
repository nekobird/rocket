import {
  DEFAULT_CONFIG,
  SequenceConfig,
} from './config'

import {
  ItemManager,
} from './itemManager'

import {
  SequenceAction,
  ActionManager,
} from './actionManager'

import {
  EventManager,
} from './eventManager'

export class SequenceController {

  public isReady: boolean = false

  public config: SequenceConfig

  public itemManager   : ItemManager
  public actionManager : ActionManager
  public eventManager  : EventManager

  constructor(config?: SequenceConfig) {
    this.config = Object.assign({}, DEFAULT_CONFIG)
    if (typeof config === 'object') {
      this.setConfig(config)
    }

    this.itemManager    = new ItemManager(this)
    this.actionManager  = new ActionManager(this)
    this.eventManager   = new EventManager(this)

    this.initialize()
  }

  public setConfig(config: SequenceConfig): this {
    Object.assign(this.config, config)
    return this
  }

  // Initialize

  public initialize(): this {
    this.itemManager.initialize()
    return this
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