import {
  Sortable,
} from './sortable'

export class ItemManager {

  public sortable: Sortable

  public container?: HTMLElement
  public items?: HTMLElement[]

  public isLoaded: boolean = false

  constructor(sortable: Sortable) {
    this.sortable = sortable
  }

  public initialize() {
    this.getContainer()
    this.getItems()
  }

  public getContainer(): this {
    const { config } = this.sortable

    if (
      typeof config.container === 'undefined'
      && typeof config.containerSelector === 'string'
    ) {
      const container: HTMLElement | null = document.querySelector(
        config.containerSelector
      )

      if (container !== null) {
        config.container = container
        return this
      }

      throw new Error('Sortable: Fail to get container.')
    }

    if (typeof config.container === 'object') {
      return this
    }

    throw new Error('Sortable: Container defined.')
  }

  public getItems(): this {
    const { config } = this.sortable
  
    if (
      typeof config.items === 'undefined'
      && typeof config.itemsSelector === 'string'
    ) {
      const items: NodeListOf<HTMLElement> = document.querySelectorAll(
        config.itemsSelector
      )

      if (items !== null) {
        config.items = Array.from(items)
      }

      throw new Error('Sortable: Fail to get items.')
    }

    if (Array.isArray(config.items) === true) {
      return this
    }

    throw new Error('Sortable: Items not defined.')
  }
}