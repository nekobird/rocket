import {
  StackUpItem,
} from './stackUp';

export type StackUpLayoutOption = 'ordinal' | 'optimized';

export interface StackUpContainerScaleData {
  width: number;
  height: number;
  currentWidth: number;
  currentHeight: number;
  maxWidth: number;
  maxHeight: number;
  requireScale: boolean;
}

export interface StackUpConfig {
  boundary: HTMLElement | Window;

  containerSelector: string;
  itemsSelector: string;

  container?: HTMLElement;
  items?: HTMLElement[];

  columnWidth: number;
  numberOfColumns: number;
  gutter: number;
  
  layout: StackUpLayoutOption;
  isFluid: boolean;
  
  debounceResizeWait: number;
  moveInSequence: boolean;

  scaleContainerInitial: (container: HTMLElement, data: StackUpContainerScaleData) => Promise<void>;
  scaleContainerFinal: (container: HTMLElement, data: StackUpContainerScaleData) => Promise<void>;
  moveItem: (item: StackUpItem) => Promise<void>;
  beforeTransition: (container: StackUpContainerScaleData, items: StackUpItem[]) => Promise<void>;
  beforeMove: (items: StackUpItem[]) => Promise<void>;
  afterMove: (items: StackUpItem[]) => Promise<void>;
  afterTransition: () => void;
}

export const STACKUP_DEFAULT_CONFIG: StackUpConfig = {
  boundary: window,

  containerSelector: '.stackUp__container',
  itemsSelector: '.stackUp__item',

  container: undefined,
  items: undefined,

  columnWidth: 320,
  numberOfColumns: 3,
  gutter: 20,

  layout: 'ordinal',
  isFluid: true,

  debounceResizeWait: 350,
  moveInSequence: false,

  scaleContainerInitial: (container, { width, height }) => {
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    return Promise.resolve();
  },
  scaleContainerFinal: (container, { width, height }) => {
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    return Promise.resolve();
  },

  moveItem: ({ item, left, top }) => {
    item.style.left = `${left}px`;
    item.style.top = `${top}px`;
    return Promise.resolve();
  },

  beforeTransition: (container, items) => Promise.resolve(),
  beforeMove: (items) => Promise.resolve(),

  afterMove: (items) => Promise.resolve(),
  afterTransition: () => {},
};