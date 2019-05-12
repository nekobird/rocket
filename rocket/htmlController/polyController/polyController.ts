import {
  DOMUtil,
  DragEventManager,
} from '../../rocket'

import {
  ElementManager,
  EventManager,
  POLY_DEFAULT_CONFIG,
  POLY_EVENT_ENTRY_LIST,
  PolyAction,
  PolyActionManager,
  PolyConfig,
  PolyGroup,
  PolyGroupManager,
} from '../index'

export class PolyController {

  public isReady: boolean = false

  public config: PolyConfig

  public elementManager: ElementManager
  public eventManager  : EventManager
  public groupManager  : PolyGroupManager
  public actionManager : PolyActionManager

  public dragEventManager: DragEventManager

  constructor(config: PolyConfig) {
    this.elementManager = new ElementManager(this)
    this.groupManager   = new PolyGroupManager(this)
    this.actionManager  = new PolyActionManager(this)
    this.eventManager   = new EventManager(this)

    this.config = Object.assign({}, POLY_DEFAULT_CONFIG)

    this
      .setConfig(config)
      .initialize()
  }

  public setConfig(config: PolyConfig): PolyController {
    Object.assign(this.config, config)
    return this
  }

  // ACTION

  public activate(groupName: string, id: string): Promise<void> {
    return new Promise(resolve => {
      const action: PolyAction = this.actionManager.composeAction('activate', groupName, id)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public deactivate(groupName: string, id: string): Promise<void> {
    return new Promise(resolve => {
      const action: PolyAction = this.actionManager.composeAction('deactivate', groupName, id)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public toggle(groupName: string, id: string): Promise<void> {
    return new Promise(resolve => {
      const action: PolyAction = this.actionManager.composeAction('toggle', groupName, id)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public activateAll(groupName: string): Promise<void> {
    return new Promise(resolve => {
      const action: PolyAction = this.actionManager.composeAction('activateAll', groupName)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public deactivateAll(groupName: string): Promise<void> {
    return new Promise(resolve => {
      const action: PolyAction = this.actionManager.composeAction('deactivateAll', groupName)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public toggleAll(groupName: string): Promise<void> {
    return new Promise(resolve => {
      const action: PolyAction = this.actionManager.composeAction('toggleAll', groupName)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public itemIsActive(groupName: string, id: string): boolean {
    const item: HTMLElement | null = document.querySelector(
      `${this.config.selectorItems}[data-group="${groupName}"][data-id="${id}"]`
    )
    if (item !== null) {
      return item.classList.contains(<string>this.config.classNameItemActive)
    }
    return false
  }

  public groupIsActive(groupName: string): boolean {
    const group: PolyGroup = this.groupManager.groups[groupName]
    if (typeof group === 'object') {
      return group.isActive
    }
    return false
  }

  // INITIALIZE

  public initialize(): PolyController {
    this.elementManager.initialize()
    this.groupManager.initialize()

    this.initializeEventEntriesFromConfig()
    this.initializeExtraListeners()
    return this
  }

  private initializeEventEntriesFromConfig(): this {
    POLY_EVENT_ENTRY_LIST.forEach(eventEntry => {
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
        const group: PolyGroup = this.groupManager.groups[groupName]
        this.config.onKeydown(event, group, this)
      })
    }
  }
}