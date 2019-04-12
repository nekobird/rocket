import {
  TextBoxModel,
} from '../Rocket'

interface Config {
  disableLineBreaks?: boolean,
  disableTabs?: boolean,
  isInFocus?: boolean,
  limitNumberOfCharacters?: boolean,
  removeLeadingWhitespaces?: boolean,
  removeMultipleWhitespaces?: boolean,
  onBlur?: Function,
  onFocus?: Function,
  onInput?: Function,
  onPaste?: Function,
}

export const _UITextArea_eventName_input: symbol = Symbol()
export const _UITextArea_eventName_keydown: symbol = Symbol()
export const _UITextArea_event_input: symbol = Symbol()
export const _UITextArea_event_keydown: symbol = Symbol()

export const _textBoxModel: symbol = Symbol()

export class UITextArea {

  public element: HTMLTextAreaElement

  // FLAGS
  public disableLineBreaks: boolean = false
  public disableTabs: boolean = false
  public isInFocus: boolean = false
  public limitNumberOfCharacters: boolean = false
  public removeLeadingWhitespaces: boolean = false
  public removeMultipleWhitespaces: boolean = false

  // CALLBACKS
  onBlur: Function = () => {}
  onFocus: Function = () => {}
  onInput: Function = () => {}
  onPaste: Function = () => {}

  // PROPERTIES
  public lastKeyCode: number

  constructor(element?: HTMLElement, config?) {

    this[_textBoxModel] = new TextBoxModel

    // EVENT NAMES
    this[_UITextArea_eventName_input] = 'UITextArea_onInput'
    this[_UITextArea_eventName_keydown] = 'UITextArea_onKeydown'

    // EVENTS
    this[_UITextArea_event_input] = new CustomEvent(
      this[_UITextArea_eventName_input]
    )
    this[_UITextArea_event_keydown] = new CustomEvent(
      this[_UITextArea_eventName_keydown]
    )

    this.config = config

    this.initialize()
    return this
  }

  initialize() {
    this.filterInput()
    this.grow()
    this.startListening()
    return this
  }

  set config(config: Config) {
    Object.assign(this, config)
  }

  get value(): string {
    return this.element.value
  }

  get selectedText(): string {
    let start = this.element.selectionStart
    let end = this.element.selectionEnd
    return this.value.substring(start, end)
  }

  set value(value: string) {
    this.element.value = value
    this.processText()
  }

  grow() {
    const height = this[_textBoxModel].getTextBoxHeightFromElement(this.element)
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
      this.element.value = this.element.value.substring(
        0, this.limitNumberOfCharacters
      )
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

  // HANDLER

  private handleBlur = () => {
    this.isInFocus = false
    return this
  }

  private handleFocus = () => {
    this.isInFocus = true
    return this
  }

  private handleInput = event => {
    this.onInput(this)
    this.processText()
    window.dispatchEvent(this[_UITextArea_event_input])
    return this
  }

  private handleKeydown = event => {
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
    this.lastKeyCode = keyCode
    window.dispatchEvent(this[_UITextArea_event_keydown])
    return this
  }

  private handlePaste = event => {
    this.onPaste(this)
    this.processText()
    return this
  }

  // LISTEN

  startListening() {
    this.element.addEventListener('blur', this.handleBlur)
    this.element.addEventListener('focus', this.handleFocus)
    this.element.addEventListener('input', this.handleInput)
    this.element.addEventListener('keydown', this.handleKeydown)
    this.element.addEventListener('paste', this.handlePaste)
    window.addEventListener('resize', this.handleInput)
    return this
  }

  stopListening() {
    this.element.removeEventListener('blur', this.handleBlur)
    this.element.removeEventListener('focus', this.handleFocus)
    this.element.removeEventListener('input', this.handleInput)
    this.element.removeEventListener('keydown', this.handleKeydown)
    this.element.removeEventListener('paste', this.handlePaste)
    window.removeEventListener('resize', this.handleInput)
    return this
  }

}