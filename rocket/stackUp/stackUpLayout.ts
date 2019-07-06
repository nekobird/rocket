import {
  StringUtil,
} from '../rocket';

import {
  StackUp,
  StackUpItem,
} from './stackUp';

import {
  StackUpConfig,
} from './stackUpConfig';

export type StackUpLayoutOption = 'ordinal' | 'optimized';

export class StackUpLayout {

  public stackUp: StackUp;
  public layoutOption: StackUpLayoutOption;

  public columnPointer: number = 0;
  public stack;

  constructor(stackUp: StackUp, layoutOption: StackUpLayoutOption) {
    this.stackUp = stackUp;
    this.layoutOption = layoutOption;
    this.stack = [];
  }

  public setup() {
    this.stack = [];
    for (let i = 0; i < this.stackUp.numberOfColumns; i++) {
      if (this.layoutOption === 'ordinal') {
        this.stack[i] = 0;
      } else if (this.layoutOption === 'optimized') { 
        this.stack[i] = [i, 0];
      }
    }
  }

  public loop() {
    for (let i = 0; i < this.stackUp.items.length; i++)
      this.plot(i);
  }

  public plot(itemIndex: number) {
    this[`plot${StringUtil.upperCaseFirstLetter(this.layoutOption)}`](itemIndex);
  }

  private plotOrdinal(itemIndex: number) {
    const config: StackUpConfig = this.stackUp.config;
    this.stackUp.updatePreviousContainerSize();

    const item: StackUpItem = this.stackUp.items[itemIndex];
    item.currentLeft = item.left;
    item.currentTop = item.top;

    item.left = config.gutter + (config.columnWidth + config.gutter) * this.columnPointer;
    item.top = config.gutter + this.stack[this.columnPointer];

    this.stack[this.columnPointer] += item.height + config.gutter;

    if (this.stack[this.columnPointer] > this.stackUp.containerHeight)
      this.stackUp.containerHeight = this.stack[this.columnPointer];

    this.columnPointer++;

    if (this.columnPointer >= this.stackUp.numberOfColumns)
      this.columnPointer = 0;
  }

  private plotOptimized(itemIndex: number) {
    const config: StackUpConfig = this.stackUp.config;
    this.stackUp.updatePreviousContainerSize();

    const item: StackUpItem = this.stackUp.items[itemIndex];
    item.currentLeft = item.left;
    item.currentTop = item.top;

    item.left = config.gutter + (config.columnWidth + config.gutter) * this.stack[0][0];
    item.top = config.gutter + this.stack[0][1];

    this.stack[0][1] += item.height + config.gutter;

    if (this.stack[0][1] > this.stackUp.containerHeight)
      this.stackUp.containerHeight = this.stack[0][1];

    this.stack.sort((a: number[], b: number[]) => a[1] - b[1]);

    this.columnPointer++;

    if (this.columnPointer >= this.stackUp.numberOfColumns)
      this.columnPointer = 0;
  }
}