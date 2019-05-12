import {
  ElementManager,
  EventManager,
} from '../index'

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

export class SequenceController {

  public isReady: boolean = false

  public config: SequenceConfig

  public elementManager: ElementManager
  public itemManager   : ItemManager
  public actionManager : ActionManager
  public eventManager  : EventManager

  constructor(config: SequenceConfig) {
    this.elementManager = new ElementManager(this)
    this.itemManager    = new ItemManager(this)
    this.actionManager  = new ActionManager(this)
    this.eventManager   = new EventManager(this)

    this.config = Object.assign({}, DEFAULT_CONFIG)
    this.setConfig(config)

    this.initialize()
  }

  public setConfig(config: SequenceConfig): this {
    Object.assign(this.config, config)
    return this
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

  // Initialize

  public initialize(): this {
    this.elementManager.initialize()
    this.itemManager.initialize()
    return this
  }
}