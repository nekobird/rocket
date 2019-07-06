import {
  Size,
} from '../rocket';

export class DOMUtil {

  public static isHTMLElement(element?: HTMLElement): boolean {
    if (
      typeof element === 'object'
      && typeof element.nodeType === 'number'
      && element.nodeType === 1
      && element instanceof HTMLElement === true
    )
      return true;
    return false;
  }

  public static onImageLoad(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onerror = () => reject();
      img.onload = () => resolve(src);
      img.src = src;
    });
  }

  public static getImageSize(src: string): Promise<Size> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onerror = () => reject();
      img.src = src;
      const intervalId = setInterval(() => {
        if (typeof img.naturalWidth === 'number') {
          clearInterval(intervalId);
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        }
      }, 10);
    });
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
    if (element.textContent !== null)
      return element.textContent;
    return '';
  }
}
