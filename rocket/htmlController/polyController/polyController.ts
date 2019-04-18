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
    Object.assign(this, config)
  }

  private initialize() {
    this.elementManager = new ElementManager(this)
    this.groupManager = new GroupManager(this)
    this.actionManager = new ActionManager(this)
    this.eventManager = new EventManager(this)

    this.mapConfigToElement()
    this.elementManager.loadElements()

    this.groupManager.initialize()
  }

  private mapConfigToElement() {
    return {
      'items': this.config.selector.items,
      'jsActivate': `.${this.config.className.jsActivate}`,
      'jsDeactivate': `.${this.config.className.jsDeactivate}`,
      'jsToggle': `.${this.config.className.jsToggle}`,
      'jsActivateAll': `.${this.config.className.jsActivateAll}`,
      'jsDeactivateAll': `.${this.config.className.jsDeactivateAll}`,
      'jsToggleAll': `.${this.config.className.jsToggleAll}`,
    }
  }

  private mapActionToEvent() {
    return {
      jsActivate: ['click', 'touch'],
      jsDeactivate: ['click', 'touch'],
      jsToggle: ['click', 'touch'],
      jsActivateAll: ['click', 'touch'],
      jsDeactivateAll: ['click', 'touch'],
      jsToggleAll: ['click', 'touch'],
    }
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