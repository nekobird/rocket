import {
  DOMOffset,
  DOMStyle,
  Util,
  ViewportModel,
} from '../rocket';

import {
  STACKUP_DEFAULT_CONFIG,
  StackUpConfig,
  StackUpContainerScaleData,
} from './stackUpConfig';

import {
  StackUpLayout,
} from './stackUpLayout';

export interface StackUpItem {
  item: HTMLElement;
  height: number;
  left: number;
  top: number;
  currentLeft: number;
  currentTop: number;
  requireMove: boolean;
}

export class StackUp {

  public boundaryHeight: number = 0;
  public boundaryWidth: number = 0;

  public containerWidth: number = 0;
  public containerHeight: number = 0;
  
  public previousContainerWidth: number = 0;
  public previousContainerHeight: number = 0;

  public items: StackUpItem[] = [];
  public numberOfColumns: number = 0;

  public config: StackUpConfig;
  public layout: StackUpLayout;

  public resizeDebounceTimeout?: number;

  public isTransitioning: boolean = false;

  private doneTransitioning?: Function;

  constructor(config?: Partial<StackUpConfig>) {
    this.config = Object.assign({}, STACKUP_DEFAULT_CONFIG);
    if (typeof config === 'object') {
      this.setConfig(config);
    }
    this.layout = new StackUpLayout(this, this.config.layout);
    return this;
  }

  public setConfig(config: Partial<StackUpConfig>): this {
    Object.assign(this.config, config);
    return this;
  }

  public initialize(): Promise<void> {
    window.addEventListener('resize', this.eventHandlerResize);
    this.boundaryUpdate();

    // Update grid selectors - reset
    this.getElements();
    this.populateItems();

    // Update grid selectors - stacking
    this.updateNumberOfColumns();
    this.applyLayout();
    return this.draw();
  }

  private getElements(): this {
    this.getContainer();
    this.getItems();
    return this;
  }

  private getContainer(): this {
    if (
      typeof this.config.container === 'undefined'
      && typeof this.config.containerSelector === 'string'
    ) {
      const container = document.querySelector(this.config.containerSelector);
      if (container !== null) {
        this.config.container = <HTMLElement>container;
        return this;
      }
      throw new Error('StackUp: Fail to get container.');
    }
    if (typeof this.config.container === 'object') {
      return this;
    }
    throw new Error('StackUp: Container not defined.');
  }

  private getItems(): this {
    if (
      typeof this.config.items === 'undefined'
      && typeof this.config.itemsSelector === 'string'
    ) {
      const items: NodeListOf<HTMLElement> = document.querySelectorAll(this.config.itemsSelector);
      if (items !== null) {
        this.config.items = Array.from(items);
        return this;
      }
      throw new Error('StackUp: Fail to get items.');
    }
    if (typeof this.config.items === 'object') {
      return this;
    }
    throw new Error('StackUp: items not defined.');
  }

  private boundaryUpdate(): this {
    if (
      this.config.boundary !== window
      && typeof this.config.boundary === 'object'
      && this.config.boundary !== null
    ) {
      const boundary = <HTMLElement>this.config.boundary;
      let horizontal = 0;
      let vertical = 0;
      if (DOMStyle.getStyleValue(boundary, 'boxSizing') === 'border-box') {
        const horizontalBorderWidths = DOMStyle.getHorizontalBorderWidths(boundary);
        const horizontalPaddings = DOMStyle.getHorizontalPaddings(boundary);
        const verticalBorderWidths = DOMStyle.getVerticalBorderWidths(boundary);
        const verticalPaddings = DOMStyle.getVerticalPaddings(boundary);
        horizontal = horizontalBorderWidths + horizontalPaddings;
        vertical = verticalBorderWidths + verticalPaddings;
      }
      this.boundaryWidth = boundary.offsetWidth - horizontal;
      this.boundaryHeight = boundary.offsetHeight - vertical;
    } else {
      this.boundaryWidth = ViewportModel.width;
      this.boundaryHeight = ViewportModel.height;
    }
    return this;
  }

  private resizeDebounce = (fn: Function, delay: number): void => {
    clearTimeout(this.resizeDebounceTimeout);
    this.resizeDebounceTimeout = window.setTimeout(fn, delay);
  }

  private eventHandlerResizeComplete = (): void => {
    if (
      this.calculateNumberOfColumns() !== this.numberOfColumns
      && this.config.isFluid === true
    ) {
      this.restack();
    }
  }

  private eventHandlerResize = (event: Event): void => {
    this.boundaryUpdate();
    this.resizeDebounce(
      this.eventHandlerResizeComplete,
      this.config.debounceResizeWait
    );
  }

  // Update grid selectors. (1) - reset
  // Required stack-up.initialize to be called first.

  public updatePreviousContainerSize(): this {
    if (typeof this.config.container === 'object') {
      this.previousContainerWidth = this.config.container.offsetWidth;
      this.previousContainerHeight = this.config.container.offsetHeight;
    }
    return this;
  }

  // This only updates this.items, it does not update the selectors

  private appendItem(item: HTMLElement): this {
    if (typeof this.config.container === 'object') {
      const { x: left, y: top } = DOMOffset.getElementOffsetFrom(item, this.config.container);
      this.items.push(
        {
          item,
          height: item.offsetHeight,
          left, top,
          currentLeft: left,
          currentTop : top,
          requireMove: false,
        }
      );
    }
    return this;
  }

  // Populate grid items (2) - reset
  private populateItems(): this {
    // Clear items before populating
    this.items = [];

    if (typeof this.config.items !== 'undefined') {
      this.config.items.forEach(item => {
        this.appendItem(item)
      });
    }
    return this;
  }

  private calculateNumberOfColumns(): number {
    let numberOfColumns: number;

    if (this.config.isFluid === true) {
      numberOfColumns = Math.floor(
        (this.boundaryWidth - this.config.gutter) /
        (this.config.columnWidth + this.config.gutter)
      );
    } else {
      numberOfColumns = this.config.numberOfColumns;
    }

    if (numberOfColumns > this.items.length) {
      numberOfColumns = this.items.length;
    }

    if (
      this.items.length === 0
      || numberOfColumns <= 0
    ) {
      numberOfColumns = 1;
    }

    return numberOfColumns;
  }

  // Update numberOfColumns (3) - stack
  private updateNumberOfColumns(): this {
    this.numberOfColumns = this.calculateNumberOfColumns();
    return this;
  }

  // Scale container and move items (5) - stack
  public async draw(): Promise<void> {
    if (
      this.isTransitioning === false
      && typeof this.config.container === 'object'
    ) {
      this.isTransitioning = true;

      this.containerWidth = (this.config.columnWidth + this.config.gutter) * this.numberOfColumns;

      const finalHeight = this.containerHeight + this.config.gutter;
      const finalWidth = this.containerWidth + this.config.gutter;

      const scaleData: StackUpContainerScaleData = this.composeContainerScaleData(finalWidth, finalHeight);
      this.prepareItemsBeforeMove();
      try {
        await this.config.beforeTransition(scaleData, this.items);
        await this.config.scaleContainerInitial(this.config.container, scaleData);
        await this.config.beforeMove(this.items);
        await this.moveItems();
        await this.config.afterMove(this.items);
        this.updatePreviousContainerSize();
        await this.config.scaleContainerFinal(
          this.config.container,
          this.composeContainerScaleData(finalWidth, finalHeight)
        );
        this.endTransition();
        return Promise.resolve();
      } catch {
        this.endTransition();
        return Promise.reject();
      }
    }
    return Promise.resolve();
  }

  private moveItems(): Promise<void> {
    const moveItem: (item: StackUpItem) => Promise<void> = item => {
      return this.config.moveItem(item);
    }
    if (this.config.moveInSequence === true) {
      return Util.promiseEach<StackUpItem>(this.items, moveItem);
    } else {
      const moveItems: Promise<void>[] = [];
      this.items.forEach(item => {
        moveItems.push(moveItem(item));
      });
      return Promise
        .all(moveItems)
        .then(() => Promise.resolve());
    }
  }

  private endTransition(): this {
    this.updateItemsCurrentOffset();
    this.isTransitioning = false;
    this.config.afterTransition();
    if (typeof this.doneTransitioning === 'function') {
      this.doneTransitioning();
      this.doneTransitioning = undefined;
    }
    return this;
  }

  private composeContainerScaleData(width: number, height: number): StackUpContainerScaleData  {
    const maxWidth = Math.max(this.previousContainerWidth,  width);
    const maxHeight = Math.max(this.previousContainerHeight, height);
    const requireScale = (
      this.previousContainerWidth !== width
      || this.previousContainerHeight !== height
    );
    return {
      width, height,
      currentWidth : this.previousContainerWidth,
      currentHeight: this.previousContainerHeight,
      maxWidth, maxHeight,
      requireScale,
    };
  }

  private prepareItemsBeforeMove(): this {
    this.items.forEach(item => {
      const requireMove: boolean = (
        item.currentLeft !== item.left
        || item.currentTop  !== item.top
      );
      item.requireMove = requireMove;
    });
    return this;
  }

  private updateItemsCurrentOffset(): this {
    this.items.forEach(item => {
      item.currentLeft = item.left;
      item.currentTop = item.top;
    });
    return this;
  }

  //stack (4)
  //layout updates the containerHeight and updates items

  private applyLayout(): this {
    this.layout.setup();
    if (this.items.length) {
      this.layout.loop();
    }
    return this;
  }

  private resetLayout(): this {
    this.containerHeight = 0;
    this.layout.columnPointer = 0;
    return this;
  }

  // This should be called after if any the item(s)
  // have been modified, added, or removed.
  public reset(): Promise<void> {
    return new Promise(resolve => {
      const reset = () => {
        this.containerWidth = 0;
        this.containerHeight = 0;
        this.items = [];
        this
          .getElements()
          .populateItems()
          .resetLayout()
          .restack()
        resolve();
      };
      if (this.isTransitioning === true) {
        this.doneTransitioning = reset;
      } else {
        reset();
      }
    });
  }

  public append(items: HTMLElement | HTMLElement[]): Promise<void> {
    return new Promise(resolve => {
      const append = () => {
        if (Array.isArray(items)) {
          items.forEach(item => {
            const itemIndex: number = this.items.length;
            this.appendItem(item);
            this.layout.plot(itemIndex);
          });
        } else {
          const itemIndex: number = this.items.length;
          this.appendItem(items);
          this.layout.plot(itemIndex);
        }
        this
          .draw()
          .then(() => resolve());
      };
      if (this.isTransitioning === true) {
        this.doneTransitioning = append;
      } else {
        append();
      }
    });
  }

  public restack(): Promise<void> {
    return new Promise(resolve => {
      const restack = () => {
        this
          .updateNumberOfColumns()
          .resetLayout()
          .applyLayout()
          .draw();
        resolve();
      };
      if (this.isTransitioning === true) {
        this.doneTransitioning = restack;
      } else {
        restack();
      }
    });
  }
}
