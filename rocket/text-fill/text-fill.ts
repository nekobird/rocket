import {
  DOMBoxModel,
  DOMText,
  DOMUtil,
  RangeArray,
} from '../rocket';

import {
  TEXT_FILL_DEFAULT_CONFIG,
  TextFillConfig,
} from './config';

export class TextFill {
  public config: TextFillConfig;

  public originalWidth: number = 0;

  constructor(config: Partial<TextFillConfig>) {
    this.config = {...TEXT_FILL_DEFAULT_CONFIG};

    this.setConfig(config);
  }

  public setConfig(config: Partial<TextFillConfig>) {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }
  }

  public configRangeIsValid(): boolean {
    const { element, fontSizeRange, fontSizeIncrement } = this.config;

    if (
      DOMUtil.isHTMLElement(element) === true

      && typeof fontSizeRange === 'object'
      && Array.isArray(fontSizeRange) === true

      && fontSizeRange.length === 2
      && fontSizeRange[0] < fontSizeRange[1]

      && typeof fontSizeIncrement === 'number'
      && fontSizeIncrement > 0
    ) {
      return true;
    }

    return false;
  }

  public configSetIsvalid(): boolean {
    const { validFontSizes } = this.config;

    if (
      typeof validFontSizes === 'object'
      && Array.isArray(validFontSizes) === true
      && validFontSizes.length > 0
    ) {
      return true;
    }

    return false;
  }

  public getTextBoxWidth(): number {
    let { element } = this.config;

    if (DOMUtil.isHTMLElement(element) === true) {
      element = element as HTMLElement;

      return DOMBoxModel.getContentWidth(element);
    } else {
      return 0;
    }
  }

  public getModelWidth(text: string, fontSize: number): number {
    let { element } = this.config;

    element = element as HTMLElement;

    return DOMText.getTextBoxWidthFromElement(
      element,
      text.trim(),
      {
        fontSize: `${fontSize}px`
      }
    );
  }

  public optimize(): number | false {
    let { validFontSizes } = this.config;
    
    if (typeof validFontSizes !== 'undefined') {
      return this.optimizeFromSet();
    }

    return this.optimizeFromRange();
  }

  public optimizeFromSet(): number | false {
    let { element, validFontSizes } = this.config;

    if (this.configSetIsvalid() === true) {
      element = element as HTMLElement;
      validFontSizes = validFontSizes as number[];

      validFontSizes.sort((a, b) => a - b);

      const text = DOMText.getTextFromElement(element).trim();
      
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

      this.config.setFontSize(element, finalFontSize, this);

      return finalFontSize;
    }

    return false;
  }

  public optimizeFromRange(): number | false {
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
