import {
  ElementEntry,
  SequenceController,
} from './index'

export interface Groups {
  [groupName: string]: Group,
}

export interface Group {
  name: string,
  isActive: boolean,
  activeIndex: number,
  activeItem: HTMLElement,
  items: HTMLElement[],
}

export class GroupManager {

  private controller: SequenceController
  public groups: Groups = {}

  constructor(controller: SequenceController) {
    this.controller = controller
  }

  public initialize(): GroupManager {
    this
      .initializeGroups()
      .initializeActiveItems()
    return this
  }

  private initializeGroups(): GroupManager {
    const items: ElementEntry | false = this.controller.elementManager.getElementEntry('items')

    if (items) {
      items.elements.forEach(item => {
        const groupName: string = item.dataset.group
        const groupItems: HTMLElement[] = Array.from(document.querySelectorAll(
          `${this.controller.config.selectorItems}[data-group="${groupName}"]`
        ))
        this.groups[groupName] = {
          name: groupName,

          isActive: false,

          activeItem: undefined,
          activeIndex: undefined,

          items: groupItems,
        }
      })
    }
    return this
  }

  private initializeActiveItems(): GroupManager {
    if (this.groupCount > 0) {
      Object.keys(this.groups).forEach(groupName => {
        const group: Group = this.groups[groupName]

        group.items.forEach((item: HTMLElement, index: number) => {
          if (
            item.classList.contains(
              this.controller.config.classNameItemActive
            ) === true
          ) {
            if (typeof group.activeItem === 'undefined') {
              group.isActive = true

              group.activeIndex = index
              group.activeItem = item
            } else {
              item.classList.remove(
                this.controller.config.classNameItemActive
              )
            }
          }
        })

        if (typeof group.activeItem === 'undefined') {
          group.isActive = true

          group.activeIndex = 0
          group.activeItem = group.items[0]

          group.items[0].classList.add(
            this.controller.config.classNameItemActive
          )
        }
      })
      this.controller.isReady = true
    }
    return this
  }

  public get groupCount(): number {
    return Object.keys(this.groups).length
  }

  public getGroupProperties(groupName: string): Group {
    return this.groups[groupName]
  }

}