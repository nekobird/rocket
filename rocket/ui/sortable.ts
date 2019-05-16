import {
  DOMHelper,
  DOMUtil,
  DragEventManager,
  Point,
  PointHelper,
} from '../rocket'

export interface SortableConfig {
  activateOnLongPress?: boolean,
  listenToLongPress?: boolean,
  longPressWait?: number,

  preventDefaults?: boolean,

  containerSelector?: string,
  container?: HTMLElement,

  itemsSelector?: string,
  items?: HTMLElement[],

  createDummyFromItem?: (item: HTMLElement, context: Sortable) => HTMLElement,
  setDummyElementPropertiesFromItem?: (dummyElement: HTMLElement, item: HTMLElement, context: Sortable) => void,

  activateItem?:   (item: HTMLElement, context: Sortable) => void,
  deactivateItem?: (item: HTMLElement, context: Sortable) => void,

  popItem?:   (item: HTMLElement, context: Sortable) => void,
  unpopItem?: (item: HTMLElement, context: Sortable) => void,

  moveItem?: (item: HTMLElement, to: Point, context: Sortable) => void,

  onComplete?: (context: Sortable) => void,

  onDown?: (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => void,
  onDrag?: (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => void,
  onUp?:   (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => void,
  onCancel?:    (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => void,
  onLongPress?: (item: HTMLElement, event, manager: DragEventManager, context: Sortable) => void,
}

const SORTABLE_CONFIG: SortableConfig = {
  activateOnLongPress: false,
  listenToLongPress: true,
  longPressWait: 0.5,

  preventDefaults: true,

  containerSelector: '.sortableContainer',
  container: undefined,

  itemsSelector: '.sortableItem',
  items: undefined,

  createDummyFromItem: item => {
    const dummy = document.createElement('DIV')
    return dummy
  },

  setDummyElementPropertiesFromItem: (dummy, item) => {
    dummy.classList.add('sortableItem', 'sortableItem--dummy')
    DOMHelper.applyStyle(dummy, {
      'width' : `${item.offsetWidth}px`,
      'height': `${item.offsetHeight}px`,
      'boxSizing': 'border-box',
      'position': 'relative',
      'zIndex': 0,
    })
  },
 
  activateItem: item => {
    item.classList.add('sortableItem--active')
  },
  deactivateItem: item => {
    item.classList.remove('sortableItem--active')
  },

  popItem: item => {
    const width : number = item.offsetWidth
    const height: number = item.offsetHeight
    DOMHelper.applyStyle(item, {
      'position': 'absolute',
      'left': 0,
      'top' : 0,
      'width' : `${width}px`,
      'height': `${height}px`,
    })
  },
  unpopItem: item => {
    DOMHelper.clearStyle(item)
  },

  moveItem: (item: HTMLElement, to: Point) => {
    item.style.transform = `translateX(${to.x}px) translateY(${to.y}px)`
  },

  onComplete: () => {},
  onDown: () => {},
  onDrag: () => {},
  onUp: () => {},
  onCancel: () => {},
  onLongPress:() => {},
}

export class Sortable {

  public config: SortableConfig

  public dragEventManager: DragEventManager  

  public isActive: boolean = false
  public hasMoved: boolean = false

  public initialOffset: Point

  public targetItem: HTMLElement
  public activeItem: HTMLElement
  public dummyElement: HTMLElement

  constructor(config?: SortableConfig) {
    this.config = Object.assign({}, SORTABLE_CONFIG)
    if (typeof config === 'object') {
      this.setConfig(config)
    }
  }

  public setConfig(config: SortableConfig) {
    Object.assign(this.config, config)    
  }

  // @initialization
  public getContainer(): this {
    if (
      typeof this.config.container === 'undefined' &&
      typeof this.config.containerSelector === 'string'
    ) {
      const container: HTMLElement = document.querySelector(this.config.containerSelector)
      if (container !== null) {
        this.config.container = container
        return this
      }
      throw new Error('Sortable: Fail to get container.')
    }
    if (typeof this.config.container === 'object') {
      return this
    }
    throw new Error('Sortable: Container defined.')
  }

  public getItems(): this {
    if (
      typeof this.config.items === 'undefined' &&
      typeof this.config.itemsSelector === 'string'
    ) {
      const items: NodeListOf<HTMLElement> = document.querySelectorAll(this.config.itemsSelector)
      if (items !== null) {
        this.config.items = Array.from(items)
      }
      throw new Error('Sortable: Fail to get items.')
    }
    if (Array.isArray(this.config.items) === true) {
      return this
    }
    throw new Error('Sortable: Items not defined.')
  }

  public initializeDragEvent() {
    this.dragEventManager = new DragEventManager({
      enableLongPress: (this.config.activateOnLongPress || this.config.listenToLongPress),
      longPressWait: this.config.longPressWait,

      condition: this.dragCondition,

      onDown: this.handleOnDown,
      onDrag: this.handleOnDrag,
      onUp:   this.handleOnUp,
      onCancel: this.handleOnCancel,
      onLongPress: this.handleOnLongPress,
    })
  }

  public initialize() {
    this.getContainer()
    this.getItems()
    this.initializeDragEvent()
  }

  private getItemFromDownEvent(event): HTMLElement | false {
    if (typeof event.downData === 'object') {
      const item: HTMLElement | HTMLElement[] | false = DOMUtil.findAncestor(
        event.downData.target,
        item => (this.config.items.indexOf(item) !== -1),
        false
      )
      if (item !== false) {
        return <HTMLElement>item
      }
    }
    return false
  }

  // @eventHandler

  private dragCondition = (event, manager) => {
    const item: HTMLElement | false = this.getItemFromDownEvent(event)
    if (item !== false) {
      this.targetItem = item
      return true
    }
    return false
  }

  private handleOnDown = (event, manager) => {
    if (this.config.preventDefaults === true) {
      event.downData.event.preventDefault()
    }

    this.config.onDown(this.targetItem, event, manager, this)

    if (this.config.activateOnLongPress === false) {
      this.activate(this.targetItem, event.downData)
    }
  }

  private handleOnLongPress = (event, manager) => {
    this.config.onLongPress(this.targetItem, event, manager, this)  

    if (
      this.config.activateOnLongPress === true &&
      event.previousEvent !== 'drag'
    ) {
      this.activate(this.targetItem, event.downData)
    }
  }

  private handleOnDrag = (event, manager) => {
    if (this.config.preventDefaults === true) {
      event.downData.event.preventDefault()
    }

    this.config.onDrag(this.targetItem, event, manager, this)
    
    if (
      this.isActive === true &&
      typeof event.dragData === 'object'
    ) {
      this.move(event.dragData)
    }
  }

  private handleOnUp = (event, manager) => {
    if (this.config.preventDefaults === true) {
      event.downData.event.preventDefault()
    }

    this.config.onUp(this.targetItem, event, manager, this)

    if (this.isActive === true) {
      this.deactivate()
    }
  }

  private handleOnCancel = (event, manager) => {
    this.config.onCancel(this.targetItem, event, manager, this)

    if (this.isActive === true) {
      this.deactivate()
    }
  }

  // @helper

  public getLastItem(): HTMLElement | false {
    return DOMUtil.getNthChild('last', this.config.container, item => {
      return (
        this.config.items.indexOf(item) !== -1 &&
        this.activeItem   !== item &&
        this.dummyElement !== item
      )
    })
  }

  public prepareAndInsertDummyElementAt(point: Point) {
    const closestItem: HTMLElement | false = DOMUtil.getClosestChildFromPoint(
      this.config.container,
      point,
      item => {
        return (
          this.config.items.indexOf(item) !== -1 &&
          this.activeItem !== item
        )
      },
      false
    )
    if (closestItem !== false) {
      if (typeof this.dummyElement === 'undefined') {
        this.dummyElement = this.config.createDummyFromItem(this.activeItem, this)
      }
      this.config.setDummyElementPropertiesFromItem(this.dummyElement, this.activeItem, this)
      this.insertDummyElement(closestItem, point)
    } 
  }

  public insertDummyElement(item: HTMLElement, point: Point) {
    const lastItem: HTMLElement | false = this.getLastItem()
    if (
      lastItem !== false &&
      lastItem === item  &&
      DOMHelper.elementIsBelowPoint(lastItem, point, lastItem.offsetHeight / 2) === true
    ) {
      this.config.container.appendChild(this.dummyElement)
    } else {
      this.config.container.insertBefore(this.dummyElement, item)
    }
  }

  private updateInitialOffset(data) {
    this.initialOffset = DOMHelper.getOffsetFromPoint(
      this.activeItem,
      {x: data.clientX, y: data.clientY}
    )
  }
  
  // @actions

  private activate(item: HTMLElement, data) {
    if (this.isActive === false) {
      this.isActive   = true
      this.activeItem = item
      this.config.activateItem(this.activeItem, this)
      this.updateInitialOffset(data)
    }
  }

  private move(data) {
    if (this.isActive === true) {
      if (this.hasMoved === false) {
        this.config.popItem(this.activeItem, this)
        this.hasMoved = true
      }

      const point: Point = {x: data.clientX, y: data.clientY}
      const offset = DOMHelper.getOffsetFromPoint(this.config.container, point)
      const to: Point = PointHelper.subtract(offset, this.initialOffset)

      this.config.moveItem(this.activeItem, to, this)

      this.prepareAndInsertDummyElementAt(point)
    }
  }

  private deactivate() {
    if (this.isActive === true) {
      this.config.deactivateItem(this.activeItem, this)
      this.config.unpopItem(this.activeItem, this)
      if (typeof this.dummyElement !== 'undefined') {
        this.config.container.replaceChild(this.activeItem, this.dummyElement)
      }

      // Reset
      this.isActive = false
      this.hasMoved = false

      this.activeItem    = undefined
      this.dummyElement  = undefined
      this.initialOffset = undefined

      this.config.onComplete(this)
    }
  }
}