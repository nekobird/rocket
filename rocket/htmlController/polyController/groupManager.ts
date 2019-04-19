import {
  PolyController,
} from './polyController'

import {
  ElementEntry, ElementManager
} from './elementManager';

export interface Groups {
  [groupName: string]: Group,
}

export interface Group {
  name: string,
  items: HTMLElement[],
  activeItems?: HTMLElement[],
  isActive: boolean,
}

export class GroupManager {

  private controller: PolyController
  public groups: Groups = {}

  constructor(controller: PolyController) {
    this.controller = controller
  }

  public initialize() {
    this
      .initializeGroups()
      .initializeActiveItems()
    return this
  }

  public initializeGroups(): GroupManager {
    const items: ElementEntry | false = this.controller.elementManager.getElementEntry('items')
    if (items) {
      items.elements.forEach(item => {
        const groupName: string = item.dataset.group
        const elementsItems: HTMLElement[] = Array.from(document.querySelectorAll(
          `${this.controller.config.selectorItems}[data-group="${groupName}"]`
        ))
        this.groups[groupName] = {
          activeItems: [],
          isActive: false,
          items: elementsItems,
          name: groupName,
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

  public getGroupProperties(groupName: string): Group {
    return this.groups[groupName]
  }

}