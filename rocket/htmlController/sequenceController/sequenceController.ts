import {
  DOMUtil,
} from '../../rocket'

import {
  ElementManager,
  EventManager,
  SEQUENCE_DEFAULT_CONFIG,
  SEQUENCE_EVENT_ENTRY_LIST,
  SequenceAction,
  SequenceActionManager,
  SequenceConfig,
  SequenceGroup,
  SequenceGroupManager,
} from '../index'

export class SequenceController {

  public isReady: boolean = false

  public config: SequenceConfig

  public elementManager: ElementManager
  public groupManager  : SequenceGroupManager
  public actionManager : SequenceActionManager
  public eventManager  : EventManager

  constructor(config: SequenceConfig) {
    this.elementManager = new ElementManager(this)
    this.groupManager   = new SequenceGroupManager(this)
    this.actionManager  = new SequenceActionManager(this)
    this.eventManager   = new EventManager(this)
    this.config = Object.assign({}, SEQUENCE_DEFAULT_CONFIG)
    this
      .setConfig(config)
      .initialize()
  }

  public setConfig(config: SequenceConfig): SequenceController {
    Object.assign(this.config, config)
    return this
  }

  // ACTION

  public previous(groupName: string): Promise<void> {
    return new Promise(resolve => {
      const action: SequenceAction = this.actionManager.composeAction('previous', groupName)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public next(groupName: string): Promise<void> {
    return new Promise(resolve => {
      const action: SequenceAction = this.actionManager.composeAction('next', groupName)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public jump(groupName: string, id: string): Promise<void> {
    return new Promise(resolve => {
      const action: SequenceAction = this.actionManager.composeAction('jump', groupName, id)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public itemIsActive(groupName: string, id: string): boolean {
    if (
      typeof this.groupManager[groupName] === 'object' &&
      this.groupManager[groupName].activeItem.dataset.id === id
    ) {
      return true
    }
    return false
  }

  // INITIALIZE

  public initialize(): SequenceController {
    this.elementManager.initialize()
    this.groupManager.initialize()

    this.initializeEventEntriesFromConfig()
    this.initializeExtraListeners()
    return this
  }

  private initializeEventEntriesFromConfig(): this {
    SEQUENCE_EVENT_ENTRY_LIST.forEach(eventEntry => {
      this.eventManager.addEntry(eventEntry)
    })
    return this
  }

  private initializeExtraListeners() {
    if (this.config.listenToKeydown === true) {
      window.addEventListener('keydown', this.eventHandlerKeydown)
    }
  }

  private eventHandlerKeydown = (event: KeyboardEvent) => {
    if (
      this.config.listenToKeydown  === true &&
      this.actionManager.isRunning === false
    ) {
      Object.keys(this.groupManager.groups).forEach(groupName => {
        const group: SequenceGroup = this.groupManager.groups[groupName]
        this.config.onKeydown(event, group, this)
      })
    }
  }
}