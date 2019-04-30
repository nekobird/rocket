import {
  ScreenModel,
  Util,
} from '../rocket'

import {
  STACKUP_DEFAULT_CONFIG,
  StackUpConfig,
} from './stackUpConfig'

import {
  StackUpLayout,
} from './stackUpLayout'

// [index][item, itemHeight, left, top]
export type StackUpItem = [HTMLElement, number, number, number]

export class StackUp {

  public boundaryHeight = 0
  public boundaryWidth  = 0

  public containerElement = undefined
  public containerHeight  = 0
  public containerWidth   = 0

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

  public initialize(): this {
    window.addEventListener('resize', this.eventHandlerResize)
    this.boundaryUpdate()

    // Update grid selectors - reset
    this.getElements()
    this.populateItems()

    // Update grid selectors - stacking
    this.updateNumberOfColumns()
    this.applyLayout()
    this.draw()
    return this
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
    }
    if (itemElements !== null) {
      this.itemElements = Array.from(itemElements)
    }
    return this
  }

  // This only updates this.items, it does not update the selectors

  private appendItem(item: HTMLElement): this {
    item.style.width = `${this.config.columnWidth}px`
    this.items.push(
      [item, item.offsetHeight, 0, 0]
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
  public draw(): this {
    if (this.isTransitioning === false) {
      this.isTransitioning = true

      this.containerWidth = (this.config.columnWidth + this.config.gutter) * this.numberOfColumns

      const height = this.containerHeight + this.config.gutter
      const width  = this.containerWidth  + this.config.gutter

      this.config
        .beforeTransition(this.containerElement, this.items)
        .then(() => {
          return this.config.scaleContainer(this.containerElement, width, height)
        })
        .then(() => {
          return this.config.beforeMove(this.items)
        })
        .then(() => {
          return this.moveItems()
        })
        .then(() => {
          this.config.afterMove()
          return Promise.resolve()
        })
        .then(() => {
          this.isTransitioning = false
          this.config.afterTransition()
          if (typeof this.doneTransitioning === 'function') {
            this.doneTransitioning()
            this.doneTransitioning = undefined
          }
        })
    }
    return this
  }

  private moveItems(): Promise<void> {
    const moveItem: (item: StackUpItem) => Promise<void> = item => {
      return new Promise(resolve => {
        this.config
          .moveItem(item[0], item[2], item[3])
          .then(() => resolve())
      })
    }
    if (this.config.moveInSequence === true) {
      return Util.PromiseEach<StackUpItem>(this.items, moveItem)
    } else {
      const moveItems: Promise<void>[] = []
      this.items.forEach(item => {
        moveItems.push(
          moveItem(item)
        )
      })
      return Promise
        .all(moveItems)
        .then(() => {
          return Promise.resolve()
        })
    }
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
  public reset(): this {
    const reset = () => {
      this.containerWidth  = 0
      this.containerHeight = 0
      this.items = []
      this
        .getElements()
        .populateItems()
        .resetLayout()
        .restack()
    }
    if (this.isTransitioning === true) {
      this.doneTransitioning = reset
    } else {
      reset()
    }
    return this
  }

  public append(item: HTMLElement): this {
    if (this.calculateNumberOfColumns() === this.numberOfColumns) {
      const draw = () => {
        const itemIndex: number = this.items.length
        this.appendItem(item)
        this.layout.plot(itemIndex)
        this.draw()
      }
      if (this.isTransitioning === true) {
        this.doneTransitioning = draw
      } else {
        draw()
      }
    } else {
      this.restack()
    }
    return this
  }

  public restack(): this {
    const restack = () => {
      this
        .updateNumberOfColumns()
        .resetLayout()
        .applyLayout()
        .draw()
    }
    if (this.isTransitioning === true) {
      this.doneTransitioning = restack
    } else {
      restack()
    }
    return this
  }

}