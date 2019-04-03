const DEFAULT_ATTRIBUTES = {
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
    this.element = undefined
  }

  getTextBoxHeightFromElement(element, text) {
    this
      .destroy()
      .create('TEXTAREA')
      .applyDefaultAttributes()
      .applyBoxModelPropertiesFromElement(element)
      .applyFontPropertiesFromElement(element)
    this.element.style.maxHeight = '0px'
    this.element.style.height = '0px'
    this.element.style.whiteSpace = 'pre-wrap'
    if (typeof text === 'undefined') {
      text = this.getTextFromElement(element)
    }
    this.setText(text)
    let offset = 0
    let style = window.getComputedStyle(element, null)
    if (style['boxSizing'] === 'border-box') {
      offset = this.getElementVerticalBorderHeight(element)
    }
    return this.element.scrollHeight + offset
  }

  getTextBoxWidthFromElement(element, text) {
    this
      .destroy()
      .create('DIV')
      .applyDefaultAttributes()
      .applyBoxModelPropertiesFromElement(element)
      .applyFontPropertiesFromElement(element)
      .setStyle({
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
      })
    if (typeof text === 'undefined') {
      text = this.getTextFromElement(element)
    }
    this.setText(text)
    let offset = 0
    let style = window.getComputedStyle(element, null)
    if (style['boxSizing'] === 'border-box') {
      offset = this.getElementHorizontalBorderWidth(element)
      offset += this.getElementHorizontalPaddingWidth(element)
    }
    return this.element.scrollWidth + offset
  }

  // Model

  applyDefaultAttributes() {
    for (let key in DEFAULT_ATTRIBUTES) {
      this.element.style[key] = DEFAULT_ATTRIBUTES[key]
    }
    return this
  }

  applyBoxModelPropertiesFromElement(element) {
    let style = window.getComputedStyle(element, null)
    for (let name of STYLE_PROPERTIES) {
      this.element.style[name] = style[name]
    }
    return this
  }

  applyFontPropertiesFromElement(element) {
    let style = window.getComputedStyle(element, null)
    for (let name of FONT_STYLE_PROPERTIES) {
      this.element.style[name] = style[name]
    }
    return this
  }

  create(type = undefined) {
    type = typeof type === 'string' ? type : 'TEXTAREA'
    this.element = document.createElement(type)
    document.body.appendChild(this.element)
    return this
  }

  destroy() {
    if (
      typeof this.element !== 'undefined' &&
      this.element.nodeType === 1
    ) {
      document.body.removeChild(this.element)
      this.element.remove()
    }
    return this
  }

  setFontSize(fontSize) {
    this.element.style.fontSize = `${fontSize}px`
    return this
  }

  setStyle(style) {
    for (let key in style) {
      this.element.style[key] = style[key]
    }
    return this
  }

  setText(text) {
    if (
      this.element instanceof HTMLTextAreaElement ||
      this.element instanceof HTMLInputElement ||
      this.element.nodeName === 'TEXTAREA' ||
      this.element.nodeName === 'INPUT'
    ) {
      (this.element).value = text
    } else {
      text = text.replace(/[\n\r]/g, '<br>')
      text = text.replace(/[\t]/g, '&#9')
      text = text.replace(/[\s]/g, '&nbsp')
      this.element.innerHTML = text
    }
    return this
  }

  // Element

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
      return (element).value
    } else {
      return element.textContent
    }
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