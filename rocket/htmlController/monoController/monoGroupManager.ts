import {
  ElementEntry,
  MonoController,
} from '../index'

export interface MonoGroups {
  [groupName: string]: MonoGroup,
}

export interface MonoGroup {
  name: string,
  items: HTMLElement[],
  activeItem: HTMLElement,
  activeItemId: string,
  isActive: boolean,
}

export class MonoGroupManager {

  private controller: MonoController
  public groups: MonoGroups = {}

  constructor(controller: MonoController) {
    this.controller = controller
  }

  // Initialize

  public initialize() {
    this
      .initializeMonoGroups()
      .initializeActiveItems()
    return this
  }

  public initializeMonoGroups(): this {
    const items: ElementEntry | false = this.controller.elementManager.getEntry('items')
    if (typeof items === 'object') {
      items.elements.forEach(item => {
        if (this.checkIfValidItem(item) === true) {
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
            name : groupName,
            items: groupItems,
            activeItem  : undefined,
            activeItemId: undefined,
            isActive: false,
          }
        }
      })
    }
    return this
  }

  private initializeActiveItems(): this {
    if (this.groupCount > 0) {
      Object.keys(this.groups).forEach(groupName => {
        const group: MonoGroup = this.groups[groupName]

        group.items.forEach(item => {
          if (item.classList.contains(this.controller.config.classNameItemActive) === true) {
            group.activeItem   = item
            group.activeItemId = item.dataset.id
            group.isActive     = true
          }
        })
      })
      this.controller.isReady = true
    }
    return this
  }

  // Group

  public get groupCount(): number {
    return Object.keys(this.groups).length
  }

  public getMonoGroupProperty(groupName: string): MonoGroup {
    return this.groups[groupName]
  }

  // Item

  public activateItem(item: HTMLElement) {
    if (this.checkIfValidItem(item) === true) {
      let group: MonoGroup = this.groups[item.dataset.group]
      item.classList.add(
        this.controller.config.classNameItemActive
      )
      group.activeItem   = item
      group.activeItemId = item.dataset.id
      group.isActive     = true
    }
  }

  public deactivateItem(groupName: string) {
    if (typeof this.groups[groupName] === 'object') {
      const group: MonoGroup = this.groups[groupName]
      group.activeItem.classList.remove(
        this.controller.config.classNameItemActive
      )
      group.activeItem   = undefined
      group.activeItemId = undefined
      group.isActive     = false
    }
  }

  private checkIfValidItem(item: HTMLElement): boolean {
    let valid: boolean = true
    if (typeof item.dataset.group !== 'string') {
      valid = false
    }
    if (typeof item.dataset.id !== 'string') {
      valid = false
    }
    return valid
  }
}