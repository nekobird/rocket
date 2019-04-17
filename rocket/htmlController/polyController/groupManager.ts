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

  private groups: Groups = {}

  private controller: PolyController

  constructor(controller: PolyController) {
    this.controller = controller
  }

  get groupCount(): number {
    return Object.keys(this.groups).length
  }

  public getGroupProperties(groupName: string): Group {
    return this.groups[groupName]
  }

  private initialize(): GroupManager {
    // Initialize Groups
    const items = this.controller.elementManager.getElement('items')
    Array.from(items.elements.forEach(item => {
      const groupName: string = item.dataset.group
      const items: NodeListOf<HTMLElement> = document.querySelectorAll(
        `${items.selector}[data-group="${groupName}"]`
      )
      // Initialize Group
      this.groups[groupName] = {
        name: groupName,
        items: items.elements,
        activeItems: [],
        isActive: false,
      }
    })
    return this
  }

  private initializeActiveItems(): GroupManager {
    if (this.groupCount > 0) {
      Object.keys(this.groups).forEach(groupName => {
        const group: Group = this.groups[groupName]
        Array.from(group.items).forEach((item, index) => {
          if (item.classList.contains(this.classNameActive)) {
            group.activeItems.push(item)
            group.isActive = true
          }
        })
      })
      this.isReady = true
    }
    return this
  }

}