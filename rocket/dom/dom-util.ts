export type HTMLElements = NodeListOf<HTMLElement> | HTMLCollection | HTMLElement[];

export type InputOrTextArea = HTMLTextAreaElement | HTMLInputElement;

export class DOMUtil {
  public static isHTMLElement(...things: any[]): boolean {
    if (things.length === 0) {
      return false;
    }

    const isHTMLElement = thing => {
      return (
        thing !== null
        && typeof thing === 'object'
        && typeof thing.nodeType === 'number'
        && thing.nodeType === 1
        && thing instanceof HTMLElement === true
      )
    }

    return things.every(isHTMLElement);
  }

  public static isNodeListOfHTMLElement(...things: any[]): boolean {
    if (things.length === 0) {
      return false;
    }

    const isNodeListOfHTMLElement = thing => {
      return (
        typeof thing === 'object'
        && NodeList.prototype.isPrototypeOf(thing) === true
        && [...thing].every(element => DOMUtil.isHTMLElement(element)) === true
      );
    }

    return things.every(isNodeListOfHTMLElement);
  }

  public static isHTMLCollection(...things: any[]): boolean {
    if (things.length === 0) {
      return false;
    }

    const isHTMLCollection = thing => {
      return (
        typeof thing === 'object'
        && HTMLCollection.prototype.isPrototypeOf(thing) === true
      );
    }

    return things.every(isHTMLCollection);
  }

  public static isInputOrTextArea(...things: any[]): boolean {
    if (things.length === 0) {
      return false;
    }

    const isInputOrTextArea = thing => {
      return (
        typeof thing === 'object'
        && typeof thing.nodeType === 'number'
        && thing.nodeType === 1
        && (
          (thing.nodeName === 'INPUT' && thing instanceof HTMLInputElement)
          || (thing.nodeName === 'TEXTAREA' && thing instanceof HTMLTextAreaElement)
        )
      );
    }

    return things.every(isInputOrTextArea);
  }

  public static toHTMLElementArray(collection: HTMLElement | HTMLElements): HTMLElement[] {
    if (
      this.isNodeListOfHTMLElement(collection) === true
      || this.isHTMLCollection(collection) === true
    ) {
      const elements = collection as NodeListOf<HTMLElement> | HTMLCollection;

      return [...elements] as HTMLElement[];
    } else if (
      this.isHTMLElement(collection) === true
    ) {
      const element = collection as HTMLElement;

      return [element];
    } else if (
      Array.isArray(collection) === true
      && this.isHTMLElement(...collection as unknown[]) === true
    ) {
      return collection as HTMLElement[];
    }

    return [];
  }

  public static prependChild(parent: HTMLElement, child: HTMLElement): void {
    if (parent.childElementCount > 0) {
      parent.insertBefore(child, parent.childNodes[0]);
    } else {
      parent.appendChild(child);
    }
  }
}
