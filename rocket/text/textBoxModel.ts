import {
  DOMHelper,
  DOMStyle,
} from '../rocket'

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
}

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
]

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
]

export class TextBoxModel {

  private modelElement?: HTMLElement

  constructor() {}

  public getTextBoxHeightFromElement(element: HTMLElement, text?: string): number {
    // Create and prepare model to measure height.
    this
      .destroy()
      .create('TEXTAREA')
      .applyModelAttributes()
      .applyBoxModelPropertiesFromElement(element)
      .applyFontPropertiesFromElement(element)

    this.style = {
      height    : '0',
      maxHeight : '0',
      whiteSpace: 'pre-wrap'
    }

    // If text is undefined, get text from target element instead.
    if (typeof text === 'undefined') {
      text = DOMHelper.getTextFromElement(element)
    }
    this.modelText = text

    // Set offset for when boxSizing is set to border-box.
    let offset: number = 0
    if (DOMStyle.getStyleValue(element, 'boxSizing') === 'border-box') {
      offset = DOMStyle.getVerticalBorderWidths(element)
    } else {
      // Minus vertical padding.
      offset -= DOMStyle.getVerticalPaddings(element)
    }
    // Return calculated height value.
    return (<HTMLElement>this.modelElement).scrollHeight + offset
  }

  public getTextBoxWidthFromElement(element: HTMLElement, text?: string): number {
    // Create and prepare model to measure width.
    this
      .destroy()
      .create('DIV')
      .applyModelAttributes()
      .applyBoxModelPropertiesFromElement(element)
      .applyFontPropertiesFromElement(element)

    this.style = {
      borderLeftWidth : '0',
      borderRightWidth: '0',
      boxSizing   : 'content-box',
      minWidth    : '0',
      paddingLeft : '0',
      paddingRight: '0',
      whiteSpace  : 'nowrap',
      width       : '0',
      wordBreak   : 'normal',
      wordWrap    : 'normal'
    }

    // If text is undefined, get text from target element instead.
    if (typeof text === 'undefined') {
      text = DOMHelper.getTextFromElement(element)
    }
    this.modelText = text

    // Set offset for when boxSizing is set to border-box.
    let offset = 0
    if (DOMStyle.getStyleValue(element, 'boxSizing') === 'border-box') {
      offset = DOMStyle.getHorizontalBorderWidths(element)
      offset += DOMStyle.getHorizontalPaddings(element)
    }

    // Return calculated width value.
    return (<HTMLElement>this.modelElement).scrollWidth + offset
  }

  // MODEL

  set modelFontSize(fontSize: number) {
    if (typeof this.modelElement === 'object') {
      this.modelElement.style.fontSize = `${fontSize}px`
    }
  }

  set modelText(text: string) {
    if (typeof this.modelElement === 'object') {
      if (
        this.modelElement instanceof HTMLTextAreaElement
        || this.modelElement instanceof HTMLInputElement
        || this.modelElement.nodeName === 'TEXTAREA'
        || this.modelElement.nodeName === 'INPUT'
      ) {
        (<HTMLTextAreaElement | HTMLInputElement>this.modelElement).value = text
      } else {
        text = text.replace(/[\n\r]/g, '<br>')
        text = text.replace(/[\t]/g, '&#9')
        text = text.replace(/[\s]/g, '&nbsp')
        this.modelElement.innerHTML = text
      }
    }
  }

  set style(style: object) {
    if (typeof this.modelElement === 'object') {
      Object.assign(this.modelElement.style, style)
    }
  }

  public applyModelAttributes(): this {
    if (typeof this.modelElement === 'object') {
      Object.assign(this.modelElement.style, MODEL_ATTRIBUTES)
    }
    return this
  }

  public applyBoxModelPropertiesFromElement(element: HTMLElement): this {
    const style = window.getComputedStyle(element)

    STYLE_PROPERTIES.forEach(name => {
      if (typeof this.modelElement === 'object') {
        this.modelElement.style[name] = style[name]
      }
    })
    return this
  }

  public applyFontPropertiesFromElement(element: HTMLElement): this {
    const style = window.getComputedStyle(element)

    FONT_STYLE_PROPERTIES.forEach(name => {
      if (typeof this.modelElement === 'object') {
        this.modelElement.style[name] = style[name]
      }
    })
    return this
  }

  public create(type?: string): this {
    type = typeof type === 'string' ? type : 'TEXTAREA'
    this.modelElement = document.createElement(type)
    document.body.appendChild(this.modelElement)
    return this
  }

  public destroy(): this {
    if (
      typeof this.modelElement !== 'undefined' &&
      this.modelElement.nodeType === 1
    ) {
      document.body.removeChild(this.modelElement)
      this.modelElement.remove()
    }
    return this
  }
}
