import {
  DOMStyle,
  DOMUtil,
  TextBoxModel,
} from '../rocket';

export interface TextScaleModelConfig {
  maxFontSize: number;
  minFontSize: number;
  increment: number;
  setFontSize: (element: HTMLElement, fontSize: number, context: TextScaleModel) => void;
}

const TEXTSCALEMODEL_DEFAULT_CONFIG: TextScaleModelConfig = {
  maxFontSize: 18,
  minFontSize: 16,
  increment: 1,
  setFontSize: (element, fontSize) => element.style.fontSize = `${fontSize}px`,
};

export class TextScaleModel {
  config: TextScaleModelConfig;
  element: HTMLElement;

  model: TextBoxModel;
  originalFontSize: number = 0;
  originalWidth: number = 0;

  constructor(element: HTMLElement, config: Partial<TextScaleModelConfig>) {
    this.model = new TextBoxModel();
    this.element = element;
    this.config = Object.assign({}, TEXTSCALEMODEL_DEFAULT_CONFIG);
    if (typeof config === 'object') {
      this.setConfig(config);
    }
  }

  public setConfig(config: Partial<TextScaleModelConfig>) {
    Object.assign(this.config, config);
  }
  
  public initialize() {
    this.originalFontSize = DOMStyle.getFontSize(this.element);
    this.originalWidth = this.element.offsetWidth - DOMStyle.getTotalHorizontalSpacing(this.element);
  }

  public validateConfig(): boolean {
    let valid = true;
    if (this.config.maxFontSize <= this.config.minFontSize) {
      valid = false;
    }
    if (this.config.increment <= 0) {
      valid = false;
    }
    return valid;
  }

  public optimize() {
    if (this.validateConfig() === true) {
      const text = DOMUtil.getTextFromElement(this.element);
      this.originalWidth = this.element.offsetWidth - DOMStyle.getTotalHorizontalSpacing(this.element);
      let modelWidth = 0;
      let modelFontSize = this.config.minFontSize;
      while (true) {
        modelWidth = this.model.getTextBoxWidthFromElement(this.element, text, { fontSize: `${modelFontSize}px` });
        if (modelWidth >= this.originalWidth) {
          while(true) {
            modelFontSize -= this.config.increment;
            if (modelFontSize <= this.config.minFontSize) {
              modelFontSize = this.config.minFontSize;
              break;
            }
            modelWidth = this.model.getTextBoxWidthFromElement(this.element, text, { fontSize: `${modelFontSize}px` });
            if (modelWidth <= this.originalWidth) {
              break;
            }
          }
          break;
        }
        modelFontSize += this.config.increment;
        if (modelFontSize >= this.config.maxFontSize) {
          modelFontSize = this.config.maxFontSize;
          break;
        }
      }
      this.config.setFontSize(this.element, modelFontSize, this);
    }
  }
}