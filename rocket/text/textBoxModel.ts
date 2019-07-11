import {
  DOMStyle,
  DOMText,
} from '../rocket';

const MODEL_ATTRIBUTES = {
  border: 'none',
  height: '0',
  left: '0',
  overflowWrap: 'normal',
  overflowX: 'hidden',
  overflowY: 'hidden',
  padding: '0',
  position: 'fixed',
  resize: 'none',
  top: '0',
  visibility: 'hidden',
  whiteSpace: 'nowrap',
  width: '0',
  zIndex: '-9999',
};

const STYLE_PROPERTIES = [
  'borderBottomStyle',
  'borderBottomWidth',
  'borderLeftStyle',
  'borderLeftWidth',
  'borderRightStyle',
  'borderRightWidth',
  'borderTopStyle',
  'borderTopWidth',
  'boxSizing',
  'height',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'width',
];

const FONT_STYLE_PROPERTIES = [
  'direction',
  'fontFamily',
  'fontSize',
  'fontSizeAdjust',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'tabSize',
  'textAlign',
  'textDecoration',
  'textIndent',
  'textOverflow',
  'textTransform',
  'whiteSpace',
  'wordBreak',
  'wordSpacing',
  'wordWrap',
];

interface Style {
  [name: string]: string;
}

export class TextBoxModel {

  private modelElement?: HTMLElement;

  constructor() {}

  public getTextBoxHeightFromElement(element: HTMLElement, text?: string, modelStyleOverride?: Style): number {
    // Create and prepare model to measure height.
    this
      .destroy()
      .create('TEXTAREA')
      .applyModelAttributes()
      .applyBoxModelPropertiesFromElement(element)
      .applyFontPropertiesFromElement(element);

    this.style = {
      height: '0',
      maxHeight: '0',
      whiteSpace: 'pre-wrap',
    };

    if (typeof modelStyleOverride !== 'undefined')
      this.style = modelStyleOverride;

    // If text is undefined, get text from target element instead.
    if (typeof text === 'undefined')
      text = DOMText.getTextFromElement(element);

    this.modelText = text;

    // Set offset for when boxSizing is set to border-box.
    let offset = 0;

    if (DOMStyle.getStyleValue(element, 'boxSizing') === 'border-box') {
      offset = DOMStyle.getVerticalBorderWidths(element);
    } else {
      // Minus vertical padding.
      offset -= DOMStyle.getVerticalPaddings(element);
    }

    const result = (this.modelElement as HTMLElement).scrollHeight + offset;
    this.destroy();
    return result;
  }

  // This returns textbox width.
  public getTextBoxWidthFromElement(element: HTMLElement, text?: string, modelStyleOverride?: Style): number {
    // Create and prepare model to measure width.
    this
      .destroy()
      .create('DIV')
      .applyModelAttributes()
      .applyBoxModelPropertiesFromElement(element)
      .applyFontPropertiesFromElement(element);

    this.style = {
      borderLeftWidth: '0',
      borderRightWidth: '0',
      boxSizing: 'content-box',
      minWidth: '0',
      paddingLeft: '0',
      paddingRight: '0',
      whiteSpace: 'nowrap',
      width: '0',
      wordBreak: 'normal',
      wordWrap: 'normal',
    };

    if (typeof modelStyleOverride !== 'undefined')
      this.style = modelStyleOverride;

    if (typeof text === 'undefined')
      text = DOMText.getTextFromElement(element);

    this.modelText = text;

    const result = (this.modelElement as HTMLElement).scrollWidth;
    this.destroy();
    return result;
  }

  // @model

  set modelFontSize(fontSize: number) {
    if (typeof this.modelElement === 'object')
      this.modelElement.style.fontSize = `${fontSize}px`;
  }

  set modelText(text: string) {
    if (typeof this.modelElement === 'object') {
      if (
        this.modelElement instanceof HTMLTextAreaElement
        || this.modelElement instanceof HTMLInputElement
        || this.modelElement.nodeName === 'TEXTAREA'
        || this.modelElement.nodeName === 'INPUT'
      ) {
        (this.modelElement as HTMLTextAreaElement | HTMLInputElement).value = text;
      } else {
        text = text.replace(/[\n\r]/g, '<br>');
        text = text.replace(/[\t]/g, '&#9');
        text = text.replace(/[\s]/g, '&nbsp');
        this.modelElement.innerHTML = text;
      }
    }
  }

  set style(style: object) {
    if (typeof this.modelElement === 'object')
      Object.assign(this.modelElement.style, style);
  }

  public applyModelAttributes(): this {
    if (typeof this.modelElement === 'object')
      Object.assign(this.modelElement.style, MODEL_ATTRIBUTES);
    return this;
  }

  public applyBoxModelPropertiesFromElement(element: HTMLElement): this {
    const style = window.getComputedStyle(element);
    STYLE_PROPERTIES.forEach(name => {
      if (typeof this.modelElement === 'object')
        this.modelElement.style[name] = style[name];
    });
    return this;
  }

  public applyFontPropertiesFromElement(element: HTMLElement): this {
    const style = window.getComputedStyle(element);
    FONT_STYLE_PROPERTIES.forEach(name => {
      if (typeof this.modelElement === 'object')
        this.modelElement.style[name] = style[name];
    });
    return this;
  }

  public create(type?: string): this {
    type = typeof type === 'string' ? type : 'TEXTAREA';
    this.modelElement = document.createElement(type);
    document.body.appendChild(this.modelElement);
    return this;
  }

  public destroy(): this {
    if (
      typeof this.modelElement !== 'undefined'
      && this.modelElement.parentElement !== null
    ) {
      this.modelElement.parentElement.removeChild(this.modelElement);
      this.modelElement.remove();
    }
    return this;
  }
}
