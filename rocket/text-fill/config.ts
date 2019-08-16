import {
  TextFill,
} from './text-fill';

export interface TextFillConfig {
  element?: HTMLElement,

  validFontSizes?: number[];

  fontSizeRange?: [number, number];
  fontSizeIncrement?: number;

  setFontSize: (
    element: HTMLElement,
    fontSize: number,
    textFill: TextFill,
  ) => void;
}

export const TEXT_FILL_DEFAULT_CONFIG: TextFillConfig = {
  fontSizeIncrement: 1,

  setFontSize: (element, fontSize) => {
    element.style.fontSize = `${fontSize}px`
  },
};