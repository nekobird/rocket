import {
  DOMUtil,
} from '../rocket'

export class UITextField {

  // FLAGS
  public allowDecimals: boolean = false
  public disableTabs: boolean = false
  public isEmpty: boolean = false
  public isInFocus: boolean = false
  public isShowingValuePlaceholder: boolean = false
  public limitNumberOfCharacters: boolean = false
  public numbersOnly: boolean = false
  public removeLeadingWhitespaces: boolean = false
  public removeMultipleWhitespaces: boolean = false

  public placeholder

  private _valuePlaceholder
  private _value

  // CALLBACKS
  public onBlur
  public onFocus
  public onInput
  public onPaste

  // EVENT NAMES
  public _eventBlurName: string = 'UITextFieldOnBlur'
  public _eventFocusName: string = 'UITextFieldOnFocus'
  public _eventInputName: string = 'UITextFieldOnInput'
  public _eventKeydownName: string = 'UITextFieldOnKeydown'
  public _eventPasteName: string = 'UITextFieldOnPaste'

  // EVENTS
  private _eventBlur
  private _eventFocus
  private _eventInput
  private _eventKeydownw

  public element

  constructor(element, properties) {
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
    this.processValuePlaceholder()
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

  private processValuePlaceholder() {
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

  get selectedText(): string {
    return this.element.value.substring(
      this.element.selectionStart, this.element.selectionEnd
    )
  }

  insertString(string: string): UITextField {
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

  private eventHandle_blur() {
    this.isInFocus = false
    this.processValuePlaceholder()
    this.onBlur(this)
    window.dispatchEvent(this._eventBlur)
    return this
  }

  private eventHandle_focus() {
    this.isInFocus = true
    this.processValuePlaceholder()
    window.dispatchEvent(this._eventFocus)
    this.onFocus(this)
    return this
  }

  private eventHandle_input() {
    this.filterInput()
    window.dispatchEvent(this._eventInput)
    this.onInput(this)
    return this
  }

  private eventHandle_keydown(event) {
    window.dispatchEvent(this._eventKeydown)
    return this
  }

  private eventHandle_paste(event) {
    this.filterInput()
    this.onPaste(this)
    return this
  }

  // LISTENING

  startListening() {
    this.element.addEventListener('blur', this.eventHandle_blur)
    this.element.addEventListener('focus', this.eventHandle_focus)
    this.element.addEventListener('input', this.eventHandle_input)
    this.element.addEventListener('keydown', this.eventHandle_keydown)
    this.element.addEventListener('paste', this.eventHandle_paste)
    return this
  }

  stopListening() {
    this.element.removeEventListener('blur', this.eventHandle_blur)
    this.element.removeEventListener('focus', this.eventHandle_focus)
    this.element.removeEventListener('input', this.eventHandle_input)
    this.element.removeEventListener('keydown', this.eventHandle_keydown)
    this.element.removeEventListener('paste', this.eventHandle_paste)
    return this
  }

}