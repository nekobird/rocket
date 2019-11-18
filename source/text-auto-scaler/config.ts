import {
  TextAutoScaler,
} from './text-auto-scaler';

export interface TextAutoScalerConfig {
  element?: HTMLElement,

  validFontSizes?: number[];

  fontSizeRange?: [number, number];
  fontSizeIncrement?: number;

  setFontSize: (
    element: HTMLElement,
    fontSize: number,
    textAutoScaler: TextAutoScaler,
  ) => void;
}

export const TEXT_AUTO_SCALER_DEFAULT_CONFIG: TextAutoScalerConfig = {
  fontSizeIncrement: 1,

  setFontSize: (element, fontSize) => {
    element.style.fontSize = `${fontSize}px`
  },
};