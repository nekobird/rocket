import {
  TextBoxModel
} from '../Rocket'

export class UITextArea {

  constructor(element, properties) {
    // FLAGS
    this.disableLineBreaks = false
    this.disableTabs = false
    this.isInFocus = false
    this.limitNumberOfCharacters = false
    this.removeLeadingWhitespaces = false
    this.removeMultipleWhitespaces = false

    // VARIABLES
    this.element

    // CALLBACKS
    this.onBlur = () => { }
    this.onFocus = () => { }
    this.onInput = () => { }
    this.onPaste = () => { }

    // PROPERTIES
    this._eventInput
    this._eventInputName = 'UITextAreaOnInput'
    this._eventKeydown
    this._eventKeydownName = 'UITextAreaOnKeydown'
    this._lastKeyCode
    this._textBoxModel

    // Initialize TextBoxModel.
    this._textBoxModel = new TextBoxModel

    // Initialize custom events.
    this._eventInput = new CustomEvent(this._eventInputName)
    this._eventKeydown = new CustomEvent(this._eventKeydownName)

    this.element = element
    this.properties = properties

    this.initialize()
    return this
  }

  initialize() {
    this.filterInput()
    this.grow()
    this.startListening()
    return this
  }

  set properties(properties) {
    for (let key in properties) {
      this[key] = properties[key]
    }
  }

  get value() {
    return this.element.value
  }

  get selectedText() {
    let text = this.element.value
    let start = this.element.selectionStart
    let end = this.element.selectionEnd
    return text.substring(start, end)
  }

  set value(value) {
    if (typeof value === 'string') {
      this.element.value = value
      this.processText()
    }
    return this.element.value
  }

  grow() {
    const height = this._textBoxModel.getTextBoxHeightFromElement(this.element)
    this.element.style.height = `${height}px`
    return this
  }

  destroy() {
    this.stopListening()
    return this
  }

  filterInput() {
    // Remove new lines.
    if (this.disableLineBreaks === true) {
      this.element.value = this.element.value.replace(/[\r\n]+/g, '')
    }
    // Remove tabs.
    if (this.disableTabs === true) {
      this.element.value = this.element.value.replace(/[\t]+/g, '')
    }
    // Remove multiple whitespaces to one.
    if (this.removeMultipleWhitespaces === true) {
      this.element.value = this.element.value.replace(/[\s]+/g, ' ')
    }
    // Remove leading whitespaces.
    if (this.removeLeadingWhitespaces === true) {
      this.element.value = this.element.value.replace(/^[\s]+/g, '')
    }
    // Trim element value if limit number of characters is a number.
    if (typeof this.limitNumberOfCharacters === 'number') {
      this.element.value = this.element.value.substring(0, this.limitNumberOfCharacters)
    }
    // Replace tabs with spaces.
    // TODO: Fix this because it's not working as intended.
    // this.element.value = this.element.value.replace(/[\t]+/g, '    ')
    return this
  }

  insertString(string) {
    let start = this.element.selectionStart
    let end = this.element.selectionEnd
    let text = this.element.value
    this.element.value = text.substring(0, start) + string + text.substring(end)
    this.element.selectionEnd = start + string.length
    return this
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

  // EVENTS

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
    if (
      keyCode === 13 &&
      this.disableLineBreaks === true
    ) {
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