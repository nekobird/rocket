import {
  StackUpItem,
} from './stackUp'

export type StackUpLayoutOption = 'ordinal' | 'optimized'

export interface StackUpContainerScaleData {
  width: number,
  height: number,
  currentWidth: number,
  currentHeight: number,
  maxWidth: number,
  maxHeight: number,
  requireScale: boolean,
}

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

  scaleContainerInitial?: (container: HTMLElement, data: StackUpContainerScaleData) => Promise<void>,
  scaleContainerFinal?: (container: HTMLElement, data: StackUpContainerScaleData) => Promise<void>,
  moveItem?: (item: StackUpItem) => Promise<void>,

  beforeTransition?: (container: StackUpContainerScaleData, items: StackUpItem[]) => Promise<void>,
  beforeMove?: (items: StackUpItem[]) => Promise<void>,

  afterMove?: (items: StackUpItem[]) => Promise<void>,
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

  scaleContainerInitial: (container, data) => {
    container.style.width  = `${data.width }px`
    container.style.height = `${data.height}px`
    return Promise.resolve()
  },
  scaleContainerFinal: (container, data) => {
    container.style.width  = `${data.width }px`
    container.style.height = `${data.height}px`
    return Promise.resolve()
  },

  moveItem: (data) => {
    data.item.style.left = `${data.left}px`
    data.item.style.top  = `${data.top }px`
    return Promise.resolve()
  },

  beforeTransition: (container: StackUpContainerScaleData, items: StackUpItem[]) => Promise.resolve(),
  beforeMove: (items: StackUpItem[]) => Promise.resolve(),

  afterMove: (items: StackUpItem[]) => Promise.resolve(),
  afterTransition: () => {}
}