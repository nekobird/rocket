import {
  DOMUtil,
} from '../Rocket'

export class UITextField {

  constructor(element, properties) {
    // FLAGS
    this.allowDecimals = false
    this.disableTabs = false
    this.isEmpty = false
    this.isInFocus = false
    this.isShowingValuePlaceholder = false
    this.limitNumberOfCharacters = false
    this.numbersOnly = false
    this.removeLeadingWhitespaces = false
    this.removeMultipleWhitespaces = false

    this.placeholder
    this._valuePlaceholder
    this._value

    // CALLBACKS
    this.onBlur
    this.onFocus
    this.onInput
    this.onPaste

    // EVENT NAMES
    this._eventBlurName = 'UITextFieldOnBlur'
    this._eventFocusName = 'UITextFieldOnFocus'
    this._eventInputName = 'UITextFieldOnInput'
    this._eventKeydownName = 'UITextFieldOnKeydown'
    this._eventPasteName = 'UITextFieldOnPaste'

    // EVENTS
    this._eventBlur = new CustomEvent(this._eventBlurName)
    this._eventFocus = new CustomEvent(this._eventFocusName)
    this._eventInput = new CustomEvent(this._eventInputName)
    this._eventKeydown = new CustomEvent(this._eventKeydownName)

    this.element = element

    if (typeof properties !== 'undefined') {
      this.properties = properties
    }

    this.initialize()
    return this
  }

  initialize() {
    if (this.element.value === '') {
      this.isEmpty = true
      this.element.value = this._valuePlaceholder
    }
    this.filterInput()
    this._processValuePlaceholder()
    this.startListening()
    return this
  }

  set properties(properties) {
    if (typeof properties === 'object') {
      Object.assign(this, properties)
    }
  }

  set value(value) {
    this.isShowingValuePlaceholder = false
    this._value = value
    this.element.value = value
  }

  get value() {
    if (this.isShowingValuePlaceholder === true) {
      this._value = ''
    } else {
      this._value = this.element.value
    }
    return this._value
  }

  _processValuePlaceholder() {
    if (
      this.isInFocus === false &&
      this.element.value === ''
    ) {
      this.element.value = this._valuePlaceholder
      this.isShowingValuePlaceholder = true
    } else if (
      this.isInFocus === true &&
      this.element.value === this._valuePlaceholder
    ) {
      this.element.value = ''
      this.isShowingValuePlaceholder = false
    }
    return this
  }

  filterInput() {
    // Remove multiple whitespaces to one.
    if (this.removeMultipleWhitespaces && true) {
      this.element.value = this.element.value.replace(/[\s]+/g, ' ')
    }
    // Remove leading whitespaces.
    if (this.removeLeadingWhitespaces && true) {
      this.element.value = this.element.value.replace(/^[\s]+/g, '')
    }
    // If limit number of characters is a number.
    // Trim element value.
    if (typeof this.limitNumberOfCharacters === 'number') {
      this.element.value = this.element.value.substring(
        0, this.limitNumberOfCharacters
      )
    }
    return this
  }

  clear() {
    this.isEmpty = true
    this.element.value = this.placeholder
    return this
  }

  get selectedText() {
    this.element.value.substring(
      this.element.selectionStart, this.element.selectionEnd
    )
  }

  insertString(string) {
    let start = this.element.selectionStart
    let end = this.element.selectionEnd
    // Set input value to:
    // Text before caret + tab + text after caret.
    let text = this.element.value
    this.element.value = text.substring(0, start) + string + text.substring(end)
    // Put caret position back.
    this.element.selectionEnd = start + 1
    return this
  }

  // HANDLE

  _handleBlur() {
    this.isInFocus = false
    this._processValuePlaceholder()
    this.onBlur(this)
    window.dispatchEvent(this._eventBlur)
    return this
  }

  _handleFocus() {
    this.isInFocus = true
    this._processValuePlaceholder()
    window.dispatchEvent(this._eventFocus)
    this.onFocus(this)
    return this
  }

  _handleInput() {
    this.filterInput()
    window.dispatchEvent(this._eventInput)
    this.onInput(this)
    return this
  }

  _handleKeydown(event) {
    window.dispatchEvent(this._eventKeydown)
    return this
  }

  _handlePaste(event) {
    this.filterInput()
    this.onPaste(this)
    return this
  }

  // LISTENING

  startListening() {
    this.element.addEventListener('blur', this._handleBlur)
    this.element.addEventListener('focus', this._handleFocus)
    this.element.addEventListener('input', this._handleInput)
    this.element.addEventListener('keydown', this._handleKeydown)
    this.element.addEventListener('paste', this._handlePaste)
    return this
  }

  stopListening() {
    this.element.removeEventListener('blur', this._handleBlur)
    this.element.removeEventListener('focus', this._handleFocus)
    this.element.removeEventListener('input', this._handleInput)
    this.element.removeEventListener('keydown', this._handleKeydown)
    this.element.removeEventListener('paste', this._handlePaste)
    return this
  }

}