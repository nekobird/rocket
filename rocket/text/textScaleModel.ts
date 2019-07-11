import {
  DOMText,
  DOMUtil,
  TextBoxModel,
} from '../rocket';

export interface TextScaleModelConfig {
  fontSizeSet?: number[];
  fontSizeRange?: [number, number];
  increment?: number;
  setFontSize: (element: HTMLElement, fontSize: number, context: TextScaleModel) => void;
}

const TEXTSCALEMODEL_DEFAULT_CONFIG: TextScaleModelConfig = {
  setFontSize: (element, fontSize) => element.style.fontSize = `${fontSize}px`,
};

export class TextScaleModel {
  config: TextScaleModelConfig;
  element: HTMLElement;

  model: TextBoxModel;
  originalWidth: number = 0;

  constructor(element: HTMLElement, config: Partial<TextScaleModelConfig>) {
    this.model = new TextBoxModel();
    this.element = element;
    this.config = Object.assign({}, TEXTSCALEMODEL_DEFAULT_CONFIG);
    if (typeof config === 'object') this.setConfig(config);
  }

  public setConfig(config: Partial<TextScaleModelConfig>) {
    if (typeof config === 'object') Object.assign(this.config, config);
  }

  public configRangeIsValid(): boolean {
    if (
      typeof this.config.fontSizeRange === 'object'
      && Array.isArray(this.config.fontSizeRange) === true
      && this.config.fontSizeRange.length === 2
      && this.config.fontSizeRange[0] < this.config.fontSizeRange[1]
      && typeof this.config.increment === 'number'
      && this.config.increment > 0
    ) return true;
    return false;
  }

  public configSetIsvalid(): boolean {
    if (
      typeof this.config.fontSizeSet === 'object'
      && Array.isArray(this.config.fontSizeSet) === true
      && this.config.fontSizeSet.length > 0
    ) return true;
    return false;
  }
    
  public getTextBoxWidth(): number {
    return DOMText.getElementTextBoxWidth(this.element);
  }

  public getModelWidth(text: string, fontSize: number): number {
    return this.model.getTextBoxWidthFromElement(
      this.element, text, { fontSize: `${fontSize}px` }
    );
  }

  public optimize(): number | false {
    if (typeof this.config.fontSizeSet !== 'undefined')
      return this.optimizeFromSet();
    return this.optimizeFromRange();
  }

  public optimizeFromSet(): number | false {
    if (
      this.configSetIsvalid() === true
      && typeof this.config.fontSizeSet !== 'undefined'
    ) {
      this.config.fontSizeSet.sort((a, b) => a - b);

      const text = DOMText.getTextFromElement(this.element);
      const originalWidth = this.getTextBoxWidth();

      let modelWidth = 0;
      let finalFontSize = this.config.fontSizeSet[this.config.fontSizeSet.length - 1];

      for (let i = 0; i < this.config.fontSizeSet.length; i++) {
        modelWidth = this.getModelWidth(text, this.config.fontSizeSet[i]);
        if (modelWidth >= originalWidth) {
          if (i === 0) {
            finalFontSize = this.config.fontSizeSet[0];
            break;
          }
          finalFontSize = this.config.fontSizeSet[i - 1];
          break;
        }
      }
      this.config.setFontSize(this.element, finalFontSize, this);
      return finalFontSize;
    }
    return false;
  }

  public optimizeFromRange(): number | false {
    if (
      this.configRangeIsValid() === true
      && typeof this.config.fontSizeRange !== 'undefined'
      && typeof this.config.increment !== 'undefined'
    ) {
      const [ minFontSize, maxFontSize ] = this.config.fontSizeRange;
      const text = DOMText.getTextFromElement(this.element);
      const originalWidth = this.getTextBoxWidth();

      let modelWidth = 0;
      let finalFontSize = minFontSize;

      while (true) {
        modelWidth = this.getModelWidth(text, finalFontSize);
        if (modelWidth >= originalWidth) {
          while(true) {
            finalFontSize -= this.config.increment;
            if (finalFontSize <= minFontSize) {
              finalFontSize = minFontSize;
              break;
            }
            modelWidth = this.getModelWidth(text, finalFontSize);
            if (modelWidth <= originalWidth) break;
          }
          break;
        }
        finalFontSize += this.config.increment;
        if (finalFontSize >= maxFontSize) {
          finalFontSize = maxFontSize;
          break;
        }
      }
      this.config.setFontSize(this.element, finalFontSize, this);
      return finalFontSize;
    }
    return false;
  }
}
