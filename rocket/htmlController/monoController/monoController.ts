import {
  DOMUtil,
  DragEventManager,
} from '../../rocket'

import {
  ElementManager,
  EventManager,
  MONO_DEFAULT_CONFIG,
  MONO_EVENT_ENTRY_LIST,
  MonoAction,
  MonoActionManager,
  MonoConfig,
  MonoGroup,
  MonoGroupManager,
} from '../index'

export class MonoController {

  public isReady: boolean = false

  public config: MonoConfig

  public elementManager: ElementManager
  public eventManager  : EventManager
  public groupManager  : MonoGroupManager
  public actionManager : MonoActionManager

  public dragEventManager: DragEventManager

  constructor(config: MonoConfig) {
    this.elementManager = new ElementManager(this)
    this.groupManager   = new MonoGroupManager(this)
    this.actionManager  = new MonoActionManager(this)
    this.eventManager   = new EventManager(this)
    this.config = Object.assign({}, MONO_DEFAULT_CONFIG)
    this
      .setConfig(config)
      .initialize()
  }

  public setConfig(config: MonoConfig): MonoController {
    Object.assign(this.config, config)
    return this
  }

  // Action

  public activate(groupName: string, id: string): Promise<void> {
    return new Promise(resolve => {
      const action: MonoAction = this.actionManager.composeAction('activate', groupName, id)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public deactivate(groupName: string, id?: string): Promise<void> {
    return new Promise(resolve => {
      const action: MonoAction = this.actionManager.composeAction('deactivate', groupName, id)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public toggle(groupName: string, id?: string): Promise<void> {
    return new Promise(resolve => {
      const action: MonoAction = this.actionManager.composeAction('toggle', groupName, id)
      this.actionManager.actionHub(action)
        .then(() => resolve())
        .catch(() => resolve())
    })
  }

  public groupIsActive(groupName: string): boolean {
    if (
      typeof this.groupManager.groups[groupName]   === 'object' &&
      this.groupManager.groups[groupName].isActive === true
    ) {
      return true
    }
    return false
  }

  public itemIsActive(groupName: string, id: string): boolean {
    if (this.groupIsActive(groupName) === true) {
      return (this.groupManager.groups[groupName].activeItemId === id)
    }
    return false
  }

  // Initialize

  public initialize(): MonoController {
    this.elementManager.initialize()
    this.groupManager.initialize()

    this.initializeEventEntriesFromConfig()
    this.eventManager.listen()

    this.initializeExtraListeners()
    return this
  }

  private initializeEventEntriesFromConfig(): this {
    MONO_EVENT_ENTRY_LIST.forEach(eventEntry => {
      this.eventManager.addEntry(eventEntry)
    })
    return this
  }

  private initializeExtraListeners() {
    if (this.config.closeOnOutsideAction === true) {
      this.dragEventManager = new DragEventManager({
        enableLongPress: false,
        onUp: (event, manager) => {
          this.handleOutsideAction(event)
        }
      })
    }

    if (this.config.listenToKeydown === true) {
      window.addEventListener('keydown', this.eventHandlerKeydown)
    }
  }

  private handleOutsideAction = (event) => {
    if (
      this.config.closeOnOutsideAction === true &&
      this.actionManager.isRunning     === false
    ) {

      Object.keys(this.groupManager.groups).forEach(groupName => {
        const group: MonoGroup = this.groupManager.groups[groupName]

        const targetDownElement: HTMLElement | false = event.getTargetElementFromData(event.downData)
        const targetUpElement  : HTMLElement | false = event.getTargetElementFromData(event.upData)

        let classNames: string[] = [
          this.config.classNameJsActivate,
          this.config.classNameJsDeactivate,
          this.config.classNameJsToggle
        ]

        if (
          group.isActive    === true  &&
          targetDownElement !== false &&
          targetUpElement   !== false &&
          DOMUtil.hasAncestor(targetDownElement, group.activeItem) === false &&
          DOMUtil.hasAncestor(targetUpElement,   group.activeItem) === false &&
          DOMUtil.findAncestorWithClass(targetDownElement, classNames) === false
        ) {
          this.deactivate(groupName)
          this.config.onOutsideAction(group, this)
        }
      })
    }
  }

  private eventHandlerKeydown = (event: KeyboardEvent) => {
    if (
      this.config.listenToKeydown  === true &&
      this.actionManager.isRunning === false
    ) {
      Object.keys(this.groupManager.groups).forEach(groupName => {
        const group: MonoGroup = this.groupManager.groups[groupName]
        this.config.onKeydown(event, group, this)
      })
    }
  }
}