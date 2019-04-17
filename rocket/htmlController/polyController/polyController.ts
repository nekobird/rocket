import {
  DOMUtil,
} from '../../rocket'

import {
  Groups
} from './interfaces/index'

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
  GroupManager,
} from './groupManager'

import {
  ElementManager,
} from './elementManager'

export class PolyController {

  private isReady: boolean = false

  private config: Config
  private actionManager: ActionManager

  private elementManager: ElementManager
  private groupManager: GroupManager
  private eventManager: EventManager

  constructor(config: Config) {
    this.config = Object.assign({}, DEFAULT_CONFIG)
    this.setConfig(config)
    this.initialize()
  }

  public setConfig(config: Config) {
    Object.assign(this, config)
  }

  private initialize() {
    this.actionManager.initialize(this)
    this.elementManager.initialize(this)
    this.groupManager.initialize(this)
    this.eventManager.initialize(this)
  }

  private mapConfigToElements() {
    let map = {
      'items': this.config.selector.items,
      'jsActivate': `.${this.config.className.jsActivate}`,
      'jsDeactivate': `.${this.config.className.jsDeactivate}`,
      'jsToggle': `.${this.config.className.jsToggle}`,
      'jsActivateAll': `.${this.config.className.jsActivateAll}`,
      'jsDeactivateAll': `.${this.config.className.jsDeactivateAll}`,
      'jsToggleAll': `.${this.config.className.jsToggleAll}`,
    }
    this.elementManager.mapElementSelector(map)
  }

  public itemIsActive(groupName: string, id: string): boolean {
    const item: HTMLElement = document.querySelector(
      `${this.config.selector.items}[data-group="${groupName}"][data-id="${id}"]`
    )
    if (item !== null && item instanceof HTMLElement) {
      return item.classList.contains(this.config.className.itemActive)
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
      this.hubAction(
        this.composeAction('activate', groupName, id),
        () => { resolve() }
      )
    })
  }

  public deactivate(groupName: string, id: string): Promise<any> {
    return new Promise(resolve => {
      this.hubAction(
        this.composeAction('deactivate', groupName, id),
        () => { resolve() }
      )
    })
  }

  public toggle(groupName: string, id: string): Promise<any> {
    return new Promise(resolve => {
      this.hubAction(
        this.composeAction('toggle', groupName, id),
        () => { resolve() }
      )
    })
  }

  public activateAll(groupName: string): Promise<any> {
    return new Promise(resolve => {
      this.hubAction(
        this.composeAction('activateAll', groupName),
        () => { resolve() }
      )
    })
  }

  public deactivateAll(groupName: string): Promise<any> {
    return new Promise(resolve => {
      this.hubAction(
        this.composeAction('deactivateAll', groupName),
        () => { resolve() }
      )
    })
  }

  public toggleAll(groupName: string): Promise<any> {
    return new Promise(resolve => {
      this.hubAction(
        this.composeAction('toggleAll', groupName),
        () => { resolve() }
      )
    })
  }

}