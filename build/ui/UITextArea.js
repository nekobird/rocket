import { TextBoxModel, } from '../Rocket';
export const _UITextArea_eventName_input = Symbol();
export const _UITextArea_eventName_keydown = Symbol();
export const _UITextArea_event_input = Symbol();
export const _UITextArea_event_keydown = Symbol();
export const _textBoxModel = Symbol();
export class UITextArea {
    constructor(element, config) {
        this.disableLineBreaks = false;
        this.disableTabs = false;
        this.isInFocus = false;
        this.limitNumberOfCharacters = false;
        this.removeLeadingWhitespaces = false;
        this.removeMultipleWhitespaces = false;
        this.onBlur = () => { };
        this.onFocus = () => { };
        this.onInput = () => { };
        this.onPaste = () => { };
        this.handleBlur = () => {
            this.isInFocus = false;
            return this;
        };
        this.handleFocus = () => {
            this.isInFocus = true;
            return this;
        };
        this.handleInput = event => {
            this.onInput(this);
            this.processText();
            window.dispatchEvent(this[_UITextArea_event_input]);
            return this;
        };
        this.handleKeydown = event => {
            let keyCode = event.keyCode;
            if (keyCode === 9) {
                this.insertString('\t');
                event.preventDefault();
            }
            if (keyCode === 13 &&
                this.disableLineBreaks === true) {
                event.preventDefault();
            }
            this.lastKeyCode = keyCode;
            window.dispatchEvent(this[_UITextArea_event_keydown]);
            return this;
        };
        this.handlePaste = event => {
            this.onPaste(this);
            this.processText();
            return this;
        };
        this[_textBoxModel] = new TextBoxModel;
        this[_UITextArea_eventName_input] = 'UITextArea_onInput';
        this[_UITextArea_eventName_keydown] = 'UITextArea_onKeydown';
        this[_UITextArea_event_input] = new CustomEvent(this[_UITextArea_eventName_input]);
        this[_UITextArea_event_keydown] = new CustomEvent(this[_UITextArea_eventName_keydown]);
        this.config = config;
        this.initialize();
        return this;
    }
    initialize() {
        this.filterInput();
        this.grow();
        this.startListening();
        return this;
    }
    set config(config) {
        Object.assign(this, config);
    }
    get value() {
        return this.element.value;
    }
    get selectedText() {
        let start = this.element.selectionStart;
        let end = this.element.selectionEnd;
        return this.value.substring(start, end);
    }
    set value(value) {
        this.element.value = value;
        this.processText();
    }
    grow() {
        const height = this[_textBoxModel].getTextBoxHeightFromElement(this.element);
        this.element.style.height = `${height}px`;
        return this;
    }
    destroy() {
        this.stopListening();
        return this;
    }
    filterInput() {
        if (this.disableLineBreaks === true) {
            this.element.value = this.element.value.replace(/[\r\n]+/g, '');
        }
        if (this.disableTabs === true) {
            this.element.value = this.element.value.replace(/[\t]+/g, '');
        }
        if (this.removeMultipleWhitespaces === true) {
            this.element.value = this.element.value.replace(/[\s]+/g, ' ');
        }
        if (this.removeLeadingWhitespaces === true) {
            this.element.value = this.element.value.replace(/^[\s]+/g, '');
        }
        if (typeof this.limitNumberOfCharacters === 'number') {
            this.element.value = this.element.value.substring(0, this.limitNumberOfCharacters);
        }
        return this;
    }
    insertString(string) {
        let start = this.element.selectionStart;
        let end = this.element.selectionEnd;
        let text = this.element.value;
        this.element.value = text.substring(0, start) + string + text.substring(end);
        this.element.selectionEnd = start + string.length;
        return this;
    }
    processText() {
        this.filterInput();
        this.grow();
        return this;
    }
    startListening() {
        this.element.addEventListener('blur', this.handleBlur);
        this.element.addEventListener('focus', this.handleFocus);
        this.element.addEventListener('input', this.handleInput);
        this.element.addEventListener('keydown', this.handleKeydown);
        this.element.addEventListener('paste', this.handlePaste);
        window.addEventListener('resize', this.handleInput);
        return this;
    }
    stopListening() {
        this.element.removeEventListener('blur', this.handleBlur);
        this.element.removeEventListener('focus', this.handleFocus);
        this.element.removeEventListener('input', this.handleInput);
        this.element.removeEventListener('keydown', this.handleKeydown);
        this.element.removeEventListener('paste', this.handlePaste);
        window.removeEventListener('resize', this.handleInput);
        return this;
    }
}
//# sourceMappingURL=UITextArea.js.map