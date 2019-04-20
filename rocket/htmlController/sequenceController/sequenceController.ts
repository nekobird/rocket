import {
  ElementManager,
  EventManager,
  SEQUENCE_DEFAULT_CONFIG,
  SEQUENCE_EVENT_ENTRY_LIST,
  SequenceActionManager,
  SequenceActionName,
  SequenceAction,
  SequenceConfig,
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
    this
      .setConfig(config)
      .initialize()
  }

  public setConfig(config: SequenceConfig): SequenceController {
    this.config = Object.assign(SEQUENCE_DEFAULT_CONFIG, config)
    return this
  }

  private initialize(): SequenceController {
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
    console.log(this.eventManager)
    return this
  }


  // PUBLIC

  public previous(groupName: string): Promise<void> {
    return new Promise(resolve => {
      let actionManager: SequenceActionManager = this.actionManager
      if (actionManager.isRunning === true) { actionManager.isNested = true }
      actionManager.actionHub(
        actionManager.composeAction('previous', groupName),
        () => { resolve() }
      )
    })
  }

  public next(groupName: string): Promise<void> {
    return new Promise(resolve => {
      let actionManager: SequenceActionManager = this.actionManager
      if (actionManager.isRunning === true) { actionManager.isNested = true }
      actionManager.actionHub(
        actionManager.composeAction('next', groupName),
        () => { resolve() }
      )
    })
  }

  public jump(groupName: string, id: string): Promise<void> {
    return new Promise(resolve => {
      let actionManager: SequenceActionManager = this.actionManager
      if (actionManager.isRunning === true) { actionManager.isNested = true }
      actionManager.actionHub(
        actionManager.composeAction('jump', groupName, id),
        () => { resolve() }
      )
    })
  }

}