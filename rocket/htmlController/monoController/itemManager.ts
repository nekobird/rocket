import {
  MonoConfig,
} from './config'

import {
  MonoController,
} from './monoController'

export class ItemManager {

  private controller: MonoController

  public itemElements: HTMLElement[]
  public activeItem  : HTMLElement
  public activeItemId: string

  public isActive: boolean = false

  constructor(controller: MonoController) {
    this.controller = controller
  }

  // Initialize

  public initialize(): this {
    this.loadItemsFromConfig()
    return this
  }

  public loadItemsFromConfig(): this {
    const {config}: MonoController = this.controller
    let items: HTMLElement[]

    if (
      typeof config.selectorItems === 'string' &&
      typeof config.items === 'undefined'
    ) {
      const results: NodeListOf<HTMLElement> = document.querySelectorAll(this.controller.config.selectorItems)
      items = (results === null) ? [] : Array.from(results)
    } else if (
      typeof config.items === 'object'
    ) {
      if (
        Array.isArray(config.items) === false &&
        NodeList.prototype.isPrototypeOf(config.items)
      ) {
        items = Array.from(config.items)
      } else if (Array.isArray(config.items) === true) {
        items = <HTMLElement[]>config.items
      } else {
        items = []
      }
    } else {
      items = []
    }

    this.setAndFilterItems(items)
    return this
  }

  public get items(): HTMLElement[] {
    return this.itemElements
  }

  public setItems(items: HTMLElement[] | NodeListOf<HTMLElement> | string): void {
    if (typeof items === 'string') {
      const results: NodeListOf<HTMLElement> = document.querySelectorAll(items)
      if (results !== null) {
        this.setAndFilterItems(Array.from(results))
      }
    } else if (NodeList.prototype.isPrototypeOf(items)) {
      this.setAndFilterItems(Array.from(items))
    } else if (Array.isArray(items) === true) {
      this.setAndFilterItems(<HTMLElement[]>items)
    }
  }

  public setAndFilterItems(items): void {
    this.itemElements = items.map(item => {
      if (this.itemIsValid(item) === true) {
        return item
      }
    })
    this.filterActiveItems()
  }

  public filterActiveItems(): this {
    const {config}: MonoController = this.controller

    if (this.itemElements.length > 0) {
      this.itemElements.forEach(item => {
        if (item.classList.contains(config.classNameItemActive) === true) {
          if (this.isActive === true) {
            item.classList.remove(config.classNameItemActive)
          } else {
            this.activeItem = item
            this.activeItemId = item.dataset.id
            this.isActive = true
          }
        }
      })
      this.controller.isReady = true
    }
    return this
  }

  public itemIsValid(item: HTMLElement): boolean {
    let valid: boolean = true
    if (typeof item.dataset.id !== 'string') {
      valid = false
    }
    return valid
  }

  public getItemFromId(id: string): HTMLElement | false {
    let matchedItems: HTMLElement[] = []

    this.itemElements.forEach(item => {
      if (item.dataset.id === id) {
        matchedItems.push(item)
      }
    })

    if (matchedItems.length > 0) {
      return matchedItems[0]
    }
    return false
  }

  public activate(item: HTMLElement) {
    if (this.itemIsValid(item) === true) {
      item.classList.add(
        this.controller.config.classNameItemActive
      )
      this.activeItem   = item
      this.activeItemId = item.dataset.id
      this.isActive     = true
    }
  }

  public deactivate() {
    this.activeItem.classList.remove(
      this.controller.config.classNameItemActive
    )
    this.activeItem   = undefined
    this.activeItemId = undefined
    this.isActive     = false
  }
}