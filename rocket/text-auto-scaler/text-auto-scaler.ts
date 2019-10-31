import {
  DOMBoxModel,
  DOMText,
  DOMUtil,
  RangeArray,
} from '../rocket';

import {
  TEXT_AUTO_SCALER_DEFAULT_CONFIG,
  TextAutoScalerConfig,
} from './config';

export class TextAutoScaler {
  public config: TextAutoScalerConfig;

  public originalWidth: number = 0;

  constructor(config: Partial<TextAutoScalerConfig>) {
    this.config = {...TEXT_AUTO_SCALER_DEFAULT_CONFIG};

    this.setConfig(config);
  }

  public setConfig(config: Partial<TextAutoScalerConfig>) {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }
  }

  public configRangeIsValid(): boolean {
    const { element, fontSizeRange, fontSizeIncrement } = this.config;

    return (
      DOMUtil.isHTMLElement(element) === true

      && typeof fontSizeRange === 'object'
      && Array.isArray(fontSizeRange) === true

      && fontSizeRange.length === 2
      && fontSizeRange[0] < fontSizeRange[1]

      && typeof fontSizeIncrement === 'number'
      && fontSizeIncrement > 0
    );
  }

  public configSetIsvalid(): boolean {
    const { validFontSizes } = this.config;

    return (
      typeof validFontSizes === 'object'
      && Array.isArray(validFontSizes) === true
      && validFontSizes.length > 0
    );
  }

  public getTextBoxWidth(): number {
    let { element } = this.config;

    if (DOMUtil.isHTMLElement(element) === true) {
      const targetElement = element as HTMLElement;

      return DOMBoxModel.getContentWidth(targetElement);
    } else {
      return 0;
    }
  }

  public getModelWidth(text: string, fontSize: number): number {
    let { element } = this.config;

    const targetElement = element as HTMLElement;

    return DOMText.getTextBoxWidthFromElement(
      targetElement,
      text.trim(),
      null,
      {
        fontSize: `${fontSize}px`,
      },
    );
  }

  public scaleText(): number | false {
    let { validFontSizes } = this.config;
    
    if (validFontSizes) {
      return this.scaleTextFromValidFontSizes();
    }

    return this.scaleTextFromFontSizeRange();
  }

  public scaleTextFromValidFontSizes(): number | false {
    let { element, validFontSizes } = this.config;

    if (this.configSetIsvalid() === true) {
      const targetElement = element as HTMLElement;

      validFontSizes = validFontSizes as number[];

      validFontSizes.sort((a, b) => a - b);

      const text = DOMText.getTextFromElement(targetElement).trim();
      
      const originalWidth = this.getTextBoxWidth();

      let modelWidth = 0;

      let finalFontSize = validFontSizes[validFontSizes.length - 1];

      for (let i = 0; i < validFontSizes.length; i++) {
        modelWidth = this.getModelWidth(text, validFontSizes[i]);

        if (modelWidth >= originalWidth) {
          if (i === 0) {
            finalFontSize = validFontSizes[0];

            break;
          }

          finalFontSize = validFontSizes[i - 1];

          break;
        }
      }

      this.config.setFontSize(targetElement, finalFontSize, this);

      return finalFontSize;
    }

    return false;
  }

  public scaleTextFromFontSizeRange(): number | false {
    let { element, fontSizeRange, fontSizeIncrement } = this.config;

    if (this.configRangeIsValid() === true) {
      element = element as HTMLElement;
      fontSizeRange = fontSizeRange as RangeArray;
      fontSizeIncrement = fontSizeIncrement as number;

      const [minFontSize, maxFontSize] = fontSizeRange;

      const text = DOMText.getTextFromElement(element).trim();

      const originalWidth = this.getTextBoxWidth();

      let modelWidth = 0;

      let finalFontSize = minFontSize;

      while (true) {
        modelWidth = this.getModelWidth(text, finalFontSize);

        if (modelWidth >= originalWidth) {
          while (true) {
            finalFontSize -= fontSizeIncrement;

            if (finalFontSize <= minFontSize) {
              finalFontSize = minFontSize;

              break;
            }

            modelWidth = this.getModelWidth(text, finalFontSize);

            if (modelWidth <= originalWidth) {
              break;
            }
          }

          break;
        }

        finalFontSize += fontSizeIncrement;

        if (finalFontSize >= maxFontSize) {
          finalFontSize = maxFontSize;

          break;
        }
      }

      this.config.setFontSize(element, finalFontSize, this);

      return finalFontSize;
    }

    return false;
  }
}
