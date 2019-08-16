import {
  TextAutoScale,
} from './text-auto-scale';

export interface TextAutoScaleConfig {
  element?: HTMLElement,

  fontSizeSet?: number[];

  fontSizeRange?: [number, number];
  increment?: number;

  setFontSize: (
    element: HTMLElement,
    fontSize: number,
    context: TextAutoScale,
  ) => void;
}

export const TEXT_AUTO_SCALE_DEFAULT_CONFIG: TextAutoScaleConfig = {
  increment: 1,

  setFontSize: (element, fontSize) => {
    element.style.fontSize = `${fontSize}px`
  },
};