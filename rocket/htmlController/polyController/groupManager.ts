import {
  PolyController,
} from './polyController'

export interface Groups {
  [groupName: string]: Group,
}

export interface Group {
  name: string,
  items: NodeListOf<HTMLElement>,
  activeItems?: HTMLElement[],
  isActive: boolean,
}

export class GroupManager {

  private controller: PolyController

  public groups: Groups = {}

  constructor(controller: PolyController) {
    this.controller = controller
  }

  public get groupCount(): number {
    return Object.keys(this.groups).length
  }

  public getGroupProperties(groupName: string): Group {
    return this.groups[groupName]
  }

  public initialize(): GroupManager {
    const items = this.controller.elementManager.getEntry('items')
    if (items) {
      items.elements.forEach(item => {
        const groupName: string = item.dataset.group
        const elementsItems: NodeListOf<HTMLElement> = document.querySelectorAll(
          `${this.controller.config.selector.items}[data-group="${groupName}"]`
        )
        this.groups[groupName] = {
          name: groupName,
          items: elementsItems,
          activeItems: [],
          isActive: false,
        }
      })
    }
    return this
  }

  private initializeActiveItems(): GroupManager {
    if (this.groupCount > 0) {
      Object.keys(this.groups).forEach(groupName => {
        const group: Group = this.groups[groupName]
        Array.from(group.items).forEach((item, index) => {
          if (item.classList.contains(this.controller.config.className.itemActive)) {
            group.activeItems.push(item)
            group.isActive = true
          }
        })
      })
      this.controller.isReady = true
    }
    return this
  }

}