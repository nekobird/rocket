const MODEL_ATTRIBUTES = {
  border: 'none',
  height: '0px',
  left: '0px',
  overflowWrap: 'normal',
  overflowX: 'hidden',
  overflowY: 'hidden',
  padding: '0px',
  position: 'fixed',
  resize: 'none',
  top: '0px',
  visibility: 'hidden',
  whiteSpace: 'nowrap',
  width: '0px',
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

  private modelElement: HTMLElement

  constructor() { }

  public getTextBoxHeightFromElement(element: HTMLElement, text?: string): number {
    // Create and prepare model to measure height.
    this
      .destroy()
      .create('TEXTAREA')
      .applyModelAttributes()
      .applyBoxModelPropertiesFromElement(element)
      .applyFontPropertiesFromElement(element)

    this.style = {
      height: '0px',
      maxHeight: '0px',
      whiteSpace: 'pre-wrap'
    }

    // If text is undefined, get text from target element instead.
    if (typeof text === 'undefined') {
      text = TextBoxModel.getTextFromElement(element)
    }
    this.modelText = text

    // Set offset for when boxSizing is set to border-box.
    let offset: number = 0
    let style: CSSStyleDeclaration = window.getComputedStyle(element)
    if (style.getPropertyValue('boxSizing') === 'border-box') {
      offset = TextBoxModel.getElementVerticalBorderHeight(element)
    } else {
      // Minus vertical padding.
      let padding: number =
        parseInt(style.getPropertyValue('paddingTop')) +
        parseInt(style.getPropertyValue('paddingBottom'))
      offset -= padding
    }

    // Return calculated height value.
    return this.modelElement.scrollHeight + offset
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
      borderLeftWidth: '0px',
      borderRightWidth: '0px',
      boxSizing: 'content-box',
      minWidth: '0px',
      paddingLeft: '0px',
      paddingRight: '0px',
      whiteSpace: 'nowrap',
      width: '0px',
      wordBreak: 'normal',
      wordWrap: 'normal'
    }

    // If text is undefined, get text from target element instead.
    if (typeof text === 'undefined') {
      text = TextBoxModel.getTextFromElement(element)
    }
    this.modelText = text

    // Set offset for when boxSizing is set to border-box.
    let offset = 0
    let style = window.getComputedStyle(element, null)
    if (style['boxSizing'] === 'border-box') {
      offset = TextBoxModel.getElementHorizontalBorderWidth(element)
      offset += TextBoxModel.getElementHorizontalPaddingWidth(element)
    }

    // Return calculated width value.
    return this.modelElement.scrollWidth + offset
  }

  // MODEL

  set modelFontSize(fontSize: number) {
    this.modelElement.style.fontSize = `${fontSize}px`
  }

  set modelText(text: string) {
    if (
      this.modelElement instanceof HTMLTextAreaElement ||
      this.modelElement instanceof HTMLInputElement ||
      this.modelElement.nodeName === 'TEXTAREA' ||
      this.modelElement.nodeName === 'INPUT'
    ) {
      (<HTMLTextAreaElement | HTMLInputElement>this.modelElement).value = text
    } else {
      text = text.replace(/[\n\r]/g, '<br>')
      text = text.replace(/[\t]/g, '&#9')
      text = text.replace(/[\s]/g, '&nbsp')
      this.modelElement.innerHTML = text
    }
  }

  set style(style: object) {
    Object.assign(this.modelElement.style, style)
  }

  public applyModelAttributes(): TextBoxModel {
    Object.assign(this.modelElement.style, MODEL_ATTRIBUTES)
    return this
  }

  public applyBoxModelPropertiesFromElement(element: HTMLElement): TextBoxModel {
    let style: CSSStyleDeclaration = window.getComputedStyle(element)
    for (let name of STYLE_PROPERTIES) {
      this.modelElement.style[name] = style.getPropertyValue(name)
    }
    return this
  }

  public applyFontPropertiesFromElement(element: HTMLElement): TextBoxModel {
    let style: CSSStyleDeclaration = window.getComputedStyle(element)
    for (let name of FONT_STYLE_PROPERTIES) {
      this.modelElement.style[name] = style.getPropertyValue(name)
    }
    return this
  }

  public create(type = undefined): TextBoxModel {
    type = typeof type === 'string' ? type : 'TEXTAREA'
    this.modelElement = document.createElement(type)
    document.body.appendChild(this.modelElement)
    return this
  }

  public destroy(): TextBoxModel {
    if (
      typeof this.modelElement !== 'undefined' &&
      this.modelElement.nodeType === 1
    ) {
      document.body.removeChild(this.modelElement)
      this.modelElement.remove()
    }
    return this
  }

  // ELEMENT

  public static getElementFontSize(element: HTMLElement): number {
    let style: CSSStyleDeclaration = window.getComputedStyle(element)
    return parseFloat(style.getPropertyValue('font-size'))
  }

  public static getTextFromElement(element: HTMLElement): string {
    if (
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLInputElement ||
      element.nodeName === 'INPUT' ||
      element.nodeName === 'TEXTAREA'
    ) {
      return (<HTMLTextAreaElement | HTMLInputElement>element).value
    }
    return element.textContent
  }

  public static getElementHorizontalBorderWidth(element: HTMLElement) {
    let style: CSSStyleDeclaration = window.getComputedStyle(element)
    let width: number =
      parseFloat(style.getPropertyValue('borderLeftWidth')) +
      parseFloat(style.getPropertyValue('borderRightWidth'))
    return width
  }

  public static getElementHorizontalPaddingWidth(element: HTMLElement): number {
    let style: CSSStyleDeclaration = window.getComputedStyle(element)
    let width: number =
      parseFloat(style.getPropertyValue('paddingLeft')) +
      parseFloat(style.getPropertyValue('paddingRight'))
    return width
  }

  public static getElementLineHeight(element: HTMLElement): number {
    let style: CSSStyleDeclaration = window.getComputedStyle(element)
    return parseFloat(style.getPropertyValue('line-height'))
  }

  public static getElementVerticalBorderHeight(element: HTMLElement): number {
    let style: CSSStyleDeclaration = window.getComputedStyle(element)
    let height: number =
      parseFloat(style.getPropertyValue('borderBottomWidth')) +
      parseFloat(style.getPropertyValue('borderTopWidth'))
    return height
  }

  public static getElementVerticalPaddingHeight(element: HTMLElement): number {
    let style: CSSStyleDeclaration = window.getComputedStyle(element)
    let height: number =
      parseFloat(style.getPropertyValue('paddingBottom')) +
      parseFloat(style.getPropertyValue('paddingTop'))
    return height
  }

  public setElementFontSize(element: HTMLElement, fontSize: number): TextBoxModel {
    element.style.fontSize = `${fontSize}px`
    return this
  }

}