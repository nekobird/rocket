import {
  SequenceController,
} from './sequenceController'

export class ItemManager {

  private controller: SequenceController

  public items      : HTMLElement[]
  public activeItem : HTMLElement
  public activeIndex: number

  public isActive: boolean = false

  constructor(controller: SequenceController) {
    this.controller = controller

    this.items = []
  }

  public initialize(): this {
    this.loadItemsFromConfig()
    this.filterItems()
    this.filterActiveItems()
    return this
  }

  public setItems(items: HTMLElement[] | NodeListOf<HTMLElement> | string): this {
    if (typeof items === 'string') {
      const results: NodeListOf<HTMLElement> = document.querySelectorAll(items)
      if (results !== null) {
        this.items = Array.from(results)
      }
      return this
    }

    if (NodeList.prototype.isPrototypeOf(items)) {
      this.items = Array.from(<NodeListOf<HTMLElement>>items)
      return this
    }

    if (Array.isArray(items) === true) {
      this.items = <HTMLElement[]>items
    }
    return this
  }

  public loadItemsFromConfig(): this {
    const {config}: SequenceController = this.controller

    if (
      typeof config.itemsSelector === 'string' &&
      typeof config.items === 'undefined'
    ) {
      const items: NodeListOf<HTMLElement> = document.querySelectorAll(config.itemsSelector)
      if (items !== null) {
        this.items = Array.from(items)
        return this
      }
    }
      
    if (
      Array.isArray(config.items) === false &&
      NodeList.prototype.isPrototypeOf(config.items)
    ) {
      this.items = Array.from(config.items)
      return this
    }
    
    if (Array.isArray(config.items) === true) {
      this.items = <HTMLElement[]>config.items
      return this
    }

    throw new Error('SequenceController: Items not defined.')
  }

  public filterItems(): this {
    this.items = this.items.filter(item => this.itemIsValid(item))
    return this
  }

  private filterActiveItems(): this {
    const {config}: SequenceController = this.controller

    if (this.items.length > 0) {
      this.items.forEach((item: HTMLElement, index: number) => {
        if (item.classList.contains(config.classNameItemActive) === true) {        
          if (this.isActive === false) {
            this.activeIndex = index
            this.activeItem  = item
            this.isActive    = true
          } else {
            item.classList.remove(config.classNameItemActive)
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
}