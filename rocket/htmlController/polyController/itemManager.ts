import {
  ElementEntry,
} from '../index'

import {
  PolyConfig,
} from './config'

import {
  PolyAction
} from './actionManager'

import {
  PolyController,
} from './polyController'

export interface PolyGroups {
  [groupName: string]: PolyGroup,
}

export interface PolyGroup {
  name: string,
  items: HTMLElement[],
  activeItems?: HTMLElement[],
  isActive: boolean,
}

export class ItemManager {

  private controller: PolyController

  public items      : HTMLElement[]
  public activeItems: HTMLElement[]

  public isActive: boolean = false

  constructor(controller: PolyController) {
    this.controller = controller

    this.items       = []
    this.activeItems = []
  }

  public initialize() {
    this
      .initializeItems()
      .initializeActiveItems()
    return this
  }

  public initializeItems(): this {
    const items: ElementEntry | false = this.controller.elementManager.getEntry('items')

    if (typeof items === 'object') {

      
    }
    return this
  }

  private initializeActiveItems(): this {
    if (this.items.length > 0) {
      this.items.forEach(item => {
        if (item.classList.contains(this.controller.config.classNameItemActive)) {
          this.activeItems.push(item)
          this.isActive = true
        }
      })
      this.controller.isReady = true
    }
    return this
  }

  public getItemFromId(id: string): HTMLElement | false {
    let matchedItems: HTMLElement[] = []

    this.items.forEach(item => {
      if (item.dataset.id === id) {
        matchedItems.push(item)
      }
    })

    if (matchedItems.length > 0) {
      return matchedItems[0]
    }

    return false
  }

  private activate(item: HTMLElement): boolean {
    const config: PolyConfig       = this.controller.config
    const itemManager: ItemManager = this.controller.itemManager

    if (itemManager.activeItems.indexOf(item) === -1) {
      item.classList.add(config.classNameItemActive)
      itemManager.activeItems.push(item)
      itemManager.isActive = true
      return true
    }
    return false
  }

  private deactivate(item: HTMLElement): boolean {
    const config: PolyConfig       = this.controller.config
    const itemManager: ItemManager = this.controller.itemManager

    if (itemManager.activeItems.indexOf(item) !== -1) {
      item.classList.remove(this.controller.config.classNameItemActive)

      const index: number = itemManager.activeItems.indexOf(item)
      itemManager.activeItems.slice(index, 1)

      if (itemManager.activeItems.length === 0) {
        itemManager.isActive = false
      }
      return true
    }
    return false
  }
}