import {
  DOMHelper,
  DOMUtil,
  DragEventManager,
  Point,
} from '../../rocket/rocket'

export interface SortableConfig {
  activateOnLongPress?: boolean,
  listenToLongPress?: boolean,
  longPressWait?: number,

  preventDefaults?: boolean,

  itemContainerSelector?: string,
  itemContainer?: HTMLElement,

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

  onDown?: (event, manager: DragEventManager, context: Sortable) => void,
  onDrag?: (event, manager: DragEventManager, context: Sortable) => void,
  onUp?:   (event, manager: DragEventManager, context: Sortable) => void,
  onLongPress?: (event, manager: DragEventManager, context: Sortable) => void,
}

const SORTABLE_CONFIG: SortableConfig = {
  activateOnLongPress: false,
  listenToLongPress: true,
  longPressWait: 0.5,

  preventDefaults: true,

  itemContainerSelector: '.sortableContainer',
  itemContainer: undefined,

  itemsSelector: '.sortableItem',
  items: undefined,

  createDummyFromItem: item => {
    const dummyElement = document.createElement('DIV')
    return dummyElement
  },

  setDummyElementPropertiesFromItem: (dummyElement, item) => {
    dummyElement.classList.add('sortableItem', 'sortableItem--dummy')
    dummyElement.style.position = 'relative'
    dummyElement.style.height = `${item.offsetHeight}px`
    dummyElement.style.width  = `${item.offsetWidth}px`
    dummyElement.style.boxSizing = 'border-box'
    dummyElement.style.zIndex = '0'
  },
 
  activateItem: item => {
    item.classList.add('sortableItem--active')
  },
  deactivateItem: item => {
    item.classList.remove('sortableItem--active')
  },

  popItem: item => {
    const width: number  = item.offsetWidth
    const height: number = item.offsetHeight
    item.style.position = 'absolute'
    item.style.left = `0`
    item.style.top  = `0`
    item.style.width  = `${width}px`
    item.style.height = `${height}px`
  },
  unpopItem: item => {
    item.removeAttribute('style')
  },

  moveItem: (item, to) => {
    item.style.transform = `translateX(${to.x}px) translateY(${to.y}px)`
  },

  onComplete: () => {},
  onDown: () => {},
  onDrag: () => {},
  onUp: () => {},
  onLongPress:() => {},
}

export class Sortable {

  public config: SortableConfig

  public dragEventManager: DragEventManager  

  public isActive: boolean = false
  public hasMoved: boolean = false
  public initialOffset: Point
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
  public initializeItemContainer() {
    if (
      typeof this.config.itemContainer === 'undefined' &&
      typeof this.config.itemContainerSelector === 'string'
    ) {
      const itemContainer: HTMLElement = document.querySelector(this.config.itemContainerSelector)
      if (itemContainer !== null) {
        this.config.itemContainer = itemContainer
      } else {
        throw new Error('Sortable: Fail to retrieve itemContainer element.')
      }
    } else {
      throw new Error('Sortable: itemContainer is not defined.')
    }
  }

  public initializeItems() {
    if (
      typeof this.config.items === 'undefined' &&
      typeof this.config.itemsSelector === 'string'
    ) {
      const items: NodeListOf<HTMLElement> = document.querySelectorAll(this.config.itemsSelector)
      if (items !== null) {
        this.config.items = Array.from(items)
      } else {
        throw new Error('Sortable: Fail to retrieve item elements.')
      }
    } else {
      throw new Error('Sortable: items are not defined.')
    }
  }

  public initializeDragEvent() {
    this.dragEventManager = new DragEventManager({
      enableLongPress: (this.config.activateOnLongPress || this.config.listenToLongPress),
      longPressWait: this.config.longPressWait,

      onDown: this.handleOnDown,
      onDrag: this.handleOnDrag,
      onUp  : this.handleOnUp,
      onLongPress: this.handleOnLongPress,
    })
  }

  public initialize() {
    this.initializeItemContainer()
    this.initializeItems()
    this.initializeDragEvent()
  }

  // @eventHandler
  private handleOnDown = (event, manager) => {
    if (this.config.preventDefaults === true) {
      event.downData.event.preventDefault()
    }

    this.config.onDown(event, manager, this)

    if (
      this.config.activateOnLongPress === false &&
      typeof event.downData === 'object'
    ) {
      const item: HTMLElement | HTMLElement[] | false = DOMUtil.findAncestor(
        event.downData.target,
        item => (this.config.items.indexOf(item) !== -1),
        false
      )
      if (item !== false) {
        this.activate(<HTMLElement>item, event.downData)
      }
    }
  }

  private handleOnDrag = (event, manager) => {
    if (this.config.preventDefaults === true) {
      event.downData.event.preventDefault()
    }

    this.config.onDrag(event, manager, this)

    if (
      typeof event.dragData === 'object' &&
      this.isActive === true
    ) {
      this.move(event.dragData)
    }
  }

  private handleOnUp = (event, manager) => {
    if (this.config.preventDefaults === true) {
      event.downData.event.preventDefault()
    }

    this.config.onUp(event, manager, this)

    this.deactivate()
  }

  private handleOnLongPress = (event, manager) => {
    if (
      this.config.activateOnLongPress === true &&
      typeof event.downData === 'object'
    ) {
      const item: HTMLElement | HTMLElement[] | false = DOMUtil.findAncestor(
        event.downData.target,
        item => (this.config.items.indexOf(item) !== -1),
        false
      )
      if (item !== false) {
        this.activate(<HTMLElement>item, event.downData)
      }
    }
    this.config.onLongPress(event, manager, this)
  }

  // @helper
  public getLastItem(): HTMLElement | false {
    return DOMUtil.getNthChild('last', this.config.itemContainer, item => {
      return (
        this.config.items.indexOf(item) !== -1 &&
        this.activeItem   !== item &&
        this.dummyElement !== item
      )
    })
  }

  public prepareAndInsertDummyElementAt(point: Point) {
    const closestItem: HTMLElement | false = DOMUtil.getClosestChildFromPoint(
      this.config.itemContainer,
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
      this.config.itemContainer.appendChild(this.dummyElement)
    } else {
      this.config.itemContainer.insertBefore(this.dummyElement, item)
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
    if (this.hasMoved === false) {
      this.config.popItem(this.activeItem, this)
    }
    this.hasMoved === true

    const point: Point = {x: data.clientX, y: data.clientY}
    const offset = DOMHelper.getOffsetFromPoint(this.config.itemContainer, point)
    const to: Point = {
      x: offset.x - this.initialOffset.x,
      y: offset.y - this.initialOffset.y
    }

    this.config.moveItem(this.activeItem, to, this)

    this.prepareAndInsertDummyElementAt(point)
  }

  private deactivate() {
    if (this.isActive === true) {
      this.config.deactivateItem(this.activeItem, this)
      this.config.unpopItem(this.activeItem, this)
      this.config.itemContainer.replaceChild(this.activeItem, this.dummyElement)

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