import {
  ElementEntry,
} from '../index'

import {
  SequenceConfig,
} from './config'

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
    this.initializeItems()
    this.initializeActiveItems()
    return this
  }

  public initializeItems(): this {
    const items: ElementEntry | false = this.controller.elementManager.getEntry('items')
    if (typeof items === 'object') {
      this.items = items.elements.map(item => {
        if (this.itemIsValid(item) === true) {
          return item
        }
      })
    }
    return this
  }

  private initializeActiveItems(): this {
    const config: SequenceConfig = this.controller.config

    this.items.forEach((item: HTMLElement, index: number) => {
      if (item.classList.contains(config.classNameItemActive) === true) {        
        if (this.isActive === false) {
          this.activeIndex = index
          this.activeItem  = item
          this.isActive    = true
        } else {
          item.classList.remove(<string>config.classNameItemActive)
        }
      }
    })
    this.controller.isReady = true
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

  public itemIsValid(item: HTMLElement): boolean {
    let valid: boolean = true
    if (typeof item.dataset.id !== 'string') {
      valid = false
    }
    return valid
  }
}