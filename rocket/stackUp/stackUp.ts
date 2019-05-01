import {
  DOMHelper,
  Point,
  ScreenModel,
  Util,
} from '../rocket'

import {
  STACKUP_DEFAULT_CONFIG,
  StackUpConfig,
  StackUpContainerScaleData,
} from './stackUpConfig'

import {
  StackUpLayout,
} from './stackUpLayout'

// [index][item, itemHeight, left, top]
export interface StackUpItem {
  item  : HTMLElement,
  height: number,
  left: number,
  top : number,
  currentLeft: number,
  currentTop : number,
  requireMove: boolean,
}

export class StackUp {

  public boundaryHeight = 0
  public boundaryWidth  = 0

  public containerElement = undefined
  public containerWidth   = 0
  public containerHeight  = 0
  
  public previousContainerWidth  = 0
  public previousContainerHeight = 0

  public itemElements = undefined
  public items: StackUpItem[] = []
  public numberOfColumns: number = 0

  public config: StackUpConfig
  public layout: StackUpLayout

  public resizeDebounceTimeout: number

  public isTransitioning: boolean = false
  private doneTransitioning: Function

  constructor(config?: StackUpConfig) {
    this.config = Object.assign({}, STACKUP_DEFAULT_CONFIG)

    if (typeof config === 'object') {
      this.setConfig(config)
    }

    this.layout = new StackUpLayout(this, this.config.layout)
    return this
  }

  public setConfig(config: StackUpConfig): this {
    Object.assign(this.config, config)
    return this
  }

  public initialize(): Promise<void> {
    window.addEventListener('resize', this.eventHandlerResize)
    this.boundaryUpdate()

    // Update grid selectors - reset
    this.getElements()
    this.populateItems()

    // Update grid selectors - stacking
    this.updateNumberOfColumns()
    this.applyLayout()
    return this.draw()
  }

  private boundaryUpdate(): this {
    if (
      this.config.boundary !== window &&
      this.config.boundary !== null
    ) {
      const boundary: HTMLElement = <HTMLElement>this.config.boundary
      const style: CSSStyleDeclaration = window.getComputedStyle(boundary)
      let horizontal: number = 0
      let vertical  : number = 0
      if (style.boxSizing === 'border-box') {
        const horizontalBorderWidths = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth)
        const horizontalPaddings     = parseFloat(style.paddingLeft)     + parseFloat(style.paddingRight)
        const verticalBorderWidths   = parseFloat(style.borderTopWidth)  + parseFloat(style.borderBottomWidth)
        const verticalPaddings       = parseFloat(style.paddingTop)      + parseFloat(style.paddingBottom)
        horizontal = horizontalBorderWidths + horizontalPaddings
        vertical   = verticalBorderWidths   + verticalPaddings
      }
      this.boundaryWidth  = boundary.offsetWidth  - horizontal
      this.boundaryHeight = boundary.offsetHeight - vertical
    } else {
      this.boundaryWidth  = ScreenModel.width
      this.boundaryHeight = ScreenModel.height
    }
    return this
  }

  private resizeDebounce = (fn: Function, delay: number): void => {
    clearTimeout(this.resizeDebounceTimeout)
    this.resizeDebounceTimeout = window.setTimeout(fn, delay)
  }

  private eventHandlerResizeComplete = (): void => {
    if (
      this.calculateNumberOfColumns() !== this.numberOfColumns &&
      this.config.isFluid === true
    ) {
      this.restack()
    }
  }

  private eventHandlerResize = (event: Event): void => {
    this.boundaryUpdate()
    this.resizeDebounce(
      this.eventHandlerResizeComplete,
      this.config.debounceResizeWait
    )
  }

  // Update grid selectors. (1) - reset
  // Required stack-up.initialize to be called first.

  private getElements(): this {
    const containerElement: HTMLElement = document.querySelector(this.config.selectorContainer)
    const itemElements: NodeListOf<HTMLElement> = document.querySelectorAll(
      `${this.config.selectorContainer} > ${this.config.selectorItems}`
    )
    if (containerElement !== null) {
      this.containerElement = containerElement
      this.updatePreviousContainerSize()
    }
    if (itemElements !== null) {
      this.itemElements = Array.from(itemElements)
    }
    return this
  }

  public updatePreviousContainerSize(): this {
    this.previousContainerWidth  = this.containerElement.offsetWidth
    this.previousContainerHeight = this.containerElement.offsetHeight
    return this
  }

  // This only updates this.items, it does not update the selectors

  private appendItem(item: HTMLElement): this {
    const offset: Point = DOMHelper.getOffsetFrom(item, this.containerElement)
    this.items.push(
      {
        item: item,
        height: item.offsetHeight,
        left: offset.x,
        top : offset.y,
        currentLeft: offset.x,
        currentTop : offset.y,
        requireMove: false,
      }
    )
    return this
  }

  // Populate grid items (2) - reset
  private populateItems(): this {
    // Clear items before populating
    this.items = []

    this.itemElements.forEach(item => {
      this.appendItem(item)
    })
    return this
  }

  private calculateNumberOfColumns(): number {
    let numberOfColumns: number

    if (this.config.isFluid === true) {
      numberOfColumns = Math.floor(
        (this.boundaryWidth      - this.config.gutter) /
        (this.config.columnWidth + this.config.gutter)
      )
    } else {
      numberOfColumns = this.config.numberOfColumns
    }

    if (numberOfColumns > this.items.length) {
      numberOfColumns = this.items.length
    }

    if (
      this.items.length === 0 ||
      numberOfColumns <= 0
    ) {
      numberOfColumns = 1
    }

    return numberOfColumns
  }

  // Update numberOfColumns (3) - stack
  private updateNumberOfColumns(): this {
    this.numberOfColumns = this.calculateNumberOfColumns()
    return this
  }

  // Scale container and move items (5) - stack
  public draw(): Promise<void> {
    if (this.isTransitioning === false) {
      this.isTransitioning = true

      this.containerWidth = (this.config.columnWidth + this.config.gutter) * this.numberOfColumns

      const finalHeight = this.containerHeight + this.config.gutter
      const finalWidth  = this.containerWidth  + this.config.gutter

      const scaleData: StackUpContainerScaleData = this.composeContainerScaleData(finalWidth, finalHeight)
      this.prepareItemsBeforeMove()
      return this.config
        .beforeTransition(scaleData, this.items)
        .then(() => {
          return this.config.scaleContainerInitial(
            this.containerElement, scaleData
          )
        })
        .then(() => {
          return this.config.beforeMove(this.items)
        })
        .then(() => {
          return this.moveItems()
        })
        .then(() => {
          return this.config.afterMove(this.items)
        })
        .then(() => {
          this.updatePreviousContainerSize()
          return this.config.scaleContainerFinal(
            this.containerElement,
            this.composeContainerScaleData(finalWidth, finalHeight)
          )
        })
        .then(()  => { this.endTransition() })
        .catch(() => { this.endTransition() })
    }
    return Promise.resolve()
  }

  private moveItems(): Promise<void> {
    const moveItem: (item: StackUpItem) => Promise<void> = item => {
      return this.config.moveItem(item)
    }
    if (this.config.moveInSequence === true) {
      return Util.promiseEach<StackUpItem>(this.items, moveItem)
    } else {
      const moveItems: Promise<void>[] = []
      this.items.forEach(item => {
        moveItems.push(moveItem(item))
      })
      return Promise
        .all(moveItems)
        .then(() => Promise.resolve())
    }
  }

  private endTransition(): this {
    this.updateItemsCurrentOffset()
    this.isTransitioning = false
    this.config.afterTransition()
    if (typeof this.doneTransitioning === 'function') {
      this.doneTransitioning()
      this.doneTransitioning = undefined
    }
    return this
  }

  private composeContainerScaleData(width: number, height: number): StackUpContainerScaleData  {
    const maxWidth : number = Math.max(this.previousContainerWidth ,  width)
    const maxHeight: number = Math.max(this.previousContainerHeight, height)
    const requireScale: boolean = (
      this.previousContainerWidth  !== width ||
      this.previousContainerHeight !== height
    )
    return {
      width : width,
      height: height,
      currentWidth : this.previousContainerWidth,
      currentHeight: this.previousContainerHeight,
      maxWidth : maxWidth,
      maxHeight: maxHeight,
      requireScale: requireScale,
    }
  }

  private prepareItemsBeforeMove(): this {
    this.items.forEach(item => {
      const requireMove: boolean = (
        item.currentLeft !== item.left ||
        item.currentTop  !== item.top
      )
      item.requireMove = requireMove
    })
    return this
  }

  private updateItemsCurrentOffset(): this {
    this.items.forEach(item => {
      item.currentLeft = item.left
      item.currentTop  = item.top
    })
    return this
  }

  //stack (4)
  //layout updates the containerHeight and updates items

  private applyLayout(): this {
    this.layout.setup()
    if (this.items.length) {
      this.layout.loop()
    }
    return this
  }

  private resetLayout(): this {
    this.containerHeight = 0
    this.layout.columnPointer = 0
    return this
  }

  // This should be called after if any the item(s)
  // have been modified, added, or removed.
  public reset(): Promise<void> {
    return new Promise(resolve => {
      const reset = () => {
        this.containerWidth  = 0
        this.containerHeight = 0
        this.items = []
        this
          .getElements()
          .populateItems()
          .resetLayout()
          .restack()
        resolve()
      }
      if (this.isTransitioning === true) {
        this.doneTransitioning = reset
      } else {
        reset()
      }  
    })
  }

  public append(items: HTMLElement | HTMLElement[]): Promise<void> {
    return new Promise(resolve => {
      const append = () => {
        if (Array.isArray(items)) {
          items.forEach(item => {
            const itemIndex: number = this.items.length
            this.appendItem(item)
            this.layout.plot(itemIndex)  
          })
        } else {
          const itemIndex: number = this.items.length
          this.appendItem(items)
          this.layout.plot(itemIndex)  
        }
        this
          .draw()
          .then(() => resolve())
      }
      if (this.isTransitioning === true) {
        this.doneTransitioning = append
      } else {
        append()
      }  
    })
  }

  public restack(): Promise<void> {
    return new Promise(resolve => {
      const restack = () => {
        this
          .updateNumberOfColumns()
          .resetLayout()
          .applyLayout()
          .draw()
        resolve()
      }
      if (this.isTransitioning === true) {
        this.doneTransitioning = restack
      } else {
        restack()
      }
    })
  }

}