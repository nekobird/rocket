import { TextBoxModel } from '../text/TextBoxModel'

export class UITextArea {

  constructor(element, properties) {
    // Flags
    this.disableLineBreaks = false
    this.disableTabs = false
    this.isInFocus = false
    this.limitNumberOfCharacters = false
    this.removeLeadingWhitespaces = false
    this.removeMultipleWhitespaces = false

    // Variables
    this.element

    // Callbacks
    this.onBlur
    this.onFocus
    this.onInput
    this.onPaste

    // Properties
    this._eventInput
    this._eventInputName = 'UITextAreaOnInput'
    this._eventKeydown
    this._eventKeydownName = 'UITextAreaOnKeydown'
    this._lastKeyCode
    this._textBoxModel
  
    this._textBoxModel = new TextBoxModel
    this._eventInput = new CustomEvent(this._eventInputName)
    this._eventKeydown = new CustomEvent(this._eventKeydownName)

    this.setElement(element)
    this.setProperties(properties)
    this.initialize()
    return this
  }

  initialize() {
    this.onBlur = () => { }
    this.onFocus = () => { }
    this.onInput = () => { }
    this.onPaste = () => { }

    this.filterInput()
    this.grow()
    this.startListening()
    return this
  }

  setElement(element) {
    this.element = element
    return this
  }

  setProperties(properties) {
    for (let key in properties) {
      this[key] = properties[key]
    }
    return this
  }

  grow() {
    let height = this._textBoxModel.getTextBoxHeightFromElement(this.element)
    this.element.style.height = `${height}px`
    return this
  }

  destroy() {
    this.stopListening()
    return this
  }

  filterInput() {
    // Remove new lines
    if (this.disableLineBreaks === true) {
      this.element.value = this.element.value.replace(/[\r\n]+/g, '')
    }
    // remove tabs
    if (this.disableTabs === true) {
      this.element.value = this.element.value.replace(/[\t]+/g, '')
    }
    // remove multiple whitespaces to one
    if (this.removeMultipleWhitespaces === true) {
      this.element.value = this.element.value.replace(/[\s]+/g, ' ')
    }
    // remove leading whitespaces
    if (this.removeLeadingWhitespaces === true) {
      this.element.value = this.element.value.replace(/^[\s]+/g, '')
    }
    // if limit number of characters is a number
    // trim element value
    if (typeof this.limitNumberOfCharacters === 'number') {
      this.element.value = this.element.value.substring(0, this.limitNumberOfCharacters)
    }
    // replace tabs with spaces
    // this.element.value = this.element.value.replace(/[\t]+/g, '    ')
    return this
  }

  getSelection() {
    let text = this.element.value
    let start = this.element.selectionStart
    let end = this.element.selectionEnd
    return text.substring(start, end)
  }

  insertString(string) {
    let start = this.element.selectionStart
    let end = this.element.selectionEnd
    let text = this.element.value
    this.element.value = text.substring(0, start) + string + text.substring(end)
    this.element.selectionEnd = start + string.length
    return this
  }

  value(value) {
    if (typeof value === 'string') {
      this.element.value = value
      this.processText()
    }
    return this.element.value
  }

  processText() {
    this.filterInput()
    this.grow()
    return this
  }

  startListening() {
    this.element.addEventListener('blur', this._handleBlur.bind(this))
    this.element.addEventListener('focus', this._handleFocus.bind(this))
    this.element.addEventListener('input', this._handleInput.bind(this))
    this.element.addEventListener('keydown', this._handleKeydown.bind(this))
    this.element.addEventListener('paste', this._handlePaste.bind(this))
    window.addEventListener('resize', this._handleInput.bind(this))
    return this
  }

  stopListening() {
    this.element.removeEventListener('blur', this._handleBlur.bind(this))
    this.element.removeEventListener('focus', this._handleFocus.bind(this))
    this.element.removeEventListener('input', this._handleInput.bind(this))
    this.element.removeEventListener('keydown', this._handleKeydown.bind(this))
    this.element.removeEventListener('paste', this._handlePaste.bind(this))
    window.removeEventListener('resize', this._handleInput.bind(this))
    return this
  }

  // Events

  _handleBlur() {
    this.isInFocus = false
    return this
  }

  _handleFocus() {
    this.isInFocus = true
    return this
  }

  _handleInput(event) {
    this.onInput(this)
    this.processText()
    window.dispatchEvent(this._eventInput)
    return this
  }

  _handleKeydown(event) {
    let keyCode = event.keyCode
    if (keyCode === 9) {
      this.insertString('\t')
      event.preventDefault()
    }
    if (keyCode === 13 && this.disableLineBreaks === true) {
      event.preventDefault()
    }
    this._lastKeyCode = keyCode
    window.dispatchEvent(this._eventKeydown)
    return this
  }

  _handlePaste(event) {
    this.onPaste(this)
    this.processText()
    return this
  }

}