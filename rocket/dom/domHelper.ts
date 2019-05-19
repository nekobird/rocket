export class DOMHelper {

  public static onImageLoad(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onerror = () => reject()
      img.onload = () => resolve()
      img.src = src
    })
  }

  public static getTextFromElement(element: HTMLElement): string {
    if (
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLInputElement ||
      element.nodeName === 'INPUT' ||
      element.nodeName === 'TEXTAREA'
    ) {
      return (<HTMLTextAreaElement | HTMLInputElement>element).value
    }
    if (element.textContent !== null) {
      return element.textContent
    }
    return ''
  }
}