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

  public dragEventManager?: DragEventManager

  public isActive: boolean = false
  public hasMoved: boolean = false

  public activeIdentifier?: string

  public initialOffset?: Point

  public targetItem?: HTMLElement
  public activeItem?: HTMLElement
  public dummyElement?: HTMLElement

  constructor(config?: Partial<SortableConfig>) {
    this.config = Object.assign({}, SORTABLE_CONFIG)
    if (typeof config === 'object') {
      this.setConfig(config)
    }
  }  

  public setConfig(config: Partial<SortableConfig>) {
    Object.assign(this.config, config)    
  }

  // @initialization

  public getContainer(): this {
    if (
      typeof this.config.container === 'undefined'
      && typeof this.config.containerSelector === 'string'
    ) {
      const container: HTMLElement | null = document.querySelector(this.config.containerSelector)
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
      onUp: this.handleOnUp,
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
        item => ((<HTMLElement[]>this.config.items).indexOf(item) !== -1),
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
    this.config.onDown(<HTMLElement>this.targetItem, event, manager, this)

    if (this.config.activateOnLongPress === false) {
      this.activate(<HTMLElement>this.targetItem, event)
    }
  }

  private handleOnLongPress = (event, manager) => {
    this.config.onLongPress(<HTMLElement>this.targetItem, event, manager, this)  

    if (
      this.config.activateOnLongPress === true
      && event.previousEvent !== 'drag'
    ) {
      this.activate(<HTMLElement>this.targetItem, event)
    }
  }

  private handleOnDrag = (event, manager) => {
    this.config.onDrag(<HTMLElement>this.targetItem, event, manager, this)
    
    if (
      this.isActive === true
      && this.activeIdentifier === event.identifier.toString()
      && typeof event.dragData === 'object'
    ) {
      this.move(event.dragData)
    }
  }

  private handleOnUp = (event, manager) => {
    this.config.onUp(<HTMLElement>this.targetItem, event, manager, this)

    if (
      this.isActive === true
      && this.activeIdentifier === event.identifier.toString()
    ) {
      this.deactivate()
    }
  }

  private handleOnCancel = (event, manager) => {
    this.config.onCancel(<HTMLElement>this.targetItem, event, manager, this)

    if (
      this.isActive === true
      && this.activeIdentifier === event.identifier.toString()
    ) {
      this.deactivate()
    }
  }

  // @helper

  public getLastItem(): HTMLElement | false {
    return DOMUtil.getNthChild('last', <HTMLElement>this.config.container, item => {
      return (
        (<HTMLElement[]>this.config.items).indexOf(item) !== -1
        && this.activeItem !== item
        && this.dummyElement !== item
      )
    })
  }

  public prepareAndInsertDummyElementAt(point: Point) {
    const closestItem: HTMLElement | false = DOMUtil.getClosestChildFromPoint(
      <HTMLElement>this.config.container,
      point,
      item => {
        return (
          (<HTMLElement[]>this.config.items).indexOf(item) !== -1
          && this.activeItem !== item
        )
      },
      false
    )
    if (closestItem !== false) {
      if (typeof this.dummyElement === 'undefined') {
        this.dummyElement = this.config.createDummyFromItem(<HTMLElement>this.activeItem, this)
      }
      this.config.setDummyElementPropertiesFromItem(this.dummyElement, <HTMLElement>this.activeItem, this)
      this.insertDummyElement(closestItem, point)
    } 
  }

  public insertDummyElement(item: HTMLElement, point: Point) {
    if (typeof this.dummyElement === 'object') {
      const lastItem: HTMLElement | false = this.getLastItem()

      if (
        lastItem !== false
        && lastItem === item
        && DOMHelper.elementIsBelowPoint(lastItem, point, lastItem.offsetHeight / 2) === true
      ) {
        (<HTMLElement>this.config.container).appendChild(this.dummyElement)
      } else {
        (<HTMLElement>this.config.container).insertBefore(this.dummyElement, item)
      }
    }
  }

  private updateInitialOffset({ clientX: x, clientY: y}) {
    if (typeof this.activeItem === 'object') {
      this.initialOffset = DOMHelper.getOffsetFromPoint(
        this.activeItem,
        { x, y }
      )
    }
  }

  // @events

  private disableEventsOnActivate() {
    if (this.config.disableTouchEventsWhileActive === true) {
      window.addEventListener('touchstart', this.preventDefault, { passive: false })
      window.addEventListener('touchmove',  this.preventDefault, { passive: false })
      window.addEventListener('touchend',   this.preventDefault, { passive: false })
    }
  }

  private enableEventsOnDeactivate() {
    if (this.config.disableTouchEventsWhileActive === true) {
      window.removeEventListener('touchstart', this.preventDefault)
      window.removeEventListener('touchmove',  this.preventDefault)
      window.removeEventListener('touchend',   this.preventDefault)
    }
  }

  private disableActiveItemEventsOnActivate() {
    if (
      this.config.disableEventsOnItemWhileActive === true
      && typeof this.activeItem === 'object'
    ) {
      this.activeItem.addEventListener('touchstart', this.preventDefault, { passive: false })
      this.activeItem.addEventListener('touchmove',  this.preventDefault, { passive: false })
      this.activeItem.addEventListener('touchend',   this.preventDefault, { passive: false })
    }
  }

  private enableActiveItemEventsOnDeactivate() {
    if (
      this.config.disableEventsOnItemWhileActive === true
      && typeof this.activeItem === 'object'
    ) {
      this.activeItem.removeEventListener('touchstart', this.preventDefault)
      this.activeItem.removeEventListener('touchmove',  this.preventDefault)
      this.activeItem.removeEventListener('touchend',   this.preventDefault)
    }
  }

  // @actions

  private activate(item: HTMLElement, { identifier, downData }) {
    if (this.isActive === false) {
      this.disableEventsOnActivate()

      this.isActive = true
      this.activeItem = item
      this.activeIdentifier = identifier.toString()

      this.disableActiveItemEventsOnActivate()

      this.config.activateItem(this.activeItem, this)
      this.updateInitialOffset(downData)
    }
  }

  private move({ clientX: x, clientY: y }) {
    if (
      this.isActive === true
      && typeof this.activeItem === 'object'
    ) {
      if (this.hasMoved === false) {
        this.config.popItem(this.activeItem, this)
        this.hasMoved = true
      }

      const point: Point = { x, y }
      const offset = DOMHelper.getOffsetFromPoint(<HTMLElement>this.config.container, point)
      const to: Point = PointHelper.subtract(offset, <Point>this.initialOffset)

      this.config.moveItem(this.activeItem, to, this)

      this.prepareAndInsertDummyElementAt(point)
    }
  }

  private deactivate() {
    if (
      this.isActive === true
      && typeof this.activeItem === 'object'
    ) {
      this.config.deactivateItem(this.activeItem, this)
      this.config.unpopItem(this.activeItem, this)
      if (typeof this.dummyElement !== 'undefined') {
        (<HTMLElement>this.config.container).replaceChild(this.activeItem, this.dummyElement)
      }
      this.enableActiveItemEventsOnDeactivate()

      // Reset
      this.isActive = false
      this.hasMoved = false

      this.activeItem = undefined
      this.dummyElement = undefined
      this.initialOffset = undefined
      this.activeIdentifier = undefined

      this.config.onComplete(this)

      this.enableEventsOnDeactivate()
    }
  }
}