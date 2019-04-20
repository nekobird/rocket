import {
  ElementEntry,
  SequenceConfig,
  SequenceController,
} from '../index'

export interface SequenceGroups {
  [groupName: string]: SequenceGroup,
}

export interface SequenceGroup {
  name: string,
  items: HTMLElement[],
  activeIndex: number,
  activeItem: HTMLElement,
  isActive: boolean,
}

export class SequenceGroupManager {

  private controller: SequenceController
  public groups: SequenceGroups = {}

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

    if (items) {
      items.elements.forEach(item => {
        const groupName: string = item.dataset.group
        const groupItems: HTMLElement[] = Array.from(document.querySelectorAll(
          `${this.controller.config.selectorItems}[data-group="${groupName}"]`
        ))
        this.groups[groupName] = {
          name: groupName,
          items: groupItems,
          activeIndex: undefined,
          activeItem: undefined,
          isActive: false,
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
            item.classList.contains(config.classNameItemActive) === true
          ) {
            if (typeof group.activeItem === 'undefined') {
              group.activeIndex = index
              group.activeItem = item
              group.isActive = true
            } else {
              item.classList.remove(config.classNameItemActive)
            }
          }
        })

        if (typeof group.activeItem === 'undefined') {
          group.items[0].classList.add(config.classNameItemActive)
          group.activeIndex = 0
          group.activeItem = group.items[0]
          group.isActive = true
        }
      })
      this.controller.isReady = true
    }
    return this
  }

  // GROUP

  public get groupCount(): number {
    return Object.keys(this.groups).length
  }

  public getGroupProperty(groupName: string): SequenceGroup {
    return this.groups[groupName]
  }

}