import {
  MonoController,
} from './monoController'

export class ItemManager {

  private controller: MonoController

  public items       : HTMLElement[]
  public activeItem  : HTMLElement
  public activeItemId: string
  public isActive    : boolean

  constructor(controller: MonoController) {
    this.controller = controller
  }

  // Initialize

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
        if (item.classList.contains(this.controller.config.classNameItemActive) === true) {
          if (this.isActive === true) {
            item.classList.remove(this.controller.config.classNameItemActive)
          } else {
            this.activeItem   = item
            this.activeItemId = item.dataset.id
            this.isActive     = true
          }
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

  public activate(item: HTMLElement) {
    if (this.itemIsValid(item) === true) {
      item.classList.add(this.controller.config.classNameItemActive)
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

  private itemIsValid(item: HTMLElement): boolean {
    let valid: boolean = true
    if (typeof item.dataset.id !== 'string') {
      valid = false
    }
    return valid
  }
}