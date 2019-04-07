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

  constructor() {
    this.modelElement = undefined
  }

  getTextBoxHeightFromElement(element, text) {
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
      text = this.getTextFromElement(element)
    }
    this.modelText = text

    // Set offset for when boxSizing is set to border-box.
    let offset = 0
    let style = window.getComputedStyle(element, null)
    if (style['boxSizing'] === 'border-box') {
      offset = this.getElementVerticalBorderHeight(element)
    } else {
      // Minus vertical padding.
      let padding = parseInt(style['paddingTop'])
      padding += parseInt(style['paddingBottom'])
      offset -= padding
    }

    // Return calculated height value.
    return this.modelElement.scrollHeight + offset
  }

  getTextBoxWidthFromElement(element, text) {
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
      text = this.getTextFromElement(element)
    }
    this.modelText = text

    // Set offset for when boxSizing is set to border-box.
    let offset = 0
    let style = window.getComputedStyle(element, null)
    if (style['boxSizing'] === 'border-box') {
      offset = this.getElementHorizontalBorderWidth(element)
      offset += this.getElementHorizontalPaddingWidth(element)
    }

    // Return calculated width value.
    return this.modelElement.scrollWidth + offset
  }

  // MODEL

  set modelFontSize(fontSize) {
    this.modelElement.style.fontSize = `${fontSize}px`
  }

  set modelText(text) {
    if (
      this.modelElement instanceof HTMLTextAreaElement ||
      this.modelElement instanceof HTMLInputElement ||
      this.modelElement.nodeName === 'TEXTAREA' ||
      this.modelElement.nodeName === 'INPUT'
    ) {
      this.modelElement.value = text
    } else {
      text = text.replace(/[\n\r]/g, '<br>')
      text = text.replace(/[\t]/g, '&#9')
      text = text.replace(/[\s]/g, '&nbsp')
      this.modelElement.innerHTML = text
    }
  }

  set style(style) {
    for (let key in style) {
      this.modelElement.style[key] = style[key]
    }
  }

  applyModelAttributes() {
    for (let key in MODEL_ATTRIBUTES) {
      this.modelElement.style[key] = MODEL_ATTRIBUTES[key]
    }
    return this
  }

  applyBoxModelPropertiesFromElement(element) {
    let style = window.getComputedStyle(element, null)

    for (let name of STYLE_PROPERTIES) {
      this.modelElement.style[name] = style[name]
    }
    return this
  }

  applyFontPropertiesFromElement(element) {
    let style = window.getComputedStyle(element, null)

    for (let name of FONT_STYLE_PROPERTIES) {
      this.modelElement.style[name] = style[name]
    }
    return this
  }

  create(type = undefined) {
    type = typeof type === 'string' ? type : 'TEXTAREA'

    this.modelElement = document.createElement(type)

    document.body.appendChild(this.modelElement)
    return this
  }

  destroy() {
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

  getElementFontSize(element) {
    let style = window.getComputedStyle(element, null)

    return parseFloat(style['font-size'])
  }

  getTextFromElement(element) {
    if (
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLInputElement ||
      element.nodeName === 'INPUT' ||
      element.nodeName === 'TEXTAREA'
    ) {
      return element.value
    }
    return element.textContent
  }

  getElementHorizontalBorderWidth(element) {
    let style = window.getComputedStyle(element, null)
    let width = parseFloat(style['borderLeftWidth'])
    return width + parseFloat(style['borderRightWidth'])
  }

  getElementHorizontalPaddingWidth(element) {
    let style = window.getComputedStyle(element, null)
    let width = parseFloat(style['paddingLeft'])
    return width + parseFloat(style['paddingRight'])
  }

  getElementLineHeight(element) {
    let style = window.getComputedStyle(element, null)
    return parseFloat(style['line-height'])
  }

  getElementVerticalBorderHeight(element) {
    let style = window.getComputedStyle(element, null)
    let height = parseFloat(style['borderBottomWidth'])
    return height + parseFloat(style['borderTopWidth'])
  }

  getElementVerticalPaddingHeight(element) {
    let style = window.getComputedStyle(element, null)
    let height = parseFloat(style['paddingBottom'])
    return height + parseFloat(style['paddingTop'])
  }

  setElementFontSize(element, fontSize) {
    element.style.fontSize = `${fontSize}px`
    return this
  }

}