import {
  StackUpItem,
} from './stackUp'

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

  beforeTransition?: (container: HTMLElement, items: StackUpItem[]) => Promise<void>,
  beforeMove?: (items: StackUpItem[]) => Promise<void>,
  afterMove?: () => void,
  afterTransition?: () => void,
}

export const STACKUP_DEFAULT_CONFIG = {
  boundary: window,

  selectorContainer: undefined,
  selectorItems: undefined,

  columnWidth: 320,
  numberOfColumns: 3,
  gutter: 20,

  layout: <StackUpLayoutOption>'ordinal',
  isFluid: true,
  
  debounceResizeWait: 350,
  moveInSequence: false,

  scaleContainer: (container, width, height) => {
    container.style.height = `${height}px`
    container.style.width  = `${width}px`
    return Promise.resolve()
  },
  moveItem: (item, left, top) => {
    item.style.left = `${left}px`
    item.style.top  = `${top}px`
    return Promise.resolve()
  },

  beforeTransition: (container: HTMLElement, items: StackUpItem[]) => { return Promise.resolve() },
  beforeMove: (items: StackUpItem[]) => { return Promise.resolve() },
  afterMove: () => {},
  afterTransition: () => {}
}