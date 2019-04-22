import {
  DOMUtil,
} from '../../rocket'

import {
  ElementManager,
  EventManager,
  POLY_DEFAULT_CONFIG,
  POLY_EVENT_ENTRY_LIST,
  PolyActionManager,
  PolyConfig,
  PolyGroup,
  PolyGroupManager,
} from '../index'

export class PolyController {

  public isReady: boolean = false

  public config: PolyConfig

  public elementManager: ElementManager
  public eventManager: EventManager

  public groupManager: PolyGroupManager
  public actionManager: PolyActionManager

  constructor(config: PolyConfig) {
    this.config = Object.assign({}, POLY_DEFAULT_CONFIG)
    this
      .setConfig(config)
      .initialize()
  }

  public setConfig(config: PolyConfig): PolyController {
    Object.assign(this.config, config)
    return this
  }

  private initializeEventEntriesFromConfig(): this {
    POLY_EVENT_ENTRY_LIST.forEach(eventEntry => {
      this.eventManager.addEntry(eventEntry)
    })
    console.log(this.eventManager)
    return this
  }

  private initialize(): PolyController {
    this.elementManager = new ElementManager(this)
    this.groupManager = new PolyGroupManager(this)
    this.actionManager = new PolyActionManager(this)
    this.eventManager = new EventManager(this)

    this.elementManager.initialize()
    this.groupManager.initialize()

    this.initializeEventEntriesFromConfig()
    this.eventManager.listen()

    this.initializeExtraListeners()
    return this
  }

  public itemIsActive(groupName: string, id: string): boolean {
    const item: HTMLElement = document.querySelector(
      `${this.config.selectorItems}[data-group="${groupName}"][data-id="${id}"]`
    )
    if (
      item !== null &&
      item instanceof HTMLElement
    ) {
      return item.classList.contains(this.config.classNameItemActive)
    }
    return false
  }

  public groupIsActive(groupName: string): boolean {
    const group: PolyGroup = this.groupManager.groups[groupName]
    if (typeof group !== 'undefined') {
      return group.isActive
    }
    return false
  }

  // ACTION

  public activate(groupName: string, id: string): Promise<void> {
    return new Promise(resolve => {
      this.actionManager.actionHub(
        this.actionManager.composeAction('activate', groupName, id),
        () => { resolve() }
      )
    })
  }

  public deactivate(groupName: string, id: string): Promise<void> {
    return new Promise(resolve => {
      this.actionManager.actionHub(
        this.actionManager.composeAction('deactivate', groupName, id),
        () => { resolve() }
      )
    })
  }

  public toggle(groupName: string, id: string): Promise<void> {
    return new Promise(resolve => {
      this.actionManager.actionHub(
        this.actionManager.composeAction('toggle', groupName, id),
        () => { resolve() }
      )
    })
  }

  public activateAll(groupName: string): Promise<void> {
    return new Promise(resolve => {
      this.actionManager.actionHub(
        this.actionManager.composeAction('activateAll', groupName),
        () => { resolve() }
      )
    })
  }

  public deactivateAll(groupName: string): Promise<void> {
    return new Promise(resolve => {
      this.actionManager.actionHub(
        this.actionManager.composeAction('deactivateAll', groupName),
        () => { resolve() }
      )
    })
  }

  public toggleAll(groupName: string): Promise<void> {
    return new Promise(resolve => {
      this.actionManager.actionHub(
        this.actionManager.composeAction('toggleAll', groupName),
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
        const group: PolyGroup = this.groupManager.groups[groupName]
        if (
          group.isActive == true &&
          DOMUtil.hasAncestor(<HTMLElement>event.target, group.activeItems) === false
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
        const group: PolyGroup = this.groupManager.groups[groupName]
        if (
          group.isActive == true &&
          DOMUtil.hasAncestor(<HTMLElement>event.target, group.activeItems) === false
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
        const group: PolyGroup = this.groupManager.groups[groupName]
        this.config.onKeydown(event, group, this)
      })
    }
  }

}