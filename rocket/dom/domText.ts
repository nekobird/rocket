import {
  DOMStyle,
} from '../rocket';

export class DOMText {

  public static getTextFromElement(element: HTMLElement): string {
    if (
         element instanceof HTMLTextAreaElement
      || element instanceof HTMLInputElement
      || element.nodeName === 'INPUT'
      || element.nodeName === 'TEXTAREA'
    ) return (element as HTMLTextAreaElement | HTMLInputElement).value;

    if (element.textContent !== null) return element.textContent;

    return '';
  }

  public static getElementTextBoxWidth(element: HTMLElement): number {
    return element.offsetWidth - DOMStyle.getTotalHorizontalInnerSpace(element);
  }

  public static getElementTextBoxHeight(element: HTMLElement): number {
    return element.offsetHeight - DOMStyle.getTotalVerticalInnerSpace(element);
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
      DOMStyle.copyStylesFrom(
        element, ['fontSize', 'fontFamily', 'lineHeight'], temp,
      );
      temp.style.maxWidth = `${element.clientWidth - DOMStyle.getTotalHorizontalInnerSpace(element)}px`;
      temp.textContent = text;

      if (element.parentNode !== null) {
        element.parentNode.appendChild(temp);
      } else {
        document.appendChild(temp);
      }

      const startingHeight = temp.clientHeight;
    
      let textCopy = text;

      while (true) {
        if (typeof words[index] === 'undefined') break;
        const wordLength = words[index].length + 1;
        textCopy = textCopy.substring(0, textCopy.length - wordLength);
        temp.textContent = textCopy;
        lastLine.unshift(words[index]);
        if (temp.clientHeight < startingHeight) break;
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
