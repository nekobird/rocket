import {
  DOMUtil,
} from '../../rocket'

import {
  Config,
  DEFAULT_CONFIG,
} from './config'

import {
  ActionManager
} from './actionManager'

import {
  EventManager
} from './eventManager'

import {
  Group,
  GroupManager,
} from './groupManager'

import {
  ElementManager,
} from './elementManager'

export class PolyController {

  public isReady: boolean = false

  public config: Config

  public elementManager: ElementManager
  public groupManager: GroupManager
  public actionManager: ActionManager

  public eventManager: EventManager

  constructor(config: Config) {
    this.config = Object.assign({}, DEFAULT_CONFIG)
    this.setConfig(config)
    this.initialize()
  }

  public setConfig(config: Config) {
    Object.assign(this.config, config)
  }

  private initialize() {
    this.elementManager = new ElementManager(this)
    this.groupManager = new GroupManager(this)
    this.actionManager = new ActionManager(this)
    this.eventManager = new EventManager(this)

    this.elementManager.initialize()
    this.groupManager.initialize()
    this.eventManager.initialize()
  }

  public itemIsActive(groupName: string, id: string): boolean {
    const item: HTMLElement = document.querySelector(
      `${this.config.selectorItems}[data-group="${groupName}"][data-id="${id}"]`
    )
    if (item !== null && item instanceof HTMLElement) {
      return item.classList.contains(this.config.classNameItemActive)
    }
    return false
  }

  public groupIsActive(groupName: string): boolean {
    const group: Group = this.groupManager.groups[groupName]
    if (typeof group !== 'undefined') {
      return group.isActive
    }
    return false
  }

  // ACTION

  public activate(groupName: string, id: string): Promise<any> {
    return new Promise(resolve => {
      this.actionManager.hubAction(
        this.actionManager.composeAction('activate', groupName, id),
        () => { resolve() }
      )
    })
  }

  public deactivate(groupName: string, id: string): Promise<any> {
    return new Promise(resolve => {
      this.actionManager.hubAction(
        this.actionManager.composeAction('deactivate', groupName, id),
        () => { resolve() }
      )
    })
  }

  public toggle(groupName: string, id: string): Promise<any> {
    return new Promise(resolve => {
      this.actionManager.hubAction(
        this.actionManager.composeAction('toggle', groupName, id),
        () => { resolve() }
      )
    })
  }

  public activateAll(groupName: string): Promise<any> {
    return new Promise(resolve => {
      this.actionManager.hubAction(
        this.actionManager.composeAction('activateAll', groupName),
        () => { resolve() }
      )
    })
  }

  public deactivateAll(groupName: string): Promise<any> {
    return new Promise(resolve => {
      this.actionManager.hubAction(
        this.actionManager.composeAction('deactivateAll', groupName),
        () => { resolve() }
      )
    })
  }

  public toggleAll(groupName: string): Promise<any> {
    return new Promise(resolve => {
      this.actionManager.hubAction(
        this.actionManager.composeAction('toggleAll', groupName),
        () => { resolve() }
      )
    })
  }

}