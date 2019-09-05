export type HTMLElements = NodeListOf<HTMLElement> | HTMLCollection | HTMLElement[];

export type Elements = NodeListOf<Element> | Element[] | HTMLElements;

export type InputOrTextArea = HTMLTextAreaElement | HTMLInputElement;

export class DOMUtil {
  public static isElement(...things: any[]): boolean {
    if (things.length === 0) {
      return false;
    }

    const isElement = thing => {
      return (
        thing !== null
        && typeof thing === 'object'
        && typeof thing.nodeType === 'number'
        && thing.nodeType === 1
        && thing instanceof Element === true
      )
    }

    return things.every(isElement);
  }

  public static isNodeListOfElement(...things: any[]): boolean {
    if (things.length === 0) {
      return false;
    }

    const isNodeListOfElement = thing => {
      return (
        typeof thing === 'object'
        && NodeList.prototype.isPrototypeOf(thing) === true
        && [...thing].every(element => DOMUtil.isElement(element)) === true
      );
    }

    return things.every(isNodeListOfElement);
  }

  public static toElementArray(elements: Element | Elements): Element[] {
    if (
      this.isNodeListOfElement(elements) === true
      || this.isHTMLCollection(elements) === true
    ) {
      elements = elements as NodeListOf<Element> | HTMLCollection;

      return [...elements];
    } else if (this.isElement(elements) === true) {
      const element = elements as Element;

      return [element];
    } else if (
      Array.isArray(elements) === true
      && this.isElement(...elements as unknown[]) === true
    ) {
      return elements as Element[];
    }

    return [];
  }

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

  public static toHTMLElementArray(elements: HTMLElement | HTMLElements): HTMLElement[] {
    if (
      this.isNodeListOfHTMLElement(elements) === true
      || this.isHTMLCollection(elements) === true
    ) {
      elements = elements as NodeListOf<HTMLElement> | HTMLCollection;

      return [...elements] as HTMLElement[];
    } else if (
      this.isHTMLElement(elements) === true
    ) {
      const element = elements as HTMLElement;

      return [element];
    } else if (
      Array.isArray(elements) === true
      && this.isHTMLElement(...elements as unknown[]) === true
    ) {
      return elements as HTMLElement[];
    }

    return [];
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

  public static prependChild(parent: HTMLElement, child: HTMLElement): void {
    if (parent.childElementCount > 0) {
      parent.insertBefore(child, parent.childNodes[0]);
    } else {
      parent.appendChild(child);
    }
  }
}
