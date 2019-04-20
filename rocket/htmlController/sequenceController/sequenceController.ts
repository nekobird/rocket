import {
  DOMUtil,
} from '../../rocket'

import {
  DEFAULT_CONFIG,
  ElementManager,
  GroupManager,
  ActionManager,
  EventManager,
  Config
} from './index'

export class SequenceController {

  public isReady: boolean = false

  public config: Config

  public elementManager: ElementManager
  public groupManager: GroupManager
  public actionManager: ActionManager
  public eventManager: EventManager

  constructor(config: Config) {
    this
      .setConfig(config)
      .initialize()
  }

  public setConfig(config: Config): SequenceController {
    this.config = Object.assign(DEFAULT_CONFIG, config)
    return this
  }

  private initialize(): SequenceController {
    this.elementManager = new ElementManager(this)
    this.groupManager = new GroupManager(this)
    this.actionManager = new ActionManager(this)
    this.eventManager = new EventManager(this)

    this.elementManager.initialize()
    this.groupManager.initialize()
    this.eventManager.initialize()
    return this
  }

  // PUBLIC

  public previous(groupName: string): Promise<void> {
    return new Promise(resolve => {
      let actionManager: ActionManager = this.actionManager
      if (actionManager.isRunning === true) { actionManager.isNested = true }
      actionManager.hubAction(
        actionManager.composeAction('previous', groupName),
        () => { resolve() }
      )
    })
  }

  public next(groupName: string): Promise<void> {
    return new Promise(resolve => {
      let actionManager: ActionManager = this.actionManager
      if (actionManager.isRunning === true) { actionManager.isNested = true }
      actionManager.hubAction(
        actionManager.composeAction('next', groupName),
        () => { resolve() }
      )
    })
  }

  public jump(groupName: string, id: string): Promise<void> {
    return new Promise(resolve => {
      let actionManager: ActionManager = this.actionManager
      if (actionManager.isRunning === true) { actionManager.isNested = true }
      actionManager.hubAction(
        actionManager.composeAction('jump', groupName, id),
        () => { resolve() }
      )
    })
  }

}