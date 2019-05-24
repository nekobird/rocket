import {
  DOMStyle,
  TextBoxModel,
} from '../rocket';

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
  public textBoxModel: TextBoxModel;

  public config: TextAreaFieldConfig;
  public element: HTMLTextAreaElement;
  
  public isInFocus: boolean = false;
  public previousKeyCode?: number;

  constructor(element: HTMLTextAreaElement, config?: Partial<TextAreaFieldConfig>) {
    this.textBoxModel = new TextBoxModel;

    this.element = element;

    this.config = Object.assign({}, TEXTAREAFIELD_DEFAULT_CONFIG);
    if (typeof config === 'object') {
      this.setConfig(config);
    }
  }

  public setConfig(config: Partial<TextAreaFieldConfig>) {
    Object.assign(this.config, config);
  }

  public initialize(): this {
    this.filterInput();
    this.grow();
    this.listen();
    return this;
  }

  get selected(): string {
    const start = this.element.selectionStart;
    const end = this.element.selectionEnd;
    return this.value.substring(start, end);
  }

  public insert(string: string): this {
    const start: number = this.element.selectionStart;
    const end: number = this.element.selectionEnd;
    const text: string = this.element.value;
    this.element.value = text.substring(0, start) + string + text.substring(end);
    this.element.selectionEnd = start + string.length;
    return this;
  }

  get value(): string {
    return this.element.value;
  }

  set value(value: string) {
    this.element.value = value;
    this.filterAndGrow();
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
      return this.textBoxModel.getTextBoxHeightFromElement(this.element, text);
    } 
    return this.textBoxModel.getTextBoxHeightFromElement(this.element);
  }

  // TODO Rename This...
  public filterAndGrow(): this {
    this.filterInput();
    this.grow();
    return this;
  }
  
  public grow(): this {
    const height: number = this.textBoxModel.getTextBoxHeightFromElement(this.element);
    this.element.style.height = `${height}px`;
    this.config.onGrow(height, this);
    return this;
  }

  public filterInput(): this {
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
    this.filterAndGrow();
    this.config.onInput(this);
  }

  private handleKeydown = event => {
    const keyCode = event.keyCode;

    if (keyCode === 9) {
      this.insert('\t');
      event.preventDefault();
    }

    if (
      keyCode === 13
      && this.config.disableLineBreaks === true
    ) {
      event.preventDefault();
    }

    this.previousKeyCode = keyCode;
  }

  private handlePaste = event => {
    this.config.onPaste(this);
    this.filterAndGrow();
  }

  // @listen

  private listen() {
    this.element.addEventListener('blur', this.handleBlur);
    this.element.addEventListener('focus', this.handleFocus);
    this.element.addEventListener('input', this.handleInput);
    this.element.addEventListener('keydown', this.handleKeydown);
    this.element.addEventListener('paste', this.handlePaste);
    window.addEventListener('resize', this.handleInput);
    return this;
  }

  private stopListen() {
    this.element.removeEventListener('blur', this.handleBlur);
    this.element.removeEventListener('focus', this.handleFocus);
    this.element.removeEventListener('input', this.handleInput);
    this.element.removeEventListener('keydown', this.handleKeydown);
    this.element.removeEventListener('paste', this.handlePaste);
    window.removeEventListener('resize', this.handleInput);
    return this;
  }
}
