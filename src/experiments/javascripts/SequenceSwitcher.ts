import {
  DOMUtil
} from '../../../rocket/Rocket'

interface Config {
  itemSelector?: string,
  activeClassName?: string,
  jsPreviousClassName?: string,
  jsNextClassName?: string,
  jsJumpClassName?: string,
  beforeActivate?: Hook,
  beforeDeactivate?: Hook,
  afterActivate?: Hook,
  afterDeactivate?: Hook,
}

interface Data {
  action?: 'previous' | 'next' | 'jump',
  currentItem?: HTMLElement,
  group?: Group,
  groupName: string,
  nextItem?: HTMLElement,
  nextItemIndex?: number,
  targetId?: string,
}

interface Group {
  activeIndex: number,
  activeItem: HTMLElement,
  items: NodeListOf<HTMLElement>,
  isActive: boolean,
}

interface Groups {
  group?: Group,
}

interface Hook {
  (
    data: Data,
    context: SequenceSwitcher,
  ): Promise<any>
}

export class SequenceSwitcher {

  private isReady = false
  private isTransitioning = false

  // Selector
  public itemSelector = '.item'

  // Class names
  public activeClassName = '__active'
  public jsPreviousClassName = 'js_previous'
  public jsNextClassName = 'js_next'
  public jsJumpClassName = 'js_jump'

  // Elements
  private els_item: NodeListOf<HTMLElement>
  private els_js_jump: NodeListOf<HTMLElement>
  private els_js_previous: NodeListOf<HTMLElement>
  private els_js_next: NodeListOf<HTMLElement>

  // Groups
  public groups: Groups = {}

  // Hooks
  public beforeDeactivate: Hook = (data, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }
  public afterDeactivate: Hook = (data, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }
  public beforeActivate: Hook = (data, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }
  public afterActivate: Hook = (data, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }

  constructor(config: Config) {
    this.config = config
    this.initialize()
  }

  set config(config: Config) {
    Object.assign(this, config)
  }

  get groupCount() {
    return Object.keys(this.groups).length
  }

  initialize() {
    this
      .initializeElements()
      .initializeGroupObjects()
      .initializeActiveItems()
      .startListening()
  }

  initializeElements() {
    this.els_item = document.querySelectorAll(this.itemSelector)
    this.els_js_next = document.querySelectorAll(`.${this.jsNextClassName}`)
    this.els_js_previous = document.querySelectorAll(`.${this.jsPreviousClassName}`)
    this.els_js_jump = document.querySelectorAll(`.${this.jsJumpClassName}`)
    return this
  }

  initializeGroupObjects() {
    // Initialize group objects.
    this.els_item.forEach(element => {
      const groupName: string = element.dataset.group
      const items: NodeListOf<HTMLElement> = document.querySelectorAll(
        `${this.itemSelector}[data-group="${groupName}"]`
      )
      // Initialize group object
      this.groups[groupName] = {
        name: groupName,
        items: items,
        isActive: false
      }
    })
    return this
  }

  initializeActiveItems() {
    if (this.groupCount > 0) {
      Object.keys(this.groups).forEach(groupName => {
        const group = this.groups[groupName]
        group.items.forEach((item, index) => {
          if (item.classList.contains(this.activeClassName)) {
            if (typeof group.activeItem === 'undefined') {
              group.activeItem = item
              group.activeIndex = index
              group.isActive = true
            } else {
              item.classList.remove(this.activeClassName)
            }
          }
        })
        if (typeof group.activeItem === 'undefined') {
          group.activeItem = group.items[0]
          group.activeIndex = 0
          group.isActive = true
          group.items[0].classList.add(this.activeClassName)
        }
      })
      this.isReady = true
    }
    return this
  }

  activate(data) {
    // Deactivate current active item.
    this.isTransitioning = true
    this
      .beforeDeactivate(data, this)
      .then(() => {
        this.resetAll(data.groupName)
        data.currentItem.classList.remove(this.activeClassName)
        data.group.activeItem = undefined
        data.group.activeIndex = undefined
        data.group.isActive = false
        return this.afterDeactivate(data, this)
      })
      .then(() => this.beforeActivate(data, this))
      .then(() => {
        data.nextItem.classList.add(this.activeClassName)
        data.group.activeItem = data.nextItem
        data.group.activeIndex = data.nextItemIndex
        data.group.isActive = true
        return this.afterActivate(data, this)
      })
      .then(() => {
        this.isTransitioning = false
      })
      .catch(error => {
        // TODO: reset back to before?
      })
    return this
  }

  previous(data: Data) {
    let index: number
    if (data.group.activeIndex - 1 >= 0) {
      index = data.group.activeIndex - 1
    } else {
      index = data.group.items.length - 1
    }
    data.action = 'previous'
    data.nextItem = data.group.items[index]
    data.nextItemIndex = index
    this.activate(data)
    return this
  }

  next(data: Data) {
    let index: number
    if (data.group.activeIndex + 1 >= data.group.items.length) {
      index = 0
    } else {
      index = data.group.activeIndex + 1
    }
    data.action = 'next'
    data.nextItem = data.group.items[index]
    data.nextItemIndex = index
    this.activate(data)
    return this
  }

  jump(data: Data) {
    data.action = 'jump'
    data.nextItem = document.querySelector(
      `${this.itemSelector}[data-id="${data.targetId}"]`
    )
    data.nextItemIndex = this.groups[data.groupName].items.getIndexOf(data.nextItem)
    this.activate(data)
    return this
  }

  resetAll(groupName: string) {
    const group: Group = this.groups[groupName]
    group.items.forEach(item => {
      group.activeItem.classList.remove('__active')
    })
  }

  private createData(groupName: string): Data {
    return {
      groupName: groupName,
      group: this.groups[groupName],
      currentItem: this.groups[groupName].activeItem
    }
  }

  private _click_next_handler = event => {
    if (
      this.isReady === true &&
      this.isTransitioning === false
    ) {
      const element = DOMUtil.findAncestorWithClass(
        event.target, this.jsNextClassName, false
      )
      if (element) {
        const data: Data = this.createData(element.dataset.group)
        this.next(data)
      }
    }
  }

  private _click_previous_handler = event => {
    if (
      this.isReady === true &&
      this.isTransitioning === false
    ) {
      const element = DOMUtil.findAncestorWithClass(
        event.target, this.jsPreviousClassName, false
      )
      if (element) {
        const data: Data = this.createData(element.dataset.group)
        this.previous(data)
      }
    }
  }

  private _click_jump_handler = event => {
    if (
      this.isReady === true &&
      this.isTransitioning === false
    ) {
      const element = DOMUtil.findAncestorWithClass(
        event.target, this.jsJumpClassName, false
      )
      if (element) {
        const data: Data = this.createData(element.dataset.group)
        data.targetId = element.dataset.target 
        this.jump(data)
      }
    }
  }

  startListening() {
    this.els_js_next.forEach(element => {
      element.addEventListener('click', this._click_next_handler)
    })
    
    this.els_js_previous.forEach(element => {
      element.addEventListener('click', this._click_previous_handler)
    })
    
    this.els_js_jump.forEach(element => {
      element.addEventListener('click', this._click_jump_handler)
    })
    return this
  }

  stopListening() {
    this.els_js_next.forEach(element => {
      element.removeEventListener('click', this._click_next_handler)
    })
    
    this.els_js_previous.forEach(element => {
      element.removeEventListener('click', this._click_previous_handler)
    })
    
    this.els_js_jump.forEach(element => {
      element.removeEventListener('click', this._click_jump_handler)
    })
    return this
  }

}