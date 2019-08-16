import {
  DOMBoxModel,
  DOMText,
  DOMUtil,
  RangeArray,
} from '../rocket';

import {
  TEXT_AUTO_SCALE_DEFAULT_CONFIG,
  TextAutoScaleConfig,
} from './config';

export class TextAutoScale {
  public config: TextAutoScaleConfig;

  public originalWidth: number = 0;

  constructor(config: Partial<TextAutoScaleConfig>) {
    this.config = {...TEXT_AUTO_SCALE_DEFAULT_CONFIG};

    this.setConfig(config);
  }

  public setConfig(config: Partial<TextAutoScaleConfig>) {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }
  }

  public configRangeIsValid(): boolean {
    const { element, fontSizeRange, increment } = this.config;

    if (
      DOMUtil.isHTMLElement(element) === true

      && typeof fontSizeRange === 'object'
      && Array.isArray(fontSizeRange) === true

      && fontSizeRange.length === 2
      && fontSizeRange[0] < fontSizeRange[1]

      && typeof increment === 'number'
      && increment > 0
    ) {
      return true;
    }

    return false;
  }

  public configSetIsvalid(): boolean {
    const { fontSizeSet } = this.config;

    if (
      typeof fontSizeSet === 'object'
      && Array.isArray(fontSizeSet) === true
      && fontSizeSet.length > 0
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
    let { fontSizeSet } = this.config;
    
    if (typeof fontSizeSet !== 'undefined') {
      return this.optimizeFromSet();
    }

    return this.optimizeFromRange();
  }

  public optimizeFromSet(): number | false {
    let { element, fontSizeSet } = this.config;

    if (this.configSetIsvalid() === true) {
      element = element as HTMLElement;
      fontSizeSet = fontSizeSet as number[];

      fontSizeSet.sort((a, b) => a - b);

      const text = DOMText.getTextFromElement(element).trim();
      
      const originalWidth = this.getTextBoxWidth();

      let modelWidth = 0;

      let finalFontSize = fontSizeSet[fontSizeSet.length - 1];

      for (let i = 0; i < fontSizeSet.length; i++) {
        modelWidth = this.getModelWidth(text, fontSizeSet[i]);

        if (modelWidth >= originalWidth) {
          if (i === 0) {
            finalFontSize = fontSizeSet[0];

            break;
          }

          finalFontSize = fontSizeSet[i - 1];

          break;
        }
      }

      this.config.setFontSize(element, finalFontSize, this);

      return finalFontSize;
    }

    return false;
  }

  public optimizeFromRange(): number | false {
    let { element, fontSizeRange, increment } = this.config;

    if (this.configRangeIsValid() === true) {
      element = element as HTMLElement;
      fontSizeRange = fontSizeRange as RangeArray;
      increment = increment as number;

      const [minFontSize, maxFontSize] = fontSizeRange;

      const text = DOMText.getTextFromElement(element).trim();

      const originalWidth = this.getTextBoxWidth();

      let modelWidth = 0;

      let finalFontSize = minFontSize;

      while (true) {
        modelWidth = this.getModelWidth(text, finalFontSize);

        if (modelWidth >= originalWidth) {
          while (true) {
            finalFontSize -= increment;

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

        finalFontSize += increment;

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
