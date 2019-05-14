import {
  PolyConfig,
} from './config'

import {
  PolyController,
} from './polyController'

export class ItemManager {

  private controller: PolyController

  public items: HTMLElement[]
  public activeItems: HTMLElement[]

  public isActive: boolean = false

  constructor(controller: PolyController) {
    this.controller = controller

    this.items = []
    this.activeItems = []
  }

  public initialize() {
    this
      .initializeItems()
      .initializeActiveItems()
    return this
  }

  public initializeItems(): this {
    const items: NodeListOf<HTMLElement> = document.querySelectorAll(this.controller.config.selectorItems)

    if (items !== null) {
      this.items = Array.from(items).map(item => {
        if (this.itemIsValid(item) === true) {
          return item
        }
      })
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

  public activate(item: HTMLElement): boolean {
    const {config}: PolyController = this.controller
    if (this.activeItems.indexOf(item) === -1) {
      item.classList.add(config.classNameItemActive)
      this.activeItems.push(item)
      this.isActive = true
      return true
    }
    return false
  }

  public deactivate(item: HTMLElement): boolean {
    const {config}: PolyController = this.controller
    const index: number = this.activeItems.indexOf(item)

    if (index !== -1) {
      item.classList.remove(config.classNameItemActive)
      this.activeItems.splice(index, 1)
      if (this.activeItems.length === 0) {
        this.isActive = false
      }
      return true
    }
    return false
  }

  public itemIsValid(item: HTMLElement): boolean {
    let valid: boolean = true
    if (typeof item.dataset.id !== 'string') {
      valid = false
    }
    return valid
  }
}