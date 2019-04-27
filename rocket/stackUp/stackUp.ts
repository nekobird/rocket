import {
  StringUtil,
  ScreenModel,
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
  public boundaryWidth = 0

  public containerElement = undefined
  public containerHeight = 0
  public containerWidth = 0

  public itemElements = undefined
  public items: StackUpItem[] = []
  public numberOfColumns: number = 0

  public config: StackUpConfig
  public layout: StackUpLayout

  constructor(config?: StackUpConfig) {
    this.config = Object.assign({}, STACKUP_DEFAULT_CONFIG)

    if (typeof config === 'object') {
      this.setConfig(config)
    }

    this.layout = new StackUpLayout(this, this.config.layout)
    this.initialize()
    return this
  }

  public setConfig(config: StackUpConfig): this {
    Object.assign(this.config, config)
    return this
  }

  public initialize() {
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

  public boundaryUpdate() {
    if (this.config.boundary !== window) {
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
      this.boundaryHeight = boundary.offsetHeight - horizontal
      this.boundaryWidth  = boundary.offsetWidth  - vertical
    } else {
      this.boundaryHeight = ScreenModel.height
      this.boundaryWidth  = ScreenModel.width
    }
    return this
  }

  public resizeDebounceTimeout

  public resizeDebounce = (fn, delay) => {
    clearTimeout(this.resizeDebounceTimeout)
    this.resizeDebounceTimeout = window.setTimeout(fn, delay)
    return this
  }

  public eventHandlerResizeComplete = () => {
    if (
      this.calculateNumberOfColumns() !== this.numberOfColumns &&
      this.config.isFluid === true
    ) {
      this.restack()
    }
    return this
  }

  public eventHandlerResize = event => {
    this.boundaryUpdate()
    this.resizeDebounce(
      this.eventHandlerResizeComplete, this.config.debounceResizeWait
    )
    return this
  }

  // Update grid selectors. (1) - reset
  // Required stack-up.initialize to be called first.

  private getElements() {
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

  public appendItem(item: HTMLElement) {
    item.style.width = `${this.config.columnWidth}px`
    this.items.push(
      [item, item.offsetHeight, 0, 0]
    )
    return this
  }

  // Populate grid items (2) - reset
  public populateItems() {
    // Clear items before populating
    this.items = []

    this.itemElements.forEach(item => {
      this.appendItem(item)
    })
    return this
  }

  public calculateNumberOfColumns() {
    let numberOfColumns: number

    if (this.config.isFluid === true) {
      numberOfColumns = Math.floor(
        (this.boundaryWidth      - this.config.gutter) /
        (this.config.columnWidth + this.config.gutter)
      )
    } else {
      numberOfColumns = this.config.numberOfColumns

      if (numberOfColumns > this.items.length) {
        numberOfColumns = this.items.length
      }

      if (
        this.items.length &&
        numberOfColumns <= 0
      ) {
        numberOfColumns = 1
      }
    }

    return numberOfColumns
  }

  // Update numberOfColumns (3) - stack
  public updateNumberOfColumns() {
    this.numberOfColumns = this.calculateNumberOfColumns()
    return this
  }

  // Scale container and move items (5) - stack
  public draw() {
    this.containerWidth = (this.config.columnWidth + this.config.gutter) * this.numberOfColumns

    const height = this.containerHeight + this.config.gutter
    const width  = this.containerWidth  + this.config.gutter

    this.config.scaleContainer(this.containerElement, width, height)
      .then(() => {
        this.items.forEach(item => {
          this.config.moveItem(item[0], item[2], item[3])
        })
      })
    return this
  }

  //stack (4)
  //layout updates the containerHeight and updates items

  private applyLayout() {
    this.layout.setup()
    if (this.items.length) {
      this.layout.loop()
    }
    return this
  }

  public resetLayout() {
    this.containerHeight = 0
    this.layout.columnPointer = 0
    return this
  }

  // This should be called when any of the item(s) are being modified, added, or removed
  public reset() {
    this.containerWidth  = 0
    this.containerHeight = 0
    this.items = []
    this
      .getElements()
      .populateItems()
      .resetLayout()
      .restack()
    return this
  }

  public append(item: HTMLElement) {
    const itemIndex: number = this.items.length
    this.appendItem(item)
    if (this.calculateNumberOfColumns() === this.numberOfColumns) {
      this.layout.plot(itemIndex)
      this.draw()
    } else {
      this.restack()
    }
    return this
  }

  public restack() {
    this
      .updateNumberOfColumns()
      .resetLayout()
      .applyLayout()
      .draw()
    return this
  }

}