import {
  StringUtil,
} from '../rocket'

import {
  StackUp,
} from './stackUp'

import {
  StackUpConfig,
} from './stackUpConfig'

export type StackUpLayoutOption = 'ordinal' | 'optimized'

export class StackUpLayout {

  public stackUp: StackUp

  public columnPointer: number = 0

  public stack

  public layoutOption: StackUpLayoutOption

  constructor(stackUp: StackUp, layoutOption: StackUpLayoutOption) {
    this.stackUp = stackUp
    this.layoutOption = layoutOption
    this.stack = []
  }

  public setup() {
    this.stack = []
    for (let i = 0; i < this.stackUp.numberOfColumns; i++) {
      if (this.layoutOption === 'ordinal') {
        this.stack[i] = 0
      } else if (this.layoutOption === 'optimized') { 
        this.stack[i] = [i, 0]
      }
    }
  }

  public plot(itemIndex: number) {
    this[`plot${StringUtil.upperCaseFirstLetter(this.layoutOption)}`](itemIndex)
  }

  public loop() {
    for (let i = 0; i < this.stackUp.items.length; i++) {
      this.plot(i)
    }
  }

  private plotOrdinal(itemIndex: number) {
    const config: StackUpConfig = this.stackUp.config
    this.stackUp.items[itemIndex][2] = config.gutter + (config.columnWidth + config.gutter) * this.columnPointer
    this.stackUp.items[itemIndex][3] = config.gutter + this.stack[this.columnPointer]

    this.stack[this.columnPointer] += this.stackUp.items[itemIndex][1] + config.gutter

    if (this.stack[this.columnPointer] > this.stackUp.containerHeight) {
      this.stackUp.containerHeight = this.stack[this.columnPointer]
    }

    this.columnPointer++

    if (this.columnPointer >= this.stackUp.numberOfColumns) {
      this.columnPointer = 0
    }
  }

  private plotOptimized(itemIndex: number) {
    const config: StackUpConfig = this.stackUp.config

    this.stackUp.items[itemIndex][2] = config.gutter + (config.columnWidth + config.gutter) * this.stack[0][0]
    this.stackUp.items[itemIndex][3] = config.gutter + this.stack[0][1]

    this.stack[0][1] += this.stackUp.items[itemIndex][1] + config.gutter

    if (this.stack[0][1] > this.stackUp.containerHeight) {
      this.stackUp.containerHeight = this.stack[0][1]
    }

    this.stack.sort((a, b) => {
      return a[1] - b[1]
    })

    this.columnPointer++

    if (this.columnPointer >= this.stackUp.numberOfColumns) {
      this.columnPointer = 0
    }
  }

}