import {
  TextBoxModel,
} from '../rocket'

export const _UITextArea_eventName_input: unique symbol = Symbol()
export const _UITextArea_eventName_keydown: unique symbol = Symbol()
export const _UITextArea_event_input: unique symbol = Symbol()
export const _UITextArea_event_keydown: unique symbol = Symbol()

export const _textBoxModel: unique symbol = Symbol()

export interface UITextAreaConfig {
  disableLineBreaks?: boolean,
  disableTabs?: boolean,

  limitNumberOfCharacters?: boolean,
  removeLeadingWhitespaces?: boolean,
  removeMultipleWhitespaces?: boolean,

  onBlur?: (context: UITextArea) => void,
  onFocus?: (context: UITextArea) => void,
  onInput?: (context: UITextArea) => void,
  onPaste?: (context: UITextArea) => void,
}

const UITEXTAREA_CONFIG: UITextAreaConfig = {
  disableLineBreaks: false,
  disableTabs: false,
  limitNumberOfCharacters: false,
  removeLeadingWhitespaces: false,
  removeMultipleWhitespaces: false,

  onBlur: () => {},
  onFocus: () => {},
  onInput: () => {},
  onPaste: () => {},
}

export class UITextArea {

  public isInFocus: boolean = false
  public lastKeyCode: number = undefined

  public element: HTMLTextAreaElement
  public config: UITextAreaConfig

  constructor(element: HTMLTextAreaElement, config?: UITextAreaConfig) {
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

    this.element = element

    this.config = Object.assign({}, UITEXTAREA_CONFIG)
    if (typeof config === 'object') {
      this.config = config
    }

    this.initialize()
    return this
  }

  public setConfig(config: UITextAreaConfig) {
    Object.assign(this.config, config)
  }

  public initialize(): UITextArea {
    this
      .filterInput()
      .grow()
      .startListening()
    return this
  }

  get value(): string {
    return this.element.value
  }

  get selectedText(): string {
    const start: number = this.element.selectionStart
    const end: number = this.element.selectionEnd
    return this.value.substring(start, end)
  }

  set value(value: string) {
    this.element.value = value
    this.processText()
  }

  public grow(): UITextArea {
    const height: number =
      this[_textBoxModel].getTextBoxHeightFromElement(this.element)
    this.element.style.height = `${height}px`
    return this
  }

  public destroy(): UITextArea {
    this.stopListening()
    return this
  }

  public filterInput(): UITextArea {
    // Remove new lines.
    if (this.config.disableLineBreaks === true) {
      this.element.value = this.element.value.replace(/[\r\n]+/g, '')
    }
    // Remove tabs.
    if (this.config.disableTabs === true) {
      this.element.value = this.element.value.replace(/[\t]+/g, '')
    }
    // Remove multiple whitespaces to one.
    if (this.config.removeMultipleWhitespaces === true) {
      this.element.value = this.element.value.replace(/[\s]+/g, ' ')
    }
    // Remove leading whitespaces.
    if (this.config.removeLeadingWhitespaces === true) {
      this.element.value = this.element.value.replace(/^[\s]+/g, '')
    }
    // Trim element value if limit number of characters is a number.
    if (typeof this.config.limitNumberOfCharacters === 'number') {
      this.element.value = this.element.value.substring(
        0, this.config.limitNumberOfCharacters
      )
    }
    // Replace tabs with spaces.
    // TODO: Fix this because it's not working as intended.
    // this.element.value = this.element.value.replace(/[\t]+/g, '    ')
    return this
  }

  public insertString(string: string): UITextArea {
    const start: number = this.element.selectionStart
    const end: number = this.element.selectionEnd
    const text: string = this.element.value
    this.element.value = text.substring(0, start) + string + text.substring(end)
    this.element.selectionEnd = start + string.length
    return this
  }

  public processText(): UITextArea {
    this.filterInput()
    this.grow()
    return this
  }

  // HANDLER

  private handleBlur = () => {
    this.isInFocus = false
  }

  private handleFocus = () => {
    this.isInFocus = true
  }

  private handleInput = event => {
    this.config.onInput(this)
    this.processText()
    window.dispatchEvent(this[_UITextArea_event_input])
  }

  private handleKeydown = event => {
    const keyCode: number = event.keyCode
    if (keyCode === 9) {
      this.insertString('\t')
      event.preventDefault()
    }
    if (
      keyCode === 13 &&
      this.config.disableLineBreaks === true
    ) {
      event.preventDefault()
    }
    this.lastKeyCode = keyCode
    window.dispatchEvent(this[_UITextArea_event_keydown])
  }

  private handlePaste = event => {
    this.config.onPaste(this)
    this.processText()
  }

  // LISTEN

  private startListening() {
    this.element.addEventListener('blur', this.handleBlur)
    this.element.addEventListener('focus', this.handleFocus)
    this.element.addEventListener('input', this.handleInput)
    this.element.addEventListener('keydown', this.handleKeydown)
    this.element.addEventListener('paste', this.handlePaste)
    window.addEventListener('resize', this.handleInput)
    return this
  }

  private stopListening() {
    this.element.removeEventListener('blur', this.handleBlur)
    this.element.removeEventListener('focus', this.handleFocus)
    this.element.removeEventListener('input', this.handleInput)
    this.element.removeEventListener('keydown', this.handleKeydown)
    this.element.removeEventListener('paste', this.handlePaste)
    window.removeEventListener('resize', this.handleInput)
    return this
  }

}