import {
  Size,
} from '../rocket';

export class DOMUtil {
  public static isHTMLElement(element?): boolean {
    if (
         typeof element === 'object'
      && typeof element.nodeType === 'number'
      && element.nodeType === 1
      && element instanceof HTMLElement === true
    ) return true;
    return false;
  }

  public static removeElement(element: HTMLElement): void {
    if (element.parentNode !== null) {
      element.parentNode.removeChild(element);
      element.remove();
    } else {
      element.remove();
    }
  }

  public static onImageLoad(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onerror = () => reject();
      img.onload  = () => resolve(src);
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
            width:  img.naturalWidth,
            height: img.naturalHeight
          });
        }
      }, 10);
    });
  }

  public static prependChild(parent: HTMLElement, child: HTMLElement) {
    if (parent.childElementCount > 0) {
      parent.insertBefore(child, parent.childNodes[0]);
    } else {
      parent.appendChild(child);
    }
  }
}
