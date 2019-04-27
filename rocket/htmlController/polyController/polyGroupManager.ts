import {
  ElementEntry,
  PolyController,
} from '../index'

export interface PolyGroups {
  [groupName: string]: PolyGroup,
}

export interface PolyGroup {
  name: string,
  items: HTMLElement[],
  activeItems?: HTMLElement[],
  isActive: boolean,
}

export class PolyGroupManager {

  private controller: PolyController
  public groups: PolyGroups = {}

  constructor(controller: PolyController) {
    this.controller = controller
  }

  public initialize() {
    this
      .initializeGroups()
      .initializeActiveItems()
    return this
  }

  public initializeGroups(): this {
    const items: ElementEntry | false = this.controller.elementManager.getEntry('items')

    if (typeof items === 'object') {
      items.elements.forEach(item => {
        const groupName: string = item.dataset.group
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
          activeItems: [],
          isActive: false,
        }
      })
    }

    return this
  }

  private initializeActiveItems(): this {
    if (this.groupCount > 0) {
      Object.keys(this.groups).forEach(groupName => {
        const group: PolyGroup = this.groups[groupName]
        group.items.forEach((item, index) => {
          if (item.classList.contains(this.controller.config.classNameItemActive)) {
            group.activeItems.push(item)
            group.isActive = true
          }
        })
      })
      this.controller.isReady = true
    }
    return this
  }

  public get groupCount(): number {
    return Object.keys(this.groups).length
  }

  public getGroupProperty(groupName: string): PolyGroup | false {
    if (typeof this.groups[groupName] === 'object') {
      return this.groups[groupName]
    }
    return false
  }

}