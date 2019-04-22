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
  public groupManager: SequenceGroupManager
  public actionManager: SequenceActionManager
  public eventManager: EventManager

  constructor(config: SequenceConfig) {
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
      let actionManager: SequenceActionManager = this.actionManager
      const action: SequenceAction = actionManager.composeAction('previous', groupName)
      actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public next(groupName: string): Promise<void> {
    return new Promise(resolve => {
      let actionManager: SequenceActionManager = this.actionManager
      const action: SequenceAction = actionManager.composeAction('next', groupName)
      actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public jump(groupName: string, id: string): Promise<void> {
    return new Promise(resolve => {
      let actionManager: SequenceActionManager = this.actionManager
      const action: SequenceAction = actionManager.composeAction('jump', groupName, id)
      actionManager.actionHub(action)
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
    this.elementManager = new ElementManager(this)
    this.groupManager = new SequenceGroupManager(this)
    this.actionManager = new SequenceActionManager(this)
    this.eventManager = new EventManager(this)

    this.elementManager.initialize()
    this.groupManager.initialize()

    this.initializeEventEntriesFromConfig()
    this.eventManager.listen()
    return this
  }

  private initializeEventEntriesFromConfig(): this {
    SEQUENCE_EVENT_ENTRY_LIST.forEach(eventEntry => {
      this.eventManager.addEntry(eventEntry)
    })
    return this
  }

  private initializeExtraListeners() {
    if (this.config.listenToClickOutside === true) {
      window.addEventListener('click', this.eventHandlerClickOutside)
    }
    if (this.config.listenToTouchOutside === true) {
      window.addEventListener('touchstart', this.eventHandlerTouchOutside)
    }
    if (this.config.listenToKeydown === true) {
      window.addEventListener('keydown', this.eventHandlerKeydown)
    }
  }

  private eventHandlerClickOutside = (event: MouseEvent) => {
    if (
      this.config.listenToClickOutside === true &&
      this.actionManager.isRunning === false
    ) {
      Object.keys(this.groupManager.groups).forEach(groupName => {
        const group: SequenceGroup = this.groupManager.groups[groupName]
        if (
          group.isActive == true &&
          DOMUtil.hasAncestor(<HTMLElement>event.target, group.activeItem) === false
        ) {
          this.config.onClickOutside(event, group, this)
        }
      })
    }
  }

  private eventHandlerTouchOutside = (event: TouchEvent) => {
    if (
      this.config.listenToTouchOutside === true &&
      this.actionManager.isRunning === false
    ) {
      Object.keys(this.groupManager.groups).forEach(groupName => {
        const group: SequenceGroup = this.groupManager.groups[groupName]
        if (
          group.isActive == true &&
          DOMUtil.hasAncestor(<HTMLElement>event.target, group.activeItem) === false
        ) {
          this.config.onTouchOutside(event, group, this)
        }
      })
    }
  }

  private eventHandlerKeydown = (event: KeyboardEvent) => {
    if (
      this.config.listenToKeydown === true &&
      this.actionManager.isRunning === false
    ) {
      Object.keys(this.groupManager.groups).forEach(groupName => {
        const group: SequenceGroup = this.groupManager.groups[groupName]
        this.config.onKeydown(event, group, this)
      })
    }
  }

}