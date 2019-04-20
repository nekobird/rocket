import {
  ElementManager,
  EventManager,
  MONO_DEFAULT_CONFIG,
  MONO_EVENT_ENTRY_LIST,
  MonoActionManager,
  MonoActionName,
  MonoConfig,
  MonoGroupManager,
} from '../index'

export class MonoController {

  public isReady: boolean = false

  public config: MonoConfig

  public elementManager: ElementManager
  public eventManager: EventManager<MonoActionName>

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
    console.log(this.eventManager)
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
    return this
  }

  // PUBLIC

  public activate(groupName: string): Promise<void> {
    return new Promise(resolve => {
      let actionManager: MonoActionManager = this.actionManager
      if (actionManager.isRunning === true) { actionManager.isNested = true }
      actionManager.actionHub(
        actionManager.composeAction('activate', groupName),
        () => { resolve() }
      )
    })
  }

  public deactivate(groupName: string): Promise<void> {
    return new Promise(resolve => {
      let actionManager: MonoActionManager = this.actionManager
      if (actionManager.isRunning === true) { actionManager.isNested = true }
      actionManager.actionHub(
        actionManager.composeAction('deactivate', groupName),
        () => { resolve() }
      )
    })
  }

}