import {
  DOMUtil,
} from '../../rocket'

import {
  ElementManager,
  EventManager,
  MONO_DEFAULT_CONFIG,
  MONO_EVENT_ENTRY_LIST,
  MonoActionManager,
  MonoConfig,
  MonoGroup,
  MonoGroupManager,
} from '../index'

export class MonoController {

  public isReady: boolean = false

  public config: MonoConfig

  public elementManager: ElementManager
  public eventManager: EventManager

  public groupManager: MonoGroupManager
  public actionManager: MonoActionManager

  constructor(config: MonoConfig) {
    this
      .setConfig(config)
      .initialize()
  }

  public setConfig(config: MonoConfig): MonoController {
    this.config = Object.assign(MONO_DEFAULT_CONFIG, config)
    return this
  }

  private initializeEventEntriesFromConfig(): this {
    MONO_EVENT_ENTRY_LIST.forEach(eventEntry => {
      this.eventManager.addEntry(eventEntry)
    })
    return this
  }

  private initialize(): MonoController {
    this.elementManager = new ElementManager(this)
    this.groupManager = new MonoGroupManager(this)
    this.actionManager = new MonoActionManager(this)
    this.eventManager = new EventManager(this)

    this.elementManager.initialize()
    this.groupManager.initialize()

    this.initializeEventEntriesFromConfig()
    this.eventManager.listen()

    this.initializeExtraListeners()
    return this
  }

  // PUBLIC

  public activate(groupName: string): Promise<void> {
    return new Promise(resolve => {
      const actionManager: MonoActionManager = this.actionManager
      if (actionManager.isRunning === true) { actionManager.isNested = true }
      actionManager.actionHub(
        actionManager.composeAction('activate', groupName),
        () => { resolve() }
      )
    })
  }

  public deactivate(groupName: string): Promise<void> {
    return new Promise(resolve => {
      const actionManager: MonoActionManager = this.actionManager
      if (actionManager.isRunning === true) { actionManager.isNested = true }
      actionManager.actionHub(
        actionManager.composeAction('deactivate', groupName),
        () => { resolve() }
      )
    })
  }

  // EXTRA LISTENERS

  public initializeExtraListeners() {
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
        const group: MonoGroup = this.groupManager.groups[groupName]
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
        const group: MonoGroup = this.groupManager.groups[groupName]
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
        const group: MonoGroup = this.groupManager.groups[groupName]
        this.config.onKeydown(event, group, this)
      })
    }
  }

}