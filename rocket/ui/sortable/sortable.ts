import {
  DOMHelper,
  DOMUtil,
  DragEventManager,
  Point,
  PointHelper,
} from '../../rocket'

import {
  SORTABLE_CONFIG,
  SortableConfig,
} from './config'

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
      typeof this.config.container === 'undefined'
      && typeof this.config.containerSelector === 'string'
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
      typeof this.config.items === 'undefined'
      && typeof this.config.itemsSelector === 'string'
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

  public preventDefault = event => {
    event.preventDefault()
  }

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
      this.config.activateOnLongPress === true
      && event.previousEvent !== 'drag'
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
      this.isActive === true
      && typeof event.dragData === 'object'
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
        this.config.items.indexOf(item) !== -1
        && this.activeItem   !== item
        && this.dummyElement !== item
      )
    })
  }

  public prepareAndInsertDummyElementAt(point: Point) {
    const closestItem: HTMLElement | false = DOMUtil.getClosestChildFromPoint(
      this.config.container,
      point,
      item => {
        return (
          this.config.items.indexOf(item) !== -1
          && this.activeItem !== item
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
      lastItem !== false
      && lastItem === item
      && DOMHelper.elementIsBelowPoint(lastItem, point, lastItem.offsetHeight / 2) === true
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
      if (this.config.disableTouchEventsWhileActive === true) {
        window.addEventListener('touchstart', this.preventDefault, {passive: false})
        window.addEventListener('touchmove',  this.preventDefault, {passive: false})
      }

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

      if (this.config.disableTouchEventsWhileActive === true) {
        window.removeEventListener('touchstart', this.preventDefault)
        window.removeEventListener('touchmove',  this.preventDefault)
      }
    }
  }
}