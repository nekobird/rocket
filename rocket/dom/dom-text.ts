import {
  DOMBoxModel,
  DOMStyle,
} from '../rocket';

const TEXT_BOX_MODEL_ATTRIBUTES = {
  border: 'none',
  height: '0',
  left: '0',
  overflowWrap: 'normal',
  overflowX: 'hidden',
  overflowY: 'hidden',
  padding: '0',
  position: 'fixed',
  resize: 'none',
  top: '0',
  visibility: 'hidden',
  whiteSpace: 'nowrap',
  width: '0',
  zIndex: '-9999',
};

const STYLE_PROPERTIES = [
  'borderBottomStyle',
  'borderBottomWidth',
  'borderLeftStyle',
  'borderLeftWidth',
  'borderRightStyle',
  'borderRightWidth',
  'borderTopStyle',
  'borderTopWidth',
  'boxSizing',
  'height',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'width',
];

const FONT_STYLE_PROPERTIES = [
  'direction',
  'fontFamily',
  'fontSize',
  'fontSizeAdjust',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'tabSize',
  'textAlign',
  'textDecoration',
  'textIndent',
  'textOverflow',
  'textTransform',
  'whiteSpace',
  'wordBreak',
  'wordSpacing',
  'wordWrap',
];

interface StyleObject {
  [name: string]: string;
}

export class DOMText {
  public static getTextBoxHeightFromElement(element: HTMLElement, text?: string, styleOverride?: StyleObject): number {
    const modelElement = document.createElement('TEXTAREA') as HTMLTextAreaElement;

    Object.assign(modelElement.style, TEXT_BOX_MODEL_ATTRIBUTES);

    const elementStyle = window.getComputedStyle(element);

    [...STYLE_PROPERTIES, ...FONT_STYLE_PROPERTIES].forEach(property => {
      modelElement.style[property] = elementStyle[property];
    });

    Object.assign(modelElement.style, {
      height: '0',
      maxHeight: '0',
      whiteSpace: 'pre-wrap',
    });

    if (typeof styleOverride === 'object') {
      Object.assign(modelElement.style, styleOverride);
    }

    if (typeof text === 'string') {
      modelElement.value = text;
    } else {
      modelElement.value = this.getTextFromElement(element).trim();
    }

    // Set offset for when boxSizing is set to border-box.
    let offset = 0;

    if (DOMStyle.getStyleValue(element, 'boxSizing') === 'border-box') {
      offset = DOMBoxModel.getTotalVerticalBorderWidths(element);
    } else {
      offset -= DOMBoxModel.getTotalVerticalPaddings(element);
    }

    document.body.appendChild(modelElement);

    const result = modelElement.scrollHeight + offset;

    document.body.removeChild(modelElement);

    modelElement.remove();

    return result;
  }

  public static getTextBoxWidthFromElement(element: HTMLElement, text?: string, styleOverride?: StyleObject): number {
    const modelElement = document.createElement('DIV');

    Object.assign(modelElement.style, TEXT_BOX_MODEL_ATTRIBUTES);

    const elementStyle = window.getComputedStyle(element);

    [...STYLE_PROPERTIES, ...FONT_STYLE_PROPERTIES].forEach(property => {
      modelElement.style[property] = elementStyle[property];
    });

    Object.assign(modelElement.style, {
      borderLeftWidth: '0',
      borderRightWidth: '0',
      boxSizing: 'content-box',
      minWidth: '0',
      paddingLeft: '0',
      paddingRight: '0',
      whiteSpace: 'nowrap',
      width: '0',
      wordBreak: 'normal',
      wordWrap: 'normal',
    });

    if (typeof styleOverride === 'object') {
      Object.assign(modelElement.style, styleOverride);
    }

    let textString;

    if (typeof text === 'string') {
      textString = text;
    } else {
      textString = this.getTextFromElement(element).trim();
    }

    textString = textString.replace(/[\n\r]/g, '<br>');
    textString = textString.replace(/[\t]/g, '&#9');
    textString = textString.replace(/[\s]/g, '&nbsp');
    modelElement.innerHTML = textString;

    document.body.appendChild(modelElement);

    const result = modelElement.scrollWidth;

    document.body.removeChild(modelElement);

    modelElement.remove();

    return result;
  }

  public static getTextFromElement(element: HTMLElement): string {
    if (
      element instanceof HTMLTextAreaElement
      || element instanceof HTMLInputElement
      || element.nodeName === 'INPUT'
      || element.nodeName === 'TEXTAREA'
    ) {
      return (element as HTMLTextAreaElement | HTMLInputElement).value;
    }

    if (element.textContent !== null) {
      return element.textContent;
    }

    return '';
  }

  public static setElementText(element: HTMLElement, text: string) {
    if (
      element instanceof HTMLTextAreaElement
      || element instanceof HTMLInputElement
      || element.nodeName === 'INPUT'
      || element.nodeName === 'TEXTAREA'
    ) {
      const input = element as HTMLTextAreaElement | HTMLInputElement;

      input.value = text;
    } else {
      element.textContent = text;
    }
  }

  public static getLastLine(element: HTMLElement): string {
    const text = element.textContent;

    if (text !== null) {
      const words = text.split(' ');

      const lastLine: string[] = [];

      let index = words.length - 1;

      const temp = document.createElement('div');

      temp.style.padding = '0';
      temp.style.visibility = 'none';

      DOMStyle.copyStylesFrom(element, ['fontSize', 'fontFamily', 'lineHeight'], temp);

      const maxWidth = element.clientWidth - DOMBoxModel.getTotalHorizontalInnerSpace(element);

      temp.style.maxWidth = `${maxWidth}px`;

      temp.textContent = text;

      if (element.parentNode !== null) {
        element.parentNode.appendChild(temp);
      } else {
        document.appendChild(temp);
      }

      const startingHeight = temp.clientHeight;

      let textCopy = text;

      while (true) {
        if (typeof words[index] === 'undefined') {
          break;
        }

        const wordLength = words[index].length + 1;

        textCopy = textCopy.substring(0, textCopy.length - wordLength);

        temp.textContent = textCopy;

        lastLine.unshift(words[index]);

        if (temp.clientHeight < startingHeight) {
          break;
        }

        index--;
      }

      if (element.parentNode !== null) {
        element.parentNode.removeChild(temp);
      } else {
        document.removeChild(temp);
      }

      return lastLine.join(' ');
    }

    return '';
  }
}
