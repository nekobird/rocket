import {
  DOMPoint,
  DOMTransverse,
  Point,
  PointHelper,
} from '../../rocket'

import {
  SORTABLE_CONFIG,
  SortableConfig,
} from './config'

import {
  EventManager,
} from './eventManager';

export class Sortable {

  public config: SortableConfig

  public eventManager: EventManager

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

    this.eventManager = new EventManager(this)
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
      const container: HTMLElement | null = document.querySelector(
        this.config.containerSelector
      )

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
      const items: NodeListOf<HTMLElement> = document.querySelectorAll(
        this.config.itemsSelector
      )

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

  public initialize() {
    this.getContainer()
    this.getItems()
    this.eventManager.initialize()
  }

  public getItemFromDownEvent(event): HTMLElement | false {
    if (typeof event.downData === 'object') {
      const item: HTMLElement | HTMLElement[] | false = DOMTransverse.findAncestor(
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

  public dragCondition = (event, manager) => {
    const item = this.getItemFromDownEvent(event)

    if (item !== false) {
      this.targetItem = item
      return true
    }
    return false
  }

  // @helper

  public getLastItem(): HTMLElement | false {
    return DOMTransverse.getNthChild('last', <HTMLElement>this.config.container, item => {
      return (
        (<HTMLElement[]>this.config.items).indexOf(item) !== -1
        && this.activeItem !== item
        && this.dummyElement !== item
      )
    })
  }

  public prepareAndInsertDummyElementAt(point: Point) {
    const closestItem = DOMPoint.getClosestChildFromPoints(
      <HTMLElement>this.config.container,
      DOMPoint.getElementCornerPoints(<HTMLElement>this.activeItem),
      item => {
        return (
          (<HTMLElement[]>this.config.items).indexOf(item) !== -1
          && this.activeItem !== item
        )
      }
    )

    if (closestItem !== false) {
      if (typeof this.dummyElement === 'undefined') {
        this.dummyElement = this.config.createDummyFromItem(
          <HTMLElement>this.activeItem, this
        )
      }

      this.config.setDummyElementPropertiesFromItem(
        this.dummyElement, <HTMLElement>this.activeItem, this
      )

      this.insertDummyElement(closestItem, point)
    } 
  }

  public insertDummyElement(item: HTMLElement, point: Point) {
    if (typeof this.dummyElement === 'object') {
      const lastItem = this.getLastItem()

      if (
        lastItem !== false
        && lastItem === item
        && DOMPoint.elementIsBelowPoint(lastItem, point, lastItem.offsetHeight / 2) === true
      ) {
        (<HTMLElement>this.config.container).appendChild(this.dummyElement)
      } else {
        (<HTMLElement>this.config.container).insertBefore(this.dummyElement, item)
      }
    }
  }

  public updateInitialOffset({ clientX: x, clientY: y}) {
    if (typeof this.activeItem === 'object') {
      this.initialOffset = DOMPoint.getOffsetFromPoint(
        this.activeItem,
        { x, y }
      )
    }
  }

  // @events

  public disableEventsOnActivate() {
    if (this.config.disableTouchEventsWhileActive === true) {
      window.addEventListener('touchstart', this.preventDefault, { passive: false })
      window.addEventListener('touchmove',  this.preventDefault, { passive: false })
      window.addEventListener('touchend',   this.preventDefault, { passive: false })
    }
  }

  public enableEventsOnDeactivate() {
    if (this.config.disableTouchEventsWhileActive === true) {
      window.removeEventListener('touchstart', this.preventDefault)
      window.removeEventListener('touchmove',  this.preventDefault)
      window.removeEventListener('touchend',   this.preventDefault)
    }
  }

  public disableActiveItemEventsOnActivate() {
    if (
      this.config.disableEventsOnItemWhileActive === true
      && typeof this.activeItem === 'object'
    ) {
      this.activeItem.addEventListener('touchstart', this.preventDefault, { passive: false })
      this.activeItem.addEventListener('touchmove',  this.preventDefault, { passive: false })
      this.activeItem.addEventListener('touchend',   this.preventDefault, { passive: false })
    }
  }

  public enableActiveItemEventsOnDeactivate() {
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

  public activate(item: HTMLElement, { identifier, downData }) {
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

  public move({ clientX: x, clientY: y }) {
    if (
      this.isActive === true
      && typeof this.activeItem === 'object'
    ) {
      if (this.hasMoved === false) {
        this.config.popItem(this.activeItem, this)
        this.hasMoved = true
      }

      const point: Point = { x, y }
      const offset = DOMPoint.getOffsetFromPoint(
        <HTMLElement>this.config.container, point
      )
      const to: Point = PointHelper.subtract(offset, <Point>this.initialOffset)

      this.config.moveItem(this.activeItem, to, this)

      this.prepareAndInsertDummyElementAt(point)
    }
  }

  public deactivate() {
    if (
      this.isActive === true
      && typeof this.activeItem === 'object'
    ) {
      this.config.deactivateItem(this.activeItem, this)
      this.config.unpopItem(this.activeItem, this)

      if (typeof this.dummyElement !== 'undefined') {
        (<HTMLElement>this.config.container).replaceChild(
          this.activeItem, this.dummyElement
        )
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