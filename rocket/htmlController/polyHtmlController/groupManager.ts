export class polyHtmlControllerGroups {

  // GROUPS
  private groups: Groups = {}

  private controller

  constructor(controller) {

  }

  get groupCount(): number {
    return Object.keys(this.groups).length
  }
  private initialize() {
    // Initialize Groups
    const items = this.controller.elements.get('items')
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

  private initializeActiveItems(): PolyHTMLController {
    if (this.groupCount > 0) {

      Object.keys(this.groups).forEach(groupName => {
        const group: Group = this.groups[groupName]

        Array.from(group.items).forEach((item, index) => {
          if (item.classList.contains(this.className_active)) {
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