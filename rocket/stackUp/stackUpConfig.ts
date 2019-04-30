import {
  StackUpItem,
} from './stackUp'

export const STACKUP_DEFAULT_CONFIG = {
  boundary: window,

  selectorContainer: undefined,
  selectorItems: undefined,

  columnWidth: 320,
  numberOfColumns: 3,
  gutter: 18,

  layout: <StackUpLayoutOption>'ordinal',
  isFluid: true,
  
  debounceResizeWait: 350,
  moveInSequence: false,

  moveItem: (item, left, top) => {
    item.style.left = `${left}px`
    item.style.top  = `${top}px`
    return Promise.resolve()
  },
  scaleContainer: (container, width, height) => {
    container.style.height = `${height}px`
    container.style.width  = `${width}px`
    return Promise.resolve()
  },
  beforeMove: (items: StackUpItem[]) => { return Promise.resolve() },
  afterMove: () => {}
}

export type StackUpLayoutOption = 'ordinal' | 'optimized'

export interface StackUpConfig {
  boundary?: HTMLElement | Window,

  selectorContainer?: string,
  selectorItems?: string,

  columnWidth?: number,
  numberOfColumns?: number,
  gutter?: number,
  
  layout?: StackUpLayoutOption,
  isFluid?: boolean,
  
  debounceResizeWait?: number,
  moveInSequence?: boolean,

  scaleContainer?: (container: HTMLElement, width: number, height: number) => Promise<void>,
  moveItem?: (item: HTMLElement, left: number, top: number) => Promise<void>,
  beforeMove?: (items: StackUpItem[]) => Promise<void>,
  afterMove?: () => void,
  
}