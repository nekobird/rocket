import {
  DOMUtil,
} from '../../rocket'

import {
  Groups
} from './interfaces/index'

export class PolyHTMLController {

  private isReady: boolean = false

  private groupManager
  private eventManager
  private elementManager
  private configManager

  constructor(config: Config) {
    this.config = config
    this.initialize()
  }

  set config(config: Config) {
    Object.assign(this, config)
  }

  private initialize() {
    this.elementManager.initialize()
  }

  public itemIsActive(groupName: string, id: string): boolean {
    const item: HTMLElement = document.querySelector(
      `${this.selector_item}[data-group="${groupName}"][data-id="${id}"]`
    )
    if (item !== null && item instanceof HTMLElement) {
      return item.classList.contains(this.className_active)
    }
    return false
  }

  public groupIsActive(groupName: string): boolean {
    const group: Group = this.groups[groupName]
    if (typeof group !== 'undefined') {
      return group.isActive
    }
    return false
  }

  public getGroupProperties(groupName: string): Group {
    return this.groups[groupName]
  }

  // ACTION

  public activate(groupName: string, id: string): Promise<any> {
    return new Promise(resolve => {
      this.hub_action(
        this.composeAction('activate', groupName, id),
        () => { resolve() }
      )
    })
  }

  public deactivate(groupName: string, id: string): Promise<any> {
    return new Promise(resolve => {
      this.hub_action(
        this.composeAction('deactivate', groupName, id),
        () => { resolve() }
      )
    })
  }

  public toggle(groupName: string, id: string): Promise<any> {
    return new Promise(resolve => {
      this.hub_action(
        this.composeAction('toggle', groupName, id),
        () => { resolve() }
      )
    })
  }

  public activateAll(groupName: string): Promise<any> {
    return new Promise(resolve => {
      this.hub_action(
        this.composeAction('activateAll', groupName),
        () => { resolve() }
      )
    })
  }

  public deactivateAll(groupName: string): Promise<any> {
    return new Promise(resolve => {
      this.hub_action(
        this.composeAction('deactivateAll', groupName),
        () => { resolve() }
      )
    })
  }

  public toggleAll(groupName: string): Promise<any> {
    return new Promise(resolve => {
      this.hub_action(
        this.composeAction('toggleAll', groupName),
        () => { resolve() }
      )
    })
  }

}