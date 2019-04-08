import {
  TextBoxModel
} from '../Rocket'

export const UITEXTAREA_EVENT_NAME_INPUT = Symbol('eventNameInput')
export const UITEXTAREA_EVENT_NAME_KEYDOWN = Symbol('eventNameKeydown')
export const UITEXTAREA_EVENT_INPUT = Symbol('eventInput')
export const UITEXTAREA_EVENT_KEYDOWN = Symbol('eventKeydown')

export class UITextArea {

  constructor(element, properties) {
    this.textBoxModel = new TextBoxModel

    // FLAGS
    this.disableLineBreaks = false
    this.disableTabs = false
    this.isInFocus = false
    this.limitNumberOfCharacters = false
    this.removeLeadingWhitespaces = false
    this.removeMultipleWhitespaces = false

    // CALLBACKS
    this.onBlur = () => {}
    this.onFocus = () => {}
    this.onInput = () => {}
    this.onPaste = () => {}

    // PROPERTIES
    this.lastKeyCode

    // EVENT NAMES
    this[UITEXTAREA_EVENT_NAME_INPUT] = 'UITextAreaOnInput'
    this[UITEXTAREA_EVENT_NAME_KEYDOWN] = 'UITextAreaOnKeydown'

    // EVENTS
    this[UITEXTAREA_EVENT_INPUT] = new CustomEvent(
      this[UITEXTAREA_EVENT_NAME_INPUT]
    )
    this[UITEXTAREA_EVENT_KEYDOWN] = new CustomEvent(
      this[UITEXTAREA_EVENT_NAME_KEYDOWN]
    )

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
    const height = this.textBoxModel.getTextBoxHeightFromElement(this.element)
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

  // HANDLER

  handleBlur() {
    this.isInFocus = false
    return this
  }

  handleFocus() {
    this.isInFocus = true
    return this
  }

  handleInput(event) {
    this.onInput(this)
    this.processText()
    window.dispatchEvent(this[UITEXTAREA_EVENT_INPUT])
    return this
  }

  handleKeydown(event) {
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
    window.dispatchEvent(this[UITEXTAREA_EVENT_KEYDOWN])
    return this
  }

  handlePaste(event) {
    this.onPaste(this)
    this.processText()
    return this
  }

  // LISTEN

  startListening() {
    this.element.addEventListener('blur', this.handleBlur.bind(this))
    this.element.addEventListener('focus', this.handleFocus.bind(this))
    this.element.addEventListener('input', this.handleInput.bind(this))
    this.element.addEventListener('keydown', this.handleKeydown.bind(this))
    this.element.addEventListener('paste', this.handlePaste.bind(this))
    window.addEventListener('resize', this.handleInput.bind(this))
    return this
  }

  stopListening() {
    this.element.removeEventListener('blur', this.handleBlur.bind(this))
    this.element.removeEventListener('focus', this.handleFocus.bind(this))
    this.element.removeEventListener('input', this.handleInput.bind(this))
    this.element.removeEventListener('keydown', this.handleKeydown.bind(this))
    this.element.removeEventListener('paste', this.handlePaste.bind(this))
    window.removeEventListener('resize', this.handleInput.bind(this))
    return this
  }

}