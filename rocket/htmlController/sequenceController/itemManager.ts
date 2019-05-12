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

  public isActive: boolean

  constructor(controller: SequenceController) {
    this.controller = controller
  }

  public initialize(): this {
    this
      .initializeGroups()
      .initializeActiveItems()
    return this
  }

  private initializeGroups(): this {
    const items: ElementEntry | false = this.controller.elementManager.getEntry('items')

    if (
      typeof items          === 'object' &&
      typeof items.elements === 'object'
    ) {

      items.elements.forEach(item => {
        const groupName: string | undefined = item.dataset.group
        if (typeof groupName === 'string') {
          const groupItemElements: NodeListOf<HTMLElement> = document.querySelectorAll(
            `${this.controller.config.selectorItems}[data-group="${groupName}"]`
          )
          let groupItems: HTMLElement[]
          if (groupItemElements !== null) {
            groupItems = Array.from(groupItemElements)
          } else {
            groupItems = []
          }
          this.groups[groupName] = {
            name: groupName,
            items: groupItems,
            activeIndex: undefined,
            activeItem: undefined,
            isActive: false,
          }
        }
      })
    }

    return this
  }

  private initializeActiveItems(): this {
    if (this.groupCount > 0) {
      const config: SequenceConfig = this.controller.config

      Object.keys(this.groups).forEach(groupName => {
        const group: SequenceGroup = this.groups[groupName]

        group.items.forEach((item: HTMLElement, index: number) => {
          if (
            item.classList.contains(<string>config.classNameItemActive) === true
          ) {
            if (typeof group.activeItem === 'undefined') {
              group.activeIndex = index
              group.activeItem = item
              group.isActive = true
            } else {
              item.classList.remove(<string>config.classNameItemActive)
            }
          }
        })

        if (typeof group.activeItem === 'undefined') {
          group.items[0].classList.add(<string>config.classNameItemActive)
          group.activeIndex = 0
          group.activeItem = group.items[0]
          group.isActive = true
        }
      })
      this.controller.isReady = true
    }
    return this
  }
}