import {
  DOMStyle,
  TextBoxModel,
} from '../rocket';

export const _TextAreaField_eventName_input: unique symbol = Symbol();
export const _TextAreaField_eventName_keydown: unique symbol = Symbol();
export const _TextAreaField_event_input: unique symbol = Symbol();
export const _TextAreaField_event_keydown: unique symbol = Symbol();

export const _textBoxModel: unique symbol = Symbol();

export interface TextAreaFieldConfig {
  disableLineBreaks: boolean;
  disableTabs: boolean;

  limitNumberOfCharacters: boolean;
  removeLeadingWhitespaces: boolean;
  removeMultipleWhitespaces: boolean;

  onBlur: (context: TextAreaField) => void;
  onFocus: (context: TextAreaField) => void;
  onInput: (context: TextAreaField) => void;
  onPaste: (context: TextAreaField) => void;
  onGrow: (height: number, context: TextAreaField) => void;
}

const TEXTAREAFIELD_DEFAULT_CONFIG: TextAreaFieldConfig = {
  disableLineBreaks: false,
  disableTabs: false,
  limitNumberOfCharacters: false,
  removeLeadingWhitespaces: false,
  removeMultipleWhitespaces: false,

  onBlur: () => {},
  onFocus: () => {},
  onInput: () => {},
  onPaste: () => {},
  onGrow: () => {},
};

export class TextAreaField {

  public config: TextAreaFieldConfig;

  public isInFocus: boolean = false;
  public lastKeyCode?: number;

  public element: HTMLTextAreaElement;

  constructor(element: HTMLTextAreaElement, config?: Partial<TextAreaFieldConfig>) {
    this[_textBoxModel] = new TextBoxModel;

    // @event_names

    this[_TextAreaField_eventName_input] = 'TextAreaField_onInput';
    this[_TextAreaField_eventName_keydown] = 'TextAreaField_onKeydown';

    // @events

    this[_TextAreaField_event_input] = new CustomEvent(
      this[_TextAreaField_eventName_input]
    );

    this[_TextAreaField_event_keydown] = new CustomEvent(
      this[_TextAreaField_eventName_keydown]
    );

    this.element = element;

    this.config = Object.assign({}, TEXTAREAFIELD_DEFAULT_CONFIG);
    if (typeof config === 'object') {
      this.setConfig(config);
    }

    this.initialize();
    return this;
  }

  public setConfig(config: Partial<TextAreaFieldConfig>) {
    Object.assign(this.config, config);
  }

  public initialize(): TextAreaField {
    this.filterInput();
    this.grow();
    this.startListening();
    return this;
  }

  get selectedText(): string {
    const start: number = this.element.selectionStart;
    const end: number = this.element.selectionEnd;
    return this.value.substring(start, end);
  }

  get value(): string {
    return this.element.value;
  }

  set value(value: string) {
    this.element.value = value;
    this.processText();
  }

  get isSingleLine(): boolean {
    return (this.getHeight('') === this.getHeight());
  }

  get lineCount(): number {
    const lineHeight = <number>DOMStyle.getLineHeight(this.element);
    const offset = this.getHeight('') - lineHeight;
    return (this.getHeight() - offset) / lineHeight;
  }

  public getHeight(text?: string): number {
    if (typeof text === 'string') {
      return this[_textBoxModel].getTextBoxHeightFromElement(this.element, text);
    } 
    return this[_textBoxModel].getTextBoxHeightFromElement(this.element);
  }

  public grow(): TextAreaField {
    const height: number = this[_textBoxModel].getTextBoxHeightFromElement(this.element);
    this.element.style.height = `${height}px`;
    this.config.onGrow(height, this);
    return this;
  }

  public destroy(): TextAreaField {
    this.stopListening();
    return this;
  }

  public filterInput(): TextAreaField {
    // Remove new lines.
    if (this.config.disableLineBreaks === true) {
      this.element.value = this.element.value.replace(/[\r\n]+/g, '');
    }
    // Remove tabs.
    if (this.config.disableTabs === true) {
      this.element.value = this.element.value.replace(/[\t]+/g, '');
    }
    // Remove multiple whitespaces to one.
    if (this.config.removeMultipleWhitespaces === true) {
      this.element.value = this.element.value.replace(/[\s]+/g, ' ');
    }
    // Remove leading whitespaces.
    if (this.config.removeLeadingWhitespaces === true) {
      this.element.value = this.element.value.replace(/^[\s]+/g, '');
    }
    // Trim element value if limit number of characters is a number.
    if (typeof this.config.limitNumberOfCharacters === 'number') {
      this.element.value = this.element.value.substring(
        0, this.config.limitNumberOfCharacters
      );
    }
    // Replace tabs with spaces.
    // TODO: Fix this because it's not working as intended.
    // this.element.value = this.element.value.replace(/[\t]+/g, '    ')
    return this;
  }

  public insertString(string: string): TextAreaField {
    const start: number = this.element.selectionStart;
    const end: number = this.element.selectionEnd;
    const text: string = this.element.value;
    this.element.value = text.substring(0, start) + string + text.substring(end);
    this.element.selectionEnd = start + string.length;
    return this;
  }

  public processText(): TextAreaField {
    this.filterInput();
    this.grow();
    return this;
  }

  // @event_handler

  private handleBlur = () => {
    this.isInFocus = false;
    this.config.onBlur(this);
  }

  private handleFocus = () => {
    this.isInFocus = true;
    this.config.onFocus(this);
  }

  private handleInput = event => {
    this.processText();
    this.config.onInput(this);
    window.dispatchEvent(this[_TextAreaField_event_input]);
  }

  private handleKeydown = event => {
    const keyCode: number = event.keyCode;

    if (keyCode === 9) {
      this.insertString('\t');
      event.preventDefault();
    }

    if (
      keyCode === 13
      && this.config.disableLineBreaks === true
    ) {
      event.preventDefault();
    }

    this.lastKeyCode = keyCode;
    window.dispatchEvent(this[_TextAreaField_event_keydown]);
  }

  private handlePaste = event => {
    this.config.onPaste(this);
    this.processText();
  }

  // @listen

  private startListening() {
    this.element.addEventListener('blur', this.handleBlur);
    this.element.addEventListener('focus', this.handleFocus);
    this.element.addEventListener('input', this.handleInput);
    this.element.addEventListener('keydown', this.handleKeydown);
    this.element.addEventListener('paste', this.handlePaste);
    window.addEventListener('resize', this.handleInput);
    return this;
  }

  private stopListening() {
    this.element.removeEventListener('blur', this.handleBlur);
    this.element.removeEventListener('focus', this.handleFocus);
    this.element.removeEventListener('input', this.handleInput);
    this.element.removeEventListener('keydown', this.handleKeydown);
    this.element.removeEventListener('paste', this.handlePaste);
    window.removeEventListener('resize', this.handleInput);
    return this;
  }
}